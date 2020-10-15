import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/tasks/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/teams/team.service';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { faTrash, faPen, faCalendar, faSave, faInfoCircle, faCheck, faBook } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare, faMinusSquare, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Subscription, Subject } from 'rxjs';
import { FileService } from 'src/app/services/files/file.service';
import { environment } from 'src/environments/environment';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
/**
 * Component used to display the details of a task and to validate it.
 */
export class TaskDetailsComponent implements OnInit, OnDestroy {

  // Icons
  faTrash = faTrash;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;
  faPen = faPen;
  faCalendar = faCalendar;
  faSave = faSave;
  faInfoCircle = faInfoCircle;
  faCheck = faCheck;
  faBook = faBook;
  faCheckCircle = faCheckCircle;

  // Local variables
  task: Task = null;
  taskDuration = '';
  teamsTask: Team[] = [];

  loaded = false;

  equipments: Equipment[] = [];
  equipmentsList = [];
  selectedEquipment = [];

  teams: Team[] = [];
  teamsDiff = [];
  date: NgbDateStruct;
  durationDays = 0;
  durationTime = null;
  allFieldObjects: any[] = [];
  taskFieldObjects: any[] = [];
  endConditions: any[] = [];
  triggerConditions: any[] = [];
  fields: any[] = [];
  files: any[] = [];
  BASE_URL_API = environment.baseUrl;
  endConditionValues: any[] = [];
  fileToUpload: any[] = [];
  validationError = false;
  endConditionsOriginal: any[] = [];

  inputEnabled = {
    description: false,
    date: false,
    duration: false,
    equipment: false
  };

  teamSubscription: Subscription;
  tasksSubscription: Subscription;
  equipmentSubscription: Subscription;

  endConditionsSubject = new Subject<any[]>();
  endConditionSubscription: Subscription;

  triggerConditionsSubject = new Subject<any[]>();
  triggerConditionSubscription: Subscription;

  // Forms
  updateForm: FormGroup;
  addTeamForm: FormGroup;
  dropdownTeamsSettings: IDropdownSettings;
  dropdownEquipmentsSettings: IDropdownSettings;

  /**
   * Constructor of TaskDetailsComponent
   * @param taskService the service used to handle tasks
   * @param route the service used to handle route parameters
   * @param teamService the service used to handle teams
   * @param equipmentService the service used to handle equipments
   * @param router the service used to handle routing
   * @param modalService the service used to handle modals
   * @param utilsService the service used for useful methods
   * @param authenticationService the service used to handle authentication
   * @param formBuilder the service used to handle forms
   * @param fileService the service used to handle files
   */
  constructor(private taskService: TaskService,
              private route: ActivatedRoute,
              private teamService: TeamService,
              private equipmentService: EquipmentService,
              private router: Router,
              private modalService: NgbModal,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private fileService: FileService) { }

  ngOnInit(): void {
    let id: number;
    this.route.params.subscribe(params => {
      id = +params.id;
    });

    // Get the concerned task and its associated objects (equipment, teams, ...)
    this.taskService.getTask(id).subscribe(
      (task: Task) => {
        console.log(task);
        this.task = task;
        // Set up files format with right URIs
        this.initFiles();
        // Set duration to the right format
        this.formatDurationStringAndInitDurationInput();
        // Initialize the Date
        this.initDateInput();
        // Initialize the select content of Team
        this.initTeamsDiff();
        // Initialize values of endConditions for display purposes
        this.initEndConditionValues();
        // initialize Forms
        this.initForm();
        this.loaded = true;
    });

    // Subscribing to the teams list
    this.teamSubscription = this.teamService.teamSubject.subscribe(
      (teams) => {
        this.teams = teams;
    });

    // Subscribing to the equipments
    this.equipmentSubscription = this.equipmentService.equipmentsSubject.subscribe(
      (equipments) => {
        this.equipments = equipments;
    });

    // Updating every subscriptions
    this.equipmentService.emitEquipments();
    this.teamService.emitTeams();
  }

  /**
   * Function that builds up the files array with required fields for display purposes
   */
  initFiles() {
    this.files = [];
    for (const file of this.task.files) {
      const temp = {
        fileName: decodeURI(file.file.split('/')[1]),
        fileLink: '/' + file.file,
        is_manual: file.is_manual
      };
      this.files.push(temp);
    }
  }

  /**
   * Function that builds the end condition values for ngModeling in order to keep the values unchanged until the update
   * in database.
   */
  initEndConditionValues() {
    for (const endCondition of this.task.end_conditions) {
      this.endConditionValues[endCondition.id] = endCondition.value;
    }
  }

  /**
   * Function that initializes the Teams multiselect with only teams that are not on this task
   */
  initTeamsDiff() {
    this.teamsDiff = [];
    for (const globalTeam of this.teams) {
      const found = this.task.teams.find(taskTeam => taskTeam.id === globalTeam.id);
      if (!found) {
        this.teamsDiff.push({id: globalTeam.id, value: globalTeam.name});
      }
    }
  }

