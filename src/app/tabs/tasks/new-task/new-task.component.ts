import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
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
  faPlus,
  faTimes,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from 'src/app/services/files/file.service';
import { Template } from 'src/app/models/template';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UserProfile } from 'src/app/models/user-profile';
import { durationRegex } from 'src/app/shares/consts';
import {EquipmentTypeService} from '../../../services/equipment-types/equipment-type.service';
import {EquipmentType} from '../../../models/equipment-type';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit, OnDestroy {

  // Local variables
  equipments: Equipment[];
  equipment_types: EquipmentType[];
  equipment_or_equipment_type = 'no-equipment';
  teams: Team[];

  selectedFieldObject: any;

  teamSubscription: Subscription;
  equipmentSubscription: Subscription;
  equipmentTypeSubscription: Subscription;
  creationError = false;

  // Icons
  faInfoCircle = faInfoCircle;
  faPlusSquare = faPlusSquare;
  faMinusCircle = faMinusCircle;
  faMinusSquare = faMinusSquare;
  faCalendar = faCalendar;
  faFileDownload = faFileDownload;
  faPlus = faPlus;
  faTimes = faTimes;
  faCheck = faCheck;
  model: NgbDateStruct;

  // Multiple Select
  teamsList = [];
  equipmentList = [];
  equipmentTypesList = [];
  triggerConditionsList = [];
  selectedTriggerCondition = [];
  endConditionsList = [];
  selectedEndConditions = [];
  dropdownTeamsSettings: IDropdownSettings;
  dropdownEquipmentsSettings: IDropdownSettings;
  dropdownEquipmentTypesSettings: IDropdownSettings;
  dropdownTriggerConditionsSettings: IDropdownSettings;
  dropdownEndConditionsSettings: IDropdownSettings;

  // Trigger Conditions
  triggerConditions = [];
  triggerConditionSelectTemplate = null;
  triggerConditionDurationRegex: string;
  triggerConditionError = false;
  triggerConditionRecurrenceName = 'Recurrence';

  // End Conditions
  endConditions = [];
  endConditionSelectTemplate = null;
  endConditionError = false;

  // Files
  filesSubject = new Subject<File[]>();
  newFiles: any[] = []; // {name, data}
  templateFiles: any[] = []; // {id, name}
  fileTypeCheck: boolean;
  fileCheck: boolean;

  // Forms
  createForm: FormGroup;

  // Templates
  templates: Template[] = [];
  selectedTemplate: Template = null;
  requirements: any = null;

  // Current User
  currentUser: UserProfile;
  currentUserSubscription: Subscription;

  // Equipments
  creationLoader = false;
  selectedEquipment: any = null;
  selectedEquipmentIdValue = [];

  /**
   * Constructor for the NewTeamComponent
   * @param router the service used to handle redirections
   * @param teamService the service to communicate with backend on Team objects
   * @param taskService the service to communicate with backend on Task objects
   * @param equipmentService the service to communicate with backend on Equipment
   * @param equipmentTypeService the service to communicate with backend on EquipmentType
   * @param fileService the service to communicate with backend on File
   * @param formBuilder the service to handle forms
   * @param authService the service to handle authentication
   */
  constructor(private router: Router,
              private taskService: TaskService,
              private teamService: TeamService,
              private equipmentService: EquipmentService,
              private equipmentTypeService: EquipmentTypeService,
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
    this.equipmentTypeSubscription = this.equipmentTypeService.equipment_types_subject.subscribe(
        (equipment_types: EquipmentType[]) => {
          this.equipment_types = equipment_types;
          this.initEquipmentTypesSelect();
        }
    );
    this.currentUserSubscription = this.authService.currentUserSubject.subscribe(
      (currentUser) => {
        this.currentUser = currentUser;
      }
    );

    this.authService.emitCurrentUser();
    this.equipmentService.emitEquipments();
    this.equipmentTypeService.emitEquipmentTypes();
    this.initForm();
    this.fileTypeCheck = true;
    this.fileCheck = true;
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
      let equipment_or_equipment_type = 'no-equipment';
      if (this.selectedTemplate.equipment) {
        equipment_or_equipment_type = 'equipment';
      } else {
        if (this.selectedTemplate.equipment_type) {
          equipment_or_equipment_type = 'equipment_type';
        }
      }
      this.selectedEquipmentIdValue = [{id: this.selectedTemplate.equipment.id.toString(), value: this.selectedTemplate.equipment.name}];
      // Loading basic informations from template
      this.createForm.setValue({
        name: '',
        description: this.selectedTemplate.description,
        end_date: this.selectedTemplate.end_date,
        duration: this.selectedTemplate.duration,
        equipment: this.selectedTemplate.equipment ?
            [{id: this.selectedTemplate.equipment.id.toString(), value: this.selectedTemplate.equipment.name}]
            : '',
        equipment_type: this.selectedTemplate.equipment_type ?
            [{id: this.selectedTemplate.equipment_type.id.toString(), value: this.selectedTemplate.equipment_type.name}]
            : [],
        equipment_or_equipment_type,
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
      equipment_type: [],
      equipment_or_equipment_type: 'no-equipment',
      teams: '',
      file: ''
    });
  }

  /*
    PROCESSING TRIGGER CONDITIONS
  */

  /**
   * Function that retrieve the recurrence trigger condition
   */
  getTriggerConditionRecurrence(triggerCondition) {
    const temp = triggerCondition.triggerConditionsList.find(tc => tc.value === this.triggerConditionRecurrenceName);
    return temp;
  }

  /**
   * Function to add a trigger condition in the form
   */
  addTriggerCondition() {
    const jsonCopy = JSON.stringify(this.triggerConditionSelectTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    objectCopy.id = this.triggerConditions.length;
    this.triggerConditions.push(objectCopy);
    this.triggerConditionError = true;
  }

  /**
   * Function to delete a trigger condition in the form
   * @param i the index of the trigger condition
   */
  deleteTriggerCondition(i: number) {
    const index = this.triggerConditions.findIndex(elt => elt.id === i);
    const temp = this.triggerConditions.splice(index, 1);
    this.triggerConditionError = this.triggerConditions.find(tc => !tc.valid);
  }

  /**
   * Function that removes specific trigger conditions id the equipment is unselected
   */
  removeForbiddenFields() {
    if (this.createForm.value.equipment_or_equipment_type === 'no-equipment'
        || this.createForm.value.equipment_or_equipment_type === 'equipment_type') {
      this.selectedEquipmentIdValue = [];
      const temp = [];
      for (const tc of this.triggerConditions) {
        if (tc.selectedTriggerCondition[0]?.value === this.triggerConditionRecurrenceName) {
          temp.push(tc);
        }
      }
      this.triggerConditions = temp;
    }
  }

  /**
   * Function to initialize the template for trigger condition objects. It is used to initialize
   * the dropdown selects as well
   * @param trigger_conditions_types the array with the different types of trigger conditions
   */
  initTriggerConditionSelectTemplate(trigger_conditions_types: any[]) {
    const temp = [trigger_conditions_types.find(tc => tc.value === this.triggerConditionRecurrenceName)];
    this.triggerConditionSelectTemplate = {
        selectedTriggerCondition: [],
        triggerConditionsList: trigger_conditions_types,
        triggerConditionsListRecurrenceOnly: temp,
        dropdownTriggerConditionsSettings: {
          singleSelection: true,
          idField: 'id',
          textField: 'value',
          allowSearchFilter: true,
          closeDropDownOnSelection: true
        },
        value: null,
        description: null,
        field: null,
        valid: false,
        field_object: null
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
    objectCopy.id = this.endConditions.length;
    this.endConditions.push(objectCopy);
    this.endConditionError = this.endConditions.find(ec => !ec.valid);
  }

  /**
   * Function to delete an end condition in the form
   * @param i the index of the end condition
   */
  deleteEndCondition(i: number) {
    const index = this.endConditions.findIndex(elt => elt.id === i);
    this.endConditions.splice(index, 1);
    this.endConditionError = this.endConditions.find(ec => !ec.valid);
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
          allowSearchFilter: true,
          closeDropDownOnSelection: true
        },
        description: null,
        valid: false
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
      this.equipmentList.push({id: equipment.id.toString(), value: equipment.name, fields: equipment.fields});
    });
    this.dropdownEquipmentsSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'value',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
  }

  /**
   * Function that set the right equipment in the varaible selectedEquipment for field selection in the trigger conditions display
   * @param equipment the equipment selected
   */
  setSelectedEquipment(equipment: any) {
    if (equipment) {
      this.selectedEquipment = this.equipmentList.find(eq => eq.id === equipment[0]?.id);
    }
  }

  /**
   * Function that initialize the select for the equipment type
   */
  initEquipmentTypesSelect() {
    this.equipmentTypesList = [];
    this.equipment_types.forEach(equipment_type => {
      this.equipmentTypesList.push({id: equipment_type.id.toString(), value: equipment_type.name});
    });
    this.dropdownEquipmentTypesSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'value',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
  }

  /*
    HANDLING FILE ADDITION AND DELETION
  */

  /**
   * Function that adds a file in the right array depending on the origin of the file (template or additional)
   * @param event the event triggered by the file input on upload
   */
  onAddFile(event) {
    if (this.isSizeFileOk() && this.isTypeFileOk()) {
      const filepath = event.target.files[0].name.split('/');
      const fileName = filepath[filepath.length - 1];
      let formData: FormData;
      formData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      formData.append('is_manual', 'true' );
      this.newFiles.push({name: fileName, data: formData});
      }
  }

  /**
   * Function that is triggered when a file is removed from the files uploaded(when button "Minus" is pressed)
   * @param files the list
   * @param fileId id of the file hat need to be removed
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
  * Function that get the size of the file the user want to upload.
  * @param content the modal to open
  */
  getFileInfo(content) {
    if (content.target.files[0].type === 'image/png'
        || content.target.files[0].type === 'image/jpeg'
        || content.target.files[0].type === 'application/pdf') {
          this.fileTypeCheck = true;
    } else {
      this.fileTypeCheck = false;
    }
    if (content.target.files[0].size / 1000000 <= 10) {
    this.fileCheck = true;
    } else {
      this.fileCheck = false;
    }
  }

  /**
   * Provide a boolean which allow us to know if the size of the file is correct.
   */
  isSizeFileOk(): boolean {
    return this.fileCheck;
  }

  /**
   * Provide a boolean which allow us to know if the type of the file is correct.
   */
  isTypeFileOk(): boolean {
    return this.fileTypeCheck;
  }

  /**
   * Function that initialize the fields in the form to create a new Team
   */
  initForm() {
    this.triggerConditionDurationRegex = durationRegex;
    const localDurationRegex = new RegExp(durationRegex);

    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhiteSpaceValidator]],
      description: [''],
      end_date: [null],
      duration: ['', Validators.pattern(localDurationRegex)],
      equipment_or_equipment_type: ['no-equipment'],
      equipment: [''],
      equipment_type: [[]],
      teams: [''],
      file: ['']
    });
  }

  /**
   * Function that is triggered when a modification is done on a trigger condition field.
   * @param triggerCondition the trigger condition concerned by the update
   * @param fields the list of fields that needs to be checked
   */
  onUpdateTriggerConditionValidity(triggerCondition, fields) {
    let tempValidity = true;
    if (fields) { // Update trigger condition validity by checking fields validity
      for (const field of fields) {
        if ((field.validity.patternMismatch || field.value === '')
            || (field.id === 'field-object' && triggerCondition.field_object === null)) {
          tempValidity = false;
          break;
        }
      }
    } else { // Update trigger condition validity by checking selected trigger condition type
      if (triggerCondition.selectedTriggerCondition.length === 0) {
        triggerCondition.value = null;
        triggerCondition.delay = null;
        triggerCondition.field_object = null;
      }
      tempValidity = false;
    }
    // Update the trigger condition validity status
    triggerCondition.valid = tempValidity;
    // Update the error status to handle "Create Task" button activation
    this.triggerConditionError = this.triggerConditions.find(tc => !tc.valid);
  }

  /**
   * Function that is triggered when a modification is done on an end condition field.
   * @param endCondition the input field that needs to be verified
   */
  onUpdateEndConditionValidity(endCondition) {
    if (endCondition.selectedEndCondition.length === 0) {
      endCondition.valid = false;
    } else {
      endCondition.valid = true;
    }
    this.endConditionError = this.endConditions.find(ec => !ec.valid);
  }

  /**
   * Function that handle the disabled status of the Create Task button
   * @return the disabled boolean value
   */
  isFormValidationDisabled() {
    return this.createForm.invalid
          || this.triggerConditionError
          || this.endConditionError
          || (this.createForm.value.equipment_or_equipment_type === 'equipment' && this.selectedEquipmentIdValue.length === 0)
          || (this.createForm.value.equipment_or_equipment_type === 'equipment_type' && this.createForm.value.equipment_type.length === 0);
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

    const equipment = (
        formValues.equipment && (formValues.equipment_or_equipment_type === 'equipment')
    ) ? formValues.equipment[0].id : null;
    const equipment_type = (
        formValues.equipment_type && (formValues.equipment_or_equipment_type === 'equipment_type')
    ) ? formValues.equipment_type[0].id : null;
    const end_date = formValues.end_date ? this.taskService.normaliseEndDateValue(formValues.end_date) : null;
    const duration = formValues.duration ? this.taskService.normaliseDurationValue(formValues.duration, ['d', 'h', 'm']) : '';

    const trigger_conditions: any[] = [];
    if (this.triggerConditions.length > 0) {
      for (const triggerCondition of this.triggerConditions) {
        if (triggerCondition.selectedTriggerCondition[0].value === this.triggerConditionRecurrenceName) {
          trigger_conditions.push({
            field: triggerCondition.selectedTriggerCondition[0].id,
            name: triggerCondition.selectedTriggerCondition[0].value,
            description: triggerCondition.description,
            value: triggerCondition.value,
            delay: triggerCondition.delay,
          });
        } else {
          trigger_conditions.push({
            field: triggerCondition.selectedTriggerCondition[0].id,
            name: triggerCondition.selectedTriggerCondition[0].value,
            description: triggerCondition.description,
            value: triggerCondition.value,
            delay: triggerCondition.delay,
            field_object_id: triggerCondition.field_object.id
          });
        }
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

    this.creationLoader = true;

    // Saving new files in DB
    // Here we use an async function to wait for all the file to be uploaded before creating the task
    this.uploadFiles(files).then(
      (_) => {
        this.taskService.createTask(
            formValues.name,
            formValues.description,
            end_date,
            duration, equipment,
            equipment_type,
            teams,
            files,
            trigger_conditions,
            end_conditions
        ).subscribe(
          (task: Task) => {
            this.router.navigate(['/tasks']);
            this.taskService.getTasks();
            this.taskService.getUserTasks(this.currentUser?.id);
            this.creationLoader = false;
          },
          (error) => {
            this.creationError = true;
            this.creationLoader = false;
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
   * Validation function for task name
   * @param control the name input
   */
  public noWhiteSpaceValidator(control: FormControl) {
    const isWhiteSpace = (control.value || '').trim().length === 0;
    const isValid = !isWhiteSpace;
    return isValid ? null : {whitespace: true};
  }

  /**
   * Function that clears subscriptions
   */
  ngOnDestroy(): void {
    this.teamSubscription.unsubscribe();
    this.equipmentSubscription.unsubscribe();
    this.equipmentTypeSubscription.unsubscribe();
  }

}
