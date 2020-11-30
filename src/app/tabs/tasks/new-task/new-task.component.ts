import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamService } from 'src/app/services/teams/team.service';
import { Team } from 'src/app/models/team';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Equipment } from 'src/app/models/equipment';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/tasks/task.service';
import {
  faCalendar,
  faInfoCircle,
  faPlusSquare,
  faMinusCircle,
  faMinusSquare,
  faFileDownload,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from 'src/app/services/files/file.service';
import { Template } from 'src/app/models/template';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UserProfile } from 'src/app/models/user-profile';
import { durationRegex } from 'src/app/shares/consts';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit, OnDestroy {

  // Local variables
  equipments: Equipment[];
  teams: Team[];

  teamSubscription: Subscription;
  equipmentSubscription: Subscription;
  creationError = false;

  // Icons
  faInfoCircle = faInfoCircle;
  faPlusSquare = faPlusSquare;
  faMinusCircle = faMinusCircle;
  faMinusSquare = faMinusSquare;
  faCalendar = faCalendar;
  faFileDownload = faFileDownload;
  faPlus = faPlus;
  model: NgbDateStruct;

  // Multiple Select
  teamsList = [];
  equipmentList = [];
  triggerConditionsList = [];
  selectedTriggerCondition = [];
  endConditionsList = [];
  selectedEndConditions = [];
  dropdownTeamsSettings: IDropdownSettings;
  dropdownEquipmentsSettings: IDropdownSettings;
  dropdownTriggerConditionsSettings: IDropdownSettings;
  dropdownEndConditionsSettings: IDropdownSettings;

  // Trigger Conditions
  triggerConditions = [];
  triggerConditionSelectTemplate = null;
  triggerConditionDurationRegex: string;
  triggerConditionDurationError = false;

  // End Conditions
  endConditions = [];
  endConditionSelectTemplate = null;

  // Files
  filesSubject = new Subject<File[]>();
  filesSubscription: Subscription;
  newFiles: any[] = []; // {name, data}
  templateFiles: any[] = []; // {id, name}

  // Forms
  createForm: FormGroup;

  // Templates
  templates: Template[] = [];
  templatesSubscription: Subscription;
  selectedTemplate: Template = null;
  requirements: any = null;

  // Current User
  currentUser: UserProfile;
  currentUserSubscription: Subscription;

  // Equipments
  selectedEquipment: Equipment = null;

  /**
   * Constructor for the NewTeamComponent
   * @param router the service used to handle redirections
   * @param teamService the service to communicate with backend on Team objects
   * @param taskService the service to communicate with backend on Task objects
   * @param equipmentService the service to communicate with backend on Equipment
   * @param fileService the service to communicate with backend on File
   * @param formBuilder the service to handle forms
   * @param authService the service to handle authentication
   */
  constructor(private router: Router,
              private taskService: TaskService,
              private teamService: TeamService,
              private equipmentService: EquipmentService,
              private fileService: FileService,
              private formBuilder: FormBuilder,
              private authService: AuthenticationService
              ) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.taskService.getTaskCreationRequirements().subscribe(
      (requirements: any) => {
        this.requirements = requirements;
        this.initTriggerConditionsSelect();
        this.initEndConditionsSelect();
      }
    );
    this.teamSubscription = this.teamService.teamSubject.subscribe(
      (teams: Team[]) => {
        this.teams = teams;
        this.initTeamsSelect();
      }
    );
    this.teamService.emitTeams();
    this.equipmentSubscription = this.equipmentService.equipmentsSubject.subscribe(
      (equipments: Equipment[]) => {
        this.equipments = equipments;
        this.initEquipmentsSelect();
      }
    );
    this.currentUserSubscription = this.authService.currentUserSubject.subscribe(
      (currentUser) => {
        this.currentUser = currentUser;
      }
    );

    this.authService.emitCurrentUser();
    this.equipmentService.emitEquipments();
    this.initForm();
  }

  /*
    HANDLING TEMPLATES CREATION
  */

  /**
   * Function that handle template selection by updating all the fields accordingly
   */
  onChangeTaskTemplate() {
    if (this.selectedTemplate === null) {
      this.emptyFields();
      this.initTeamsSelect();
      this.templateFiles = [];
      this.endConditions = [];
    } else {
      // Loading teams from template
      const tempTeams: any[] = [];
      for (const team of this.selectedTemplate.teams) {
        tempTeams.push({id: team.id.toString(), value: team.name});
      }
      // Loading basic informations from template
      this.createForm.setValue({
        name: '',
        description: this.selectedTemplate.description,
        end_date: this.selectedTemplate.end_date,
        duration: this.selectedTemplate.duration,
        equipment: this.selectedTemplate.equipment.id.toString(),
        teams: tempTeams,
        file: ''
      });
      // Loading files from template
      this.templateFiles = [];
      for (const file of this.selectedTemplate.files) {
        this.templateFiles.push({id: file.id, name: file.file.split('/')[1]});
      }
      // Loading end conditions from template
      this.endConditions = [];
      for (const endCondition of this.selectedTemplate.end_conditions) {
        const jsonCopy = JSON.stringify(this.endConditionSelectTemplate);
        const objectCopy = JSON.parse(jsonCopy);
        objectCopy.selectedEndCondition = [{id: endCondition.id, value: endCondition.name}];
        this.endConditions.push(objectCopy);
      }
    }
  }

  /**
   * Function that reset all the fields when the template is unselected
   */
  emptyFields() {
    this.createForm.setValue({
      name: '',
      description: '',
      end_date: null,
      duration: '',
      equipment: '',
      teams: '',
      file: ''
    });
  }

  /*
    PROCESSING TRIGGER CONDITIONS
  */

  /**
   * Function to add a trigger condition in the form
   */
  addTriggerCondition() {
    const jsonCopy = JSON.stringify(this.triggerConditionSelectTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    this.triggerConditions.push(objectCopy);
  }

  /**
   * Function to delete a trigger condition in the form
   * @param i the index of the trigger condition
   */
  deleteTriggerCondition(i: number) {
    this.triggerConditions.splice(i, 1);
  }

  /**
   * Function to initialize the template for trigger condition objects. It is used to initialize
   * the dropdown selects as well
   * @param trigger_conditions_types the array with the different types of trigger conditions
   */
  initTriggerConditionSelectTemplate(trigger_conditions_types: any[]) {
    this.triggerConditionSelectTemplate = {
        selectedTriggerCondition: [],
        triggerConditionsList: trigger_conditions_types,
        dropdownTriggerConditionsSettings: {
          singleSelection: true,
          idField: 'id',
          textField: 'value',
          allowSearchFilter: true
        },
        value: null,
        description: null
      };
  }

  /**
   * Function to initialize the trigger conditions part of the form
   */
  initTriggerConditionsSelect() {
    const trigger_conditions_types = [];
    for (const triggerCondition of this.requirements.trigger_conditions) {
      trigger_conditions_types.push({id: triggerCondition.id, value: triggerCondition.name});
    }
    this.initTriggerConditionSelectTemplate(trigger_conditions_types);
  }

  /*
    PROCESSING END CONDITIONS
  */

  /**
   * Function to add an end condition in the form
   */
  addEndCondition() {
    const jsonCopy = JSON.stringify(this.endConditionSelectTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    this.endConditions.push(objectCopy);
  }

  /**
   * Function to delete an end condition in the form
   * @param i the index of the end condition
   */
  deleteEndCondition(i: number) {
    this.endConditions.splice(i, 1);
  }

  /**
   * Function to initialize the template for end condition objects. It is used to initialize
   * the dropdown selects as well
   * @param end_conditions_types the array with the different types of end conditions
   */
  initEndConditionSelectTemplate(end_conditions_types: any[]) {
    this.endConditionSelectTemplate = {
        selectedEndCondition: [],
        endConditionsList: end_conditions_types,
        dropdownEndConditionsSettings: {
          singleSelection: true,
          idField: 'id',
          textField: 'value',
          allowSearchFilter: true
        },
        description: null
      };
  }

  /**
   * Function to initialize the end conditions part of the form
   */
  initEndConditionsSelect() {
    const endConditionsTypes = [];
    for (const endCondition of this.requirements.end_conditions) {
      endConditionsTypes.push({id: endCondition.id, value: endCondition.name});
    }
    this.initEndConditionSelectTemplate(endConditionsTypes);
  }

  /*
    INITIALIZE SELECT INPUTS OF TEAMS AND EQUIPMENTS
  */

  /**
   * Function that initialize the multiselect for Teams
   */
  initTeamsSelect() {
    this.teamsList = [];
    this.teams.forEach(team => {
      this.teamsList.push({id: team.id.toString(), value: team.name});
    });
    this.dropdownTeamsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
  }

  /**
   * Function that initialize the select for the equipment
   */
  initEquipmentsSelect() {
    this.equipmentList = [];
    this.equipments.forEach(equipment => {
      this.equipmentList.push({id: equipment.id.toString(), value: equipment.name});
    });
    this.dropdownEquipmentsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
  }

  /*
    HANDLING FILE ADDITION AND DELETION
  */

  /**
   * Function that adds a file in the right array depending on the origin of the file (template or additionnal)
   * @param event the event triggered by the file input on upload
   */
  onAddFile(event) {
    const filepath = event.target.files[0].name.split('/');
    const fileName = filepath[filepath.length - 1];
    let formData: FormData;
    formData = new FormData();
    formData.append('file', event.target.files[0], event.target.files[0].name);
    formData.append('is_manual', 'true' );
    this.newFiles.push({name: fileName, data: formData});
  }

  /**
   * Function that is triggered when a file is removed from the files uploaded(when button "Minus" is pressed)
   * @param files array of files
   * @param fileId array of files id
   */
  onRemoveFile(files: any[], fileId: any) {
    let index: number;
    if (files === this.templateFiles) {
      index = files.find(existingFile => existingFile.id === fileId);
    } else {
      index = files.find(existingFile => existingFile.data === fileId);
    }
    if (index) {
      files.splice(index, 1);
    }
  }

  /**
   * Function that initialize the fields in the form to create a new Team
   */
  initForm() {
    this.triggerConditionDurationRegex = durationRegex;
    const localDurationRegex = new RegExp(durationRegex);

    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      end_date: [null],
      duration: ['', Validators.pattern(localDurationRegex)],
      equipment: [''],
      teams: [''],
      file: ['']
    });
  }

  /**
   * Function that is triggered when a modification is done on a trigger condition duration field.
   * @param triggerConditionDurationField the input field that needs to be verified
   */
  onUpdateTriggerConditionDurationValidity(triggerConditionDurationField) {
    this.triggerConditionDurationError = triggerConditionDurationField.validity.patternMismatch;
  }

  /**
   * Function that is triggered when a new Task is being created (when button "Create new task" is pressed)
   */
  onCreateTask() {
    const formValues = this.createForm.value;

    const teams = [];
    if (formValues.teams) {
      formValues.teams.forEach(item => {
        teams.push(item.id);
      });
    }

    const equipments = [];
    if (formValues.equipment) {
      formValues.equipment.forEach(item => {
        equipments.push(item.id);
      });
    }
    // const equipment = formValues.equipment ? formValues.equipment : null;
    const end_date = formValues.end_date ? this.taskService.normaliseEndDateValue(formValues.end_date) : null;
    const duration = formValues.duration ? this.taskService.normaliseDurationValue(formValues.duration, ['d', 'h', 'm']) : '';
    const over = false;

    const trigger_conditions: any[] = [];
    if (this.triggerConditions.length > 0) {
      for (const triggerCondition of this.triggerConditions) {
        trigger_conditions.push({
          field: triggerCondition.selectedTriggerCondition[0].id,
          name: triggerCondition.selectedTriggerCondition[0].value,
          description: triggerCondition.description,
          value: triggerCondition.value
        });
      }
    }

    const end_conditions = [];
    if (this.endConditions.length > 0) {
      for (const endCondition of this.endConditions) {
        end_conditions.push({
          field: endCondition.selectedEndCondition[0].id,
          name: endCondition.selectedEndCondition[0].value,
          description: endCondition.description,
          value: null
        });
      }
    }

    const files: number[] = [];
    // Loading files that are already existing in DB
    for (const templatesFile of this.templateFiles) {
      files.push(templatesFile.id);
    }

    // Saving new files in DB
    // Here we use an async function to wait for all the file to be uploaded before creating the task
    this.uploadFiles(files).then(
      (_) => {
        const newTask = new Task(1,
                                formValues.name,
                                formValues.description,
                                end_date,
                                duration,
                                false,
                                equipments,
                                teams,
                                files,
                                over,
                                trigger_conditions,
                                end_conditions);

        this.taskService.createTask(newTask).subscribe(
          (task: Task) => {
            this.router.navigate(['/tasks']);
            this.taskService.getTasks();
            this.taskService.getUserTasks(this.currentUser?.id);
          },
          (error) => {
            this.creationError = true;
          }
        );
      }
    );

  }

  /**
   * Async function to upload all the file before creating a new Task
   * @param files the file array linked to the Task
   */
  async uploadFiles(files) {
    for (const newFile of this.newFiles) {
      await this.fileService.uploadFile(newFile.data).toPromise().then(file => {
        files.push(Number(file.id));
      });
    }
  }

  /**
   * Function that clears subscriptions
   */
  ngOnDestroy(): void {
    this.teamSubscription.unsubscribe();
    this.equipmentSubscription.unsubscribe();
  }

}