  /**
   * Function that enables the input according to the attribute
   * @param attribute the attribute describing the input type
   */
  enableInput(attribute: string) {
    switch (attribute) {
      case 'description':
        this.inputEnabled.description = true;
        break;
      case 'end_date':
        this.inputEnabled.date = true;
        break;
      case 'duration':
        this.inputEnabled.duration = true;
        break;
      case 'equipment':
        this.inputEnabled.equipment = true;
        break;
      default:
        break;
    }
  }

  /**
   * Function that saves the input according to its type
   * @param attribute the attribute describing the type of input
   */
  saveInput(attribute: string) {
    let updatedField: any;
    switch (attribute) {
      case 'description':
        updatedField = {description: this.task.description};
        this.inputEnabled.description = false;
        break;
      case 'end_date':
        const date_str = this.taskService.normaliseEndDateValue(this.date);
        this.task.end_date = date_str;
        updatedField = {end_date: this.task.end_date};
        this.inputEnabled.date = false;
        break;
      case 'duration':
        this.task.duration = this.durationDays + ' days, ' + this.durationTime.hour + ':' + this.durationTime.minute + ':00';
        this.inputEnabled.duration = false;
        break;
      case 'equipment':
        updatedField = {equipment: this.task.equipment.id};
        this.inputEnabled.equipment = false;
        break;
      default:
        break;
    }

    this.taskService.updateTask(this.task.id, updatedField).subscribe(
      (response) => {
        this.taskService.getTask(this.task.id).subscribe(
          (task: Task) => {
            this.task = task;
            this.formatDurationStringAndInitDurationInput();
            this.initDateInput();
          }
        );
      },
      (error) => {
        this.router.navigate(['four-oh-four']);
    });
  }

  /**
   * Function that initializes the date input
   */
  initDateInput() {
    if (this.task.end_date) {
      const tab_date = this.task.end_date.split('-');
      this.date = {year: parseInt(tab_date[0], 10),
                  month: parseInt(tab_date[1], 10),
                  day: parseInt(tab_date[2], 10)};
    } else {
      this.date = null;
    }
  }

  /**
   * Function that realizes the shaping of the duration for communication with the API
   */
  formatDurationStringAndInitDurationInput() {
    const days_time_separator = ' ';
    const hours_minutes_separator = ':';
    const init_str = this.task.duration;

    let days: string;
    let time: string;
    let right_part: string;
    let left_part: string;
    let days_str: string;

    if (this.task.duration) {
      [left_part, right_part] = init_str.split(days_time_separator);
      if (right_part) {
        days = left_part;
        time = right_part;
      } else {
        if (left_part.indexOf(hours_minutes_separator) === -1) {
          days = left_part;
        } else {
          time = left_part;
        }
      }

      if (days) {
        const plurel = parseInt(days, 10) > 1 ? 's' : '';
        days_str = parseInt(days, 10) > 0 ? days + 'day' + plurel + ', ' : '';
        this.durationDays = parseInt(days, 10);
      } else {
        days_str = '';
      }

      if (time) {
        let hours: string;
        let minutes: string;
        let seconds: string;
        [hours, minutes, seconds] = time.split(hours_minutes_separator);
        this.durationTime = {hour: parseInt(hours, 10), minute: parseInt(minutes, 10)};
      }

      this.taskDuration = days_str + time;
    }
  }

  /**
   * Function that navigate the equipment detail page linked to this task
   * @param idEquipment the id of the equipment to consult
   */
  onViewEquipment(idEquipment: number) {
    this.router.navigate(['/equipments', idEquipment]);
  }

  /**
   * Function that redirects on the team details page
   * @param team the team we want to access
   */
  onViewTeam(team: Team) {
    this.router.navigate(['/teams', team.id]);
  }

