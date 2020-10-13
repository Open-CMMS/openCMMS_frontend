import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamService } from 'src/app/services/teams/team.service';
import { Team } from 'src/app/models/team';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Equipment } from 'src/app/models/equipment';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/tasks/task.service';
import { faCalendar, faInfoCircle, faPlusSquare, faMinusCircle, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from 'src/app/services/files/file.service';

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

  faInfoCircle = faInfoCircle;
  faPlusSquare = faPlusSquare;
  faMinusCircle = faMinusCircle;
  faMinusSquare = faMinusSquare;
  faCalendar = faCalendar;
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

  // End Conditions
  endConditions = [];
  endConditionSelectTemplate = null;

  // Files
  filesSubject = new Subject<File[]>();
  filesSubscription: Subscription;
  myFiles: File[] = [];
  files: number[] = [];

  // Forms
  createForm: FormGroup;


  /**
   * Constructor for the NewTeamComponent
   * @param router the service used to handle redirections
   * @param teamService the service to communicate with backend on Team objects
   * @param taskService the service to communicate with backend on Task objects
   * @param equipmentService the service to communicate with backend on Equipment
   * @param fileService the service to communicate with backend on File
   * @param formBuilder the service to handle forms
   */
  constructor(private router: Router,
              private taskService: TaskService,
              private teamService: TeamService,
              private equipmentService: EquipmentService,
              private fileService: FileService,
              private formBuilder: FormBuilder
              ) { }
  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
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
    this.filesSubscription = this.filesSubject.subscribe(
      (files: File[]) => {
        this.myFiles = files;
      }
    );
    this.initTriggerConditionsSelect();
    this.initEndConditionsSelect();
    this.equipmentService.emitEquipments();
    this.initForm();
  }

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
   * Function to get the different types of end conditions
   */
  getEndConditionsTypes() {
    // let id_field: number;
    // const end_conditions_types = [];
    // this.taskService.getFields().subscribe(
    //   (fields) => {
    //     fields.forEach(field => {
    //       if (field.name === 'End Conditions') {
    //         id_field = field.id;
    //       }
    //     });
    //     this.taskService.getFieldValues(id_field).subscribe(
    //       (field_values) => {
    //         field_values.forEach(field_value => {
    //           end_conditions_types.push({id: field_value.id, value: field_value.value});
    //         });
    //         this.initEndConditionSelectTemplate(end_conditions_types);
    //       }
    //     );
    //   }
    // );
  }

  /**
   * Function to initialize the end conditions part of the form
   */
  initEndConditionsSelect() {
    this.getEndConditionsTypes();
  }

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
   * Function to get the different trigger condition types
   */
  getTriggerConditionsTypes() {
    // let id_field: number;
    // const trigger_conditions_types = [];
    // this.taskService.getFields().subscribe(
    //   (fields) => {
    //     fields.forEach(field => {
    //       if (field.name === 'Trigger Conditions') {
    //         id_field = field.id;
    //       }
    //     });
    //     this.taskService.getFieldValues(id_field).subscribe(
    //       (field_values) => {
    //         field_values.forEach(field_value => {
    //           trigger_conditions_types.push({id: field_value.id, value: field_value.value});
    //         });
    //         this.initTriggerConditionSelectTemplate(trigger_conditions_types);
    //       }
    //     );
    //   }
    // );
  }

  /**
   * Function to initialize the trigger conditions part of the form
   */
  initTriggerConditionsSelect() {
    this.getTriggerConditionsTypes();
  }

  /**
   * Function to create the field_objects in the database for the end and trigger conditions
   */
  createFieldObjects(id_task: number) {
    // let id_field_trigger_condition: number;
    // let id_field_end_condition: number;
    // this.taskService.getFields().subscribe(
    //   (fields) => {
    //     fields.forEach(field => {
    //       if (field.name === 'Trigger Conditions') {
    //         id_field_trigger_condition = field.id;
    //       } else if (field.name === 'End Conditions') {
    //         id_field_end_condition = field.id;
    //       }
    //     });
    //     this.triggerConditions.forEach(triggerCondition => {
    //       let object_value: string;
    //       switch (triggerCondition.selectedTriggerCondition[0].value) {
    //         case 'Date':
    //           object_value = this.taskService.normaliseEndDateValue(triggerCondition.value);
    //           break;
    //         case 'Duree':
    //           object_value = this.taskService.normaliseDurationValue(triggerCondition.value, ['y', 'm', 'd']);
    //           break;
    //         default:
    //           object_value = triggerCondition.value;
    //           break;
    //       }
    //       const field_object = {
    //         described_object: 'Task: ' + id_task,
    //         field: id_field_trigger_condition,
    //         field_value: triggerCondition.selectedTriggerCondition[0].id,
    //         value: object_value,
    //         description: triggerCondition.description
    //       };
    //       this.taskService.createFieldObject(field_object).subscribe();
    //     });
    //     this.endConditions.forEach(endCondition => {
    //       const field_object = {
    //         described_object: 'Task: ' + id_task,
    //         field: id_field_end_condition,
    //         field_value: endCondition.selectedEndCondition[0].id,
    //         value: 'pending',
    //         description: endCondition.description
    //       };
    //       this.taskService.createFieldObject(field_object).subscribe();
    //     });
    //     this.taskService.getFieldObjects();
    //   });
  }

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
      singleSelection: true,
      idField: 'id',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
  }

  /**
   * Function that is triggered when a or multiple files are chosen(when button "Browse" is pressed and files are chosen)
   * Upload files if not already uploaded.
   * @param event file selection event from input of type file
   */
  onFileUpload(event) {
    let formData: FormData;
    let i = 0;
    for (i; i < event.target.files.length; i++) {
      if (!this.myFiles.includes(event.target.files[i])) {
        this.myFiles.push(event.target.files[i]);
        formData = new FormData();
        formData.append('file', event.target.files[i], event.target.files[i].name);
        formData.append('is_manual', 'true' );
        this.fileService.uploadFile(formData).subscribe(file => {
          this.files.push(Number(file.id));
        });
      }
    }
    this.filesSubject.next(this.myFiles);
  }

  /**
   * Function that is triggered when a file is removed from the files uploaded(when button "Minus" is pressed)
   * @param file file that need to be removed
   * Here we only need the index of the file from the local variable myFiles which is the same then in the variable files
   * from file we then can get the id of the file in the database to remove it.
   */
  onRemoveFile(file: File) {
    const index = this.myFiles.indexOf(file);
    this.myFiles.splice(index, 1);
    const id = this.files.splice(index, 1);
    this.fileService.deleteFile(id[0]).subscribe();
  }

  /**
   * Function that initialize the fields in the form to create a new Team
   */
  initForm() {
    this.triggerConditionDurationRegex = '^((([0-9]+)y)?\\s*(([0-9]+)m)?\\s*(([0-9]+)d)?)$';
    const regex_time = new RegExp('^((([0-9]+)d)?\\s*(([0-9]+)h)?\\s*(([0-9]+)m)?)$');
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      end_date: [null],
      time: ['', Validators.pattern(regex_time)],
      is_template: [false],
      equipment: [''],
      teams: [''],
      file: ['']
    });
  }



  /**
   * Function to for the dev to test the form without sending the request
   */
  testForm() {
    console.log(this.triggerConditions);
    console.log(this.endConditions);
    this.onCreateTask(true);
  }

  /**
   * Function that is triggered when a new Task is being created (when button "Create new task" is pressed)
   */
  onCreateTask(test = false) {
    const formValues = this.createForm.value;

    const teams = [];
    if (formValues.teams) {
      formValues.teams.forEach(item => {
        teams.push(item.id);
      });
    }

    const equipment = formValues.equipment ? formValues.equipment[0].id : null;

    const end_date = formValues.end_date ? this.taskService.normaliseEndDateValue(formValues.end_date) : null;

    const time = formValues.time ? this.taskService.normaliseDurationValue(formValues.time, ['d', 'h', 'm']) : '';

    const files = this.files;

    const task_type = 1;
    const over = false;

    const newTask = new Task(1,
                            formValues.name,
                            formValues.description,
                            end_date,
                            time,
                            formValues.is_template,
                            equipment,
                            teams,
                            files,
                            over);



    if (test === true) {
      console.log(newTask);
    } else {
      this.taskService.createTask(newTask).subscribe(
        (task: Task) => {
          this.createFieldObjects(task.id);
          this.router.navigate(['/tasks']);
          this.taskService.getTasks();
        },
        (error) => {
          this.creationError = true;
        }
      );
    }
  }

  /**
   * Function that clears subscriptions
   */
  ngOnDestroy(): void {
    this.filesSubscription.unsubscribe();
    this.teamSubscription.unsubscribe();
    this.equipmentSubscription.unsubscribe();
  }

}
