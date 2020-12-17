import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/tasks/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/teams/team.service';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import {
  faTrash,
  faPen,
  faCalendar,
  faSave,
  faInfoCircle,
  faCheck,
  faBook,
  faPlusCircle,
  faMinusCircle,
  faChevronLeft,
  faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { faMinusSquare, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Subscription, Subject } from 'rxjs';
import { FileService } from 'src/app/services/files/file.service';
import { environment } from 'src/environments/environment';
import { durationRegex } from 'src/app/shares/consts';
import {EquipmentType} from '../../../models/equipment-type';
import {EquipmentTypeService} from '../../../services/equipment-types/equipment-type.service';
import {UrlService} from '../../../services/shared/url.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
/**
 * Component used to display the details of a task and to validate it.
 */
export class TaskDetailsComponent implements OnInit, OnDestroy {

  // Icon variables
  faTrash = faTrash;
  faPlusSquare = faPlusSquare;
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;
  faMinusSquare = faMinusSquare;
  faPen = faPen;
  faCalendar = faCalendar;
  faSave = faSave;
  faInfoCircle = faInfoCircle;
  faCheck = faCheck;
  faBook = faBook;
  faCheckCircle = faCheckCircle;
  faChevronLeft = faChevronLeft;

  /*
    ##### Local variables #####
  */

  // Useful variables
  loaded = false;
  BASE_URL_API = environment.baseUrl;
  previousUrl = '';

  // Task
  task = null;
  taskDuration = '';
  teamsTask: Team[] = [];

  // Equipments
  equipments: Equipment[] = [];
  equipmentsList = [];
  selectedEquipment = [];

  // Equipment types
  equipment_types: EquipmentType[] = [];
  equipmentTypesList = [];
  selectedEquipmentType = [];

  // Teams
  teams: Team[] = [];
  teamsDiff = [];

  // Date and duration
  date: NgbDateStruct;
  durationRegex = new RegExp(durationRegex);
  durationError = false;

  // Files
  files: any[] = [];
  newFile: any = null;
  fileToUpload: any[] = [];
  fileCheck: boolean;
  fileTypeCheck: boolean;
  fileCheckValid: boolean;
  fileTypeCheckValid: boolean;

  // End conditions
  endConditionValues: any = {};
  validationError = false;

  // Input activation
  inputEnabled = {
    description: false,
    date: false,
    duration: false,
    equipment: false,
    equipment_type: false,
  };

  // Subscriptions
  teamSubscription: Subscription;
  equipmentSubscription: Subscription;
  equipmentTypeSubscription: Subscription;

  // End conditions
  endConditionsSubject = new Subject<any[]>();
  endConditionSubscription: Subscription;

  // Trigger Conditions
  triggerConditionsSubject = new Subject<any[]>();
  triggerConditionSubscription: Subscription;
  triggerConditionRecurrenceName = 'Recurrence';

  // Forms
  addTeamForm: FormGroup;
  dropdownTeamsSettings: IDropdownSettings;


  /**
   * Constructor of TaskDetailsComponent
   * @param taskService the service used to handle tasks
   * @param route the service used to handle route parameters
   * @param teamService the service used to handle teams
   * @param equipmentService the service used to handle equipments
   * @param equipmentTypeService the service used to handle equipment types
   * @param router the service used to handle routing
   * @param modalService the service used to handle modals
   * @param utilsService the service used for useful methods
   * @param authenticationService the service used to handle authentication
   * @param formBuilder the service used to handle forms
   * @param fileService the service used to handle files
   * @param urlService the service used to handle URL
   */
  constructor(private taskService: TaskService,
              private route: ActivatedRoute,
              private teamService: TeamService,
              private equipmentService: EquipmentService,
              private equipmentTypeService: EquipmentTypeService,
              private router: Router,
              private modalService: NgbModal,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private fileService: FileService,
              private urlService: UrlService) { }

  ngOnInit(): void {
    this.urlService.previousUrl$.subscribe( (previousUrl: string) => {
      this.previousUrl = previousUrl;
    });
    let id: number;
    this.fileCheckValid = true;
    this.fileTypeCheckValid = true;
    this.fileCheck = true;
    this.fileTypeCheck = true;
    this.route.params.subscribe(params => {
      id = +params.id;
    });

    this.getTask(id);

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

    // Subscribing to the equipment types
    this.equipmentTypeSubscription = this.equipmentTypeService.equipment_types_subject.subscribe(
        (equipmentTypes) => {
          this.equipment_types = equipmentTypes;
        });

    // Updating every subscriptions
    this.equipmentService.emitEquipments();
    this.equipmentTypeService.emitEquipmentTypes();
    this.teamService.emitTeams();
  }