  /**
   * Function that is triggered to load the modal template for deletion
   * @param content the modal to open
   */
  openDelete(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteTask();
      }
    },
    (error) => {});
  }

  /**
   * Function that is triggered when validating the modal of deletion
   */
  onDeleteTask() {
    this.taskService.deleteTask(this.task.id).subscribe(
      (resp) => {
        this.teamService.getTeams();
        this.router.navigate(['/tasks']);
    });
  }

  /**
   * Function that display the delete button on Task considering user permissions
   */
  onDeleteTaskPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'delete_task'
      );
  }

  /**
   * Function that display the modify button on Task considering user permissions
   */
  onChangeTaskPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'change_task'
    );
  }

  /**
   * Function that is triggered to load the modal template for user addition
   * @param content the modal to open
   */
  openAddTeam(content) {
    this.initTeamsSelect();
    this.modalService.open(content, {ariaLabelledBy: 'modal-addTeam'}).result.then((result) => {
      if (result === 'OK') {
        this.onAddTeam();
      }
    },
    (error) => {});
  }

  /**
   * Function that initialize the multiselect for Teams
   */
  initTeamsSelect() {
    this.initTeamsDiff();
    this.dropdownTeamsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      noDataAvailablePlaceholderText: 'No other teams available',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
  }

  /**
   * Function that add a user in a team
   */
  onAddTeam() {
    const formValues = this.addTeamForm.value;
    const teamsToAdd = [];
    formValues.teams.forEach(team => {
      teamsToAdd.push(team.id);
    });
    teamsToAdd.forEach((teamId) => {
      this.taskService.addTeamToTask(this.task.id, teamId).subscribe(
        (res) => {
          this.taskService.getTasks();
          this.ngOnInit();
      });
    });
  }

  /**
   * Function that initializes the different forms used in the component
   */
  initForm() {
    this.addTeamForm = this.formBuilder.group({
      teams: ''
    });
  }

  /**
   * Function that returns the permissions from the team's users
   */
  onViewTeamsPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'view_team'
      );
  }

  /**
   * Function that removes a team from a task
   */
  onRemoveTeamFromTask(team: Team) {
    this.taskService.removeTeamFromTask(this.task.id, team.id).subscribe(
      (res) => {
        this.taskService.getTasks();
        this.ngOnInit();
    });
  }

  /**
   * Function that check if the value of a endCondition is valid in order to display the validation button.
   * @param condition the condition concerned.
   */
  isAValidValue(condition) {
    switch (condition.field_name) {
      case 'Photo':
        return this.fileToUpload.find(file => file.id === condition.id);
      case 'Checkbox':
        return this.endConditionValues[condition.id];
      case 'Integer':
        return this.endConditionValues[condition.id] !== null;
      case 'Description':
        return this.endConditionValues[condition.id]?.length > 0;
    }
  }

  /**
   * Function that apply the validation of an update on an end condition in database.
   * @param condition the condition concerned.
   */
  onValidateEndCondition(condition) {
    const updatedCondition: any[] = [];
    const finalData: any = {end_conditions: updatedCondition};
    if (this.isAValidValue(condition)) {
      this.validationError = false;
      switch (condition.field_name) {
        case 'Photo':
          this.fileService.uploadFile(this.fileToUpload[0].value).subscribe(
            (file) => {
              updatedCondition.push({id: condition.id, file: file.id});
              this.updateTask(finalData);
          });
          // Update fileToUpload
          this.removeOldFile(condition.id);
          break;
        case 'Checkbox':
          updatedCondition.push({id: condition.id, value: this.endConditionValues[condition.id].toString()});
          this.updateTask(finalData);
          break;
        case 'Integer':
          updatedCondition.push({id: condition.id, value: this.endConditionValues[condition.id].toString()});
          this.updateTask(finalData);
          break;
        case 'Description':
          updatedCondition.push({id: condition.id, value: this.endConditionValues[condition.id].toString()});
          this.updateTask(finalData);
          break;
        default:
          break;
      }

    } else {
      this.validationError = true;
    }
  }

  /**
   * Function that do the update on the Task by calling the function of the TaskService.
   * @param finalData the data to send for update.
   */
  updateTask(finalData) {
    this.taskService.updateTask(this.task.id, finalData).subscribe(
      (response) => {
        this.taskService.getTasks();
        this.taskService.getTask(this.task.id).subscribe(
          (task: Task) => {
            this.task = task;
            this.formatDurationStringAndInitDurationInput();
            this.initDateInput();
            this.initFiles();
        });
    });
  }

  /**
   * Function that tests if an end condition file is beeing selected.
   * @param condition the condition concerned.
   */
  isSelectedFile(condition) {
    return this.fileToUpload.find(file => file.id === condition.id);
  }

  /**
   * Function that registers the image to load
   * @param event the event linked to the image field modification
   */
  onSetPhotoToUpload(condition, event) {
    if (this.fileToUpload.length > 0) {
      this.removeOldFile(condition.id);
    }
    let formData: FormData;
    if (event.target.files[0] && !this.files.includes(event.target.files[0])) {
      formData = new FormData();
      console.log(event.target.files[0]);
      formData.append('file', event.target.files[0], event.target.files[0].name);
      console.log(formData);
      formData.append('is_manual', 'false');
      console.log(formData);
      this.fileToUpload.push({id: condition.id, value: formData});
    }
  }

  /**
   * Function that removes a file from the files to upload on change of a photo field
   * @param fileId the id of the concerned photo field
   */
  removeOldFile(fileId) {
    let i = 0;
    let found = false;
    while (!found && i < this.fileToUpload.length) {
      if (fileId === this.fileToUpload[i].id) {
        found = true;
      } else {
        i++;
      }
    }
    if (found) {
      this.fileToUpload.splice(i, 1);
    }
  }

  /**
   * Function that checks if the validation criterion are filled
   */
  checkFormContent() {
    for (const element of this.endConditionValues) {
      if (typeof element === typeof false) {
        if (!element) { return false; }
      } else if (typeof element === typeof 12) {
        if (element === null) { return false; }
      } else if (typeof element === typeof 'string') {
        if (element === null || element === '') { return false; }
      }
    }
    return true;
  }

  /**
   * Function that unsubscribe all the subscriptions
   */
  ngOnDestroy() {
    this.teamSubscription.unsubscribe();
    this.equipmentSubscription.unsubscribe();
  }

}
