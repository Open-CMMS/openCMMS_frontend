import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamService } from 'src/app/services/teams/team.service';
import { Team } from 'src/app/models/team';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Equipment } from 'src/app/models/equipment';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/tasks/task.service';
import { faCalendar, faInfoCircle, faPlusSquare, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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

  // Forms
  createForm: FormGroup;

  faCalendar = faCalendar;

  /**
   * Constructor for the NewTeamComponent
   * @param router the service used to handle redirections
   * @param teamService the service to communicate with backend on Team objects
   * @param teamTypeService the service to communicate with backend on TeamType objects
   * @param formBuilder the service to handle forms
   */
  constructor(private router: Router,
              private taskService: TaskService,
              private teamService: TeamService,
              private equipmentService: EquipmentService,
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
    this.initTriggerConditionsSelect();
    this.initEndConditionsSelect();
    this.equipmentService.emitEquipments();
    this.initForm();
  }

  addEndCondition() {
    const jsonCopy = JSON.stringify(this.endConditionSelectTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    this.endConditions.push(objectCopy);
  }

  deleteEndCondition(i: number) {
    this.endConditions.splice(i, 1);
  }

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
        value: null,
        description: null
      };
  }

  getEndConditionsTypes() {
    let id_field: number;
    const end_conditions_types = [];
    this.taskService.getFields().subscribe(
      (fields) => {
        fields.forEach(field => {
          if (field.name === 'End Conditions') {
            id_field = field.id;
          }
        });
        this.taskService.getFieldValues(id_field).subscribe(
          (field_values) => {
            field_values.forEach(field_value => {
              end_conditions_types.push({id: field_value.id, value: field_value.value});
            });
            this.initEndConditionSelectTemplate(end_conditions_types);
          }
        );
      }
    );
  }

  initEndConditionsSelect() {
    this.getEndConditionsTypes();
  }

  addTriggerCondition() {
    const jsonCopy = JSON.stringify(this.triggerConditionSelectTemplate);
    const objectCopy = JSON.parse(jsonCopy);
    this.triggerConditions.push(objectCopy);
  }

  deleteTriggerCondition(i: number) {
    this.triggerConditions.splice(i, 1);
  }

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

  getTriggerConditionsTypes() {
    let id_field: number;
    const trigger_conditions_types = [];
    this.taskService.getFields().subscribe(
      (fields) => {
        fields.forEach(field => {
          if (field.name === 'Trigger Conditions') {
            id_field = field.id;
          }
        });
        this.taskService.getFieldValues(id_field).subscribe(
          (field_values) => {
            field_values.forEach(field_value => {
              trigger_conditions_types.push({id: field_value.id, value: field_value.value});
            });
            this.initTriggerConditionSelectTemplate(trigger_conditions_types);
          }
        );
      }
    );
  }

  initTriggerConditionsSelect() {
    this.getTriggerConditionsTypes();
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
      teams: ['']
    });
  }


  normaliseDurationValue(formDurationInput: string): string {
    const str_time = formDurationInput.trim();
    let days = '';
    let hours = '';
    let minutes = '';
    let pos_d_start: number;
    let pos_d_end: number;
    let pos_h_start: number;
    let pos_h_end: number;
    let pos_m_start: number;
    let pos_m_end: number;

    pos_d_start = 0;
    pos_d_end = str_time.indexOf('d') !== -1 ? str_time.indexOf('d') : 0;

    if (str_time.indexOf('h') === -1) {
      pos_h_start = 0;
      pos_h_end = 0;
    } else if (pos_d_end === 0) {
      pos_h_start = 0;
      pos_h_end = str_time.indexOf('h');
    } else {
      pos_h_start = pos_d_end + 1;
      pos_h_end = str_time.indexOf('h');
    }

    if (str_time.indexOf('m') === -1) {
      pos_m_start = 0;
      pos_m_end = 0;
    } else if (pos_h_end === 0) {
      if (pos_d_end === 0) {
        pos_m_start = 0;
      } else {
        pos_m_start = pos_d_end + 1;
      }
      pos_m_end = str_time.indexOf('m');
    } else {
      pos_m_start = pos_h_end + 1;
      pos_m_end = str_time.indexOf('m');
    }

    days = str_time.substring(pos_d_start, pos_d_end) === '' ? '0' : str_time.substring(pos_d_start, pos_d_end);
    hours = str_time.substring(pos_h_start, pos_h_end) === '' ? '0' : str_time.substring(pos_h_start, pos_h_end);
    minutes = str_time.substring(pos_m_start, pos_m_end) === '' ? '0' : str_time.substring(pos_m_start, pos_m_end);


    return days.trim() + ' days, ' + hours.trim() + ':' + minutes.trim() + ':0';
  }

  testForm() {

  }

  /**
   * Function that is triggered when a new Team is being created (when button "Create new team" is pressed)
   */
  onCreateTask() {
    const formValues = this.createForm.value;

    const teams = [];
    if (formValues.teams) {
      formValues.teams.forEach(item => {
        teams.push(item.id);
      });
    }

    const equipment = formValues.equipment ? formValues.equipment[0].id : null;

    const end_date = this.taskService.normaliseEndDateValue(formValues.end_date);

    const time = this.normaliseDurationValue(formValues.time);

    const task_type = null;
    const file = [];
    const over = false;

    const newTask = new Task(1,
                            formValues.name,
                            formValues.description,
                            end_date,
                            time,
                            formValues.is_template,
                            equipment,
                            teams,
                            task_type,
                            file,
                            over);

    this.taskService.createTask(newTask).subscribe(
      (task: Task) => {
        this.router.navigate(['/tasks']);
        this.taskService.getTasks();
      },
      (error) => {
        this.creationError = true;
      }
    );
  }

  /**
   * Function that clears subscriptions
   */
  ngOnDestroy(): void {
    this.teamSubscription.unsubscribe();
    this.equipmentSubscription.unsubscribe();
  }

}