  /*
    ##### INITIALISATION FUNCTIONS #####
  */

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
   * Function that initializes the different forms used in the component
   */
  initForm() {
    this.addTeamForm = this.formBuilder.group({
      teams: ''
    });
  }

  /*
    ##### DYNAMIC FIELDS MODIFICATION FUNCTIONS #####
  */

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
      case 'equipment_type':
        this.inputEnabled.equipment_type = true;
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
        updatedField = {duration: this.task.duration};
        this.inputEnabled.duration = false;
        break;
      case 'equipment':
        updatedField = {equipment: this.task.equipment.id};
        this.inputEnabled.equipment = false;
        break;
      case 'equipment_type':
        updatedField = {equipment_type: this.task.equipment_type.id};
        this.inputEnabled.equipment_type = false;
        break;
      default:
        break;
    }

    this.updateTask(updatedField);
  }

  /**
   * Function that update the duration status after each modification of the field value
   * @param durationField the field containing the duration to check
   */
  onUpdateDurationValidity(durationField) {
    this.durationError = durationField.validity.patternMismatch;
  }

  /*
    ##### MODAL RELATED FUNCTIONS #####
  */

  /**
   * Function that is triggered to load the modal template for task deletion
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
   * Function that is triggered to load the modal template for file deletion
   * @param content the modal to open
   * @param file the file to delete
   */
  openDeleteFile(content, file) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete-file'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteFile(file);
      }
    },
    (error) => {});
  }

  /**
   * Function that is triggered to load the modal template for file addition
   * @param content the modal to open
   */
  openAddFile(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-add-file'}).result.then((result) => {
      if (result === 'OK') {
        this.getTask(this.task.id);
      } else if (result === 'KO') {
        this.newFile = null;
      }
    },
    (error) => {});
  }

  /**
   * Function that get the size of the file the user want to upload.
   * @param content the modal to open
   */
  getFileInfo(content, key: string) {
    if (key === 'assoc') {
      this.fileCheck = true;
      this.fileTypeCheck = true;
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
    } else if (key === 'valid') {
        this.fileCheckValid = true;
        this.fileTypeCheckValid = true;
        if (content.target.files[0].type === 'image/png'
        || content.target.files[0].type === 'image/jpeg'
        || content.target.files[0].type === 'application/pdf') {
          this.fileTypeCheckValid = true;
        } else {
          this.fileTypeCheckValid = false;
      }
        if (content.target.files[0].size / 1000000 <= 10) {
      this.fileCheckValid = true;
      } else {
        this.fileCheckValid = false;
    }
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
   * Function that is triggered to load the modal template for team addition
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

  /*
    ##### REQUESTS RELATED FUNCTIONS #####
  */

  /**
   * Function that retrieves the Task corresponding to the requested one in the URL
   * @param id the task id
   */
  getTask(id: number) {
    // Get the concerned task and its associated objects (equipment, teams, ...)
    this.taskService.getTask(id).subscribe(
      (task: Task) => {
        this.task = task;
        // Set up files format with right URIs
        this.initFiles();
        // Init duration status
        this.durationError = !this.durationRegex.test(task.duration);
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
  }

  /**
   * Function that do the update on the Task by calling the function of the TaskService.
   * @param finalData the data to send for update.
   */
  updateTask(finalData) {
    this.taskService.updateTask(this.task.id, finalData).subscribe(
      (response) => {
        this.taskService.getTasks();
        this.getTask(this.task.id);
    });
  }

  /*
    ##### EVENT TRIGGERED FUNCTIONS #####
  */

  /**
   * Function that navigate the equipment detail page linked to this task
   * @param idEquipment the id of the equipment to consult
   */
  onViewEquipment(idEquipment: number) {
    this.router.navigate(['/equipments', idEquipment]);
  }

  /**
   * Function that navigate the equipment type detail page linked to this task
   * @param idEquipmentType the id of the equipment to consult
   */
  onViewEquipmentType(idEquipmentType: number) {
    this.router.navigate(['/equipment-types', idEquipmentType]);
  }

  /**
   * Function that redirects on the team details page
   * @param team the team we want to access
   */
  onViewTeam(team: Team) {
    this.router.navigate(['/teams', team.id]);
  }

  /**
   * Function that is triggered to delete a file from the task
   * @param file the file to delete
   */
  onDeleteFile(file) {
    const fileToDelete = this.task.files.find(taskFile => taskFile.file.split('/')[-1] === file.fileLink.split('/')[-1]);
    this.fileService.deleteFile(fileToDelete.id).subscribe(
      (_) => {
        this.getTask(this.task.id);
      },
      (error) => {
        console.log('Error :', error);
      }
    );
  }

  /**
   * Function that is triggered when validating the modal of deletion
   */
  onDeleteTask() {
    this.taskService.deleteTask(this.task.id).subscribe(
      (resp) => {
        this.teamService.getTeams();
        this.taskService.getTasks();
        this.router.navigate(['/tasks']);
    });
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
   * Function that removes a team from a task
   * @param team the team to remove
   */
  onRemoveTeamFromTask(team: Team) {
    this.taskService.removeTeamFromTask(this.task.id, team.id).subscribe(
      (res) => {
        this.taskService.getTasks();
        this.ngOnInit();
    });
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
          this.fileToUpload = [];
          break;
        case 'Integer':
          updatedCondition.push({id: condition.id, value: this.endConditionValues[condition.id].toString()});
          this.updateTask(finalData);
          this.fileToUpload = [];
          break;
        case 'Description':
          updatedCondition.push({id: condition.id, value: this.endConditionValues[condition.id].toString()});
          this.updateTask(finalData);
          this.fileToUpload = [];
          break;
        default:
          break;
      }

    } else {
      this.validationError = true;
    }
  }

  /**
   * Function that verifies if the task has special trigger conditions related to the equipment
   */
  hasSpecialTriggerConditions() {
    return this.task.trigger_conditions.find(tc => tc.field_name !== 'Recurrence');
  }

  /**
   * Function that registers the image to load
   * @param condition the condition associated to the photo to upload
   * @param event the event linked to the image field modification
   */
  onSetPhotoToUpload(condition, event) {
    if (this.fileToUpload.length > 0) {
      this.removeOldFile(condition.id);
    }
    let formData: FormData;
    if (event.target.files[0] && !this.files.includes(event.target.files[0])) {
      formData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      formData.append('is_manual', 'false');
      this.fileToUpload.push({id: condition.id, value: formData});
    }
  }

  /**
   * Function that registers the file to load
   * @param event the event linked to the image field modification
   */
  onSetFileToUpload(event) {
    let formData: FormData;
    if (event.target.files[0] && !this.files.includes(event.target.files[0])) {
      formData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      formData.append('is_manual', 'true');
      this.newFile = { data: formData };
    }
  }

  /**
   * Function that update the task when a new file is attached to it
   */
  onUpdateTaskWithNewFile() {
    this.fileCheck = true;
    if (this.newFile !== null) {
      this.fileService.uploadFile(this.newFile.data).subscribe(
        (file) => {
          this.newFile = null;
          const finalData = {files: []};
          for (const taskFile of this.task.files) {
            finalData.files.push(taskFile.id);
          }
          finalData.files.push(file.id);
          this.updateTask(finalData);
      });
    }
  }

  /*
    ##### TOOL FUNCTIONS #####
  */

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
   * Function that tests if an end condition file is being selected.
   * @param condition the condition concerned.
   */
  isSelectedFile(condition) {
    return this.fileToUpload.find(file => file.id === condition.id);
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

  /*
    ##### PERMISSION CHECK FUNCTIONS #####
  */

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
   * Function that returns the permissions from the team's users
   */
  onViewTeamsPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'view_team'
      );
  }


  /**
   * Function that unsubscribe all the subscriptions
   */
  ngOnDestroy() {
    this.teamSubscription.unsubscribe();
    this.equipmentSubscription.unsubscribe();
    this.equipmentTypeSubscription.unsubscribe();
  }

  /**
   * Function to return to the listing page.
   */
  onPreviousPage() {
    this.router.navigate([this.previousUrl]);
  }

}
