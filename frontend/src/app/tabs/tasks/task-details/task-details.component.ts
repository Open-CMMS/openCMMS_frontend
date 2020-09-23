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
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { Subscription, Subject } from 'rxjs';
import { FileService } from 'src/app/services/files/file.service';
import { environment } from 'src/environments/environment';

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

  // Local variables
  task: Task = null;
  description: string;
  equipmentName = '';
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


  descriptionInputEnabled = false;
  dateInputEnabled = false;
  durationInputEnabled = false;
  equipmentInputEnabled = false;

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
        this.task = task;
        this.description = task.description;
        if (this.task.equipment) {
          this.equipmentService.getEquipment(this.task.equipment).subscribe(
            (equipment: Equipment) => {
              this.equipmentName = equipment.name;
              this.selectedEquipment = [{id: equipment.id.toString(), value: equipment.name}];
            }
          );
        }
        this.teamsTask = [];
        this.task.teams.forEach(teamId => {
          this.teamService.getTeam(teamId).subscribe((team: Team) => {
            this.teamsTask.push(team);
            this.initTeamsDiff();
          });
        });
        this.files = [];
        if (this.task.files) {
          this.task.files.forEach((fileId) => {
            this.fileService.getFile(fileId).subscribe(
              (res: any) => {
                const file = {
                  fileName: decodeURI(res.file.split('/')[1]),
                  fileLink: '/' + res.file,
                  is_manual: res.is_manual
                };
                this.files.push(file);
              }
            );
          });
        }
        this.loaded = true;
        this.formatDurationStringAndInitDurationInput();
        this.initDateInput();
      }
    );

    // Subscribing to the teams list
    this.teamSubscription = this.teamService.teamSubject.subscribe(
      (teams) => {
        this.teams = teams;
      }
    );

    // Subscribing to the equipments
    this.equipmentSubscription = this.equipmentService.equipmentsSubject.subscribe(
      (equipments) => {
        this.equipments = equipments;
        this.initEquipmentsSelect();
      }
    );

    // Subscribing to the field objects
    this.tasksSubscription = this.taskService.fieldObjectSubject.subscribe(
      (fieldObjects) => {
        this.allFieldObjects = fieldObjects;
      }
    );

    this.triggerConditionSubscription = this.triggerConditionsSubject.subscribe(
      (triggerConditions) => {
        this.triggerConditions = triggerConditions;
      }
    );

    this.endConditionSubscription = this.endConditionsSubject.subscribe(
      (endConditions) => {
        this.endConditions = endConditions;
      }
    );

    // Updating every subscriptions
    this.equipmentService.emitEquipments();
    this.teamService.emitTeams();
    this.taskService.emitFieldObjects();

    // Getting triggering and end conditions of the task separated
    this.taskService.getFields().subscribe(
      (fields) => {
        this.fields = fields;
        this.getTaskFieldObjects(id);
        this.separateFieldsByTypes();
      }
    );

    // initialize Forms
    this.initForm();
  }

  /**
   * Function that get field objects associated to the displayed task
   * @param id the id of the displayed task
   */
  getTaskFieldObjects(id: number) {
    this.taskFieldObjects = [];
    for (const fieldObject of this.allFieldObjects) {
      if (fieldObject.described_object === 'Task: ' + id) {
        this.taskFieldObjects.push(fieldObject);
      }
    }
  }

  /**
   * Functions that splits the field objects into two groups: triggerConditions and endConditions
   */
  separateFieldsByTypes() {
    this.endConditions = [];
    this.triggerConditions = [];
    let typeOfField: string;
    for (const field of this.taskFieldObjects) {
      if (this.fields[field.field - 1].name === 'End Conditions') {
        this.endConditionsOriginal.push(field);
        this.taskService.getFieldValues(field.field).subscribe(
          (fieldValues) => {
            for (const fieldValue of fieldValues) {
              if (field.field_value === fieldValue.id) {
                typeOfField = fieldValue.value;
              }
            }
            const endCondition = {
              id: field.id,
              type: typeOfField,
              description: field.description,
              value: field.value
            };
            this.endConditions.push(endCondition);
            this.endConditionsSubject.next(this.endConditions);

            switch (endCondition.type) {
              case 'Case a cocher':
                this.endConditionValues.push(false);
                break;
              case 'Valeur numerique à rentrer':
                this.endConditionValues.push(null);
                break;
              case 'Description':
                this.endConditionValues.push('');
                break;
              case 'Photo':
                this.endConditionValues.push('');
                break;
            }
          }
        );
      } else if (this.fields[field.field - 1].name === 'Trigger Conditions') {
        this.taskService.getFieldValues(field.field).subscribe(
          (fieldValues) => {
            for (const fieldValue of fieldValues) {
              if (field.field_value === fieldValue.id) {
                typeOfField = fieldValue.value;
              }
            }
            const triggerCondition = {
              type: typeOfField,
              description: field.description,
              value: field.value
            };
            this.triggerConditions.push(triggerCondition);
            this.triggerConditionsSubject.next(this.triggerConditions);
          }
        );
      }
    }
  }

  /**
   * Function that initializes the equipment multiselect
   */
  initEquipmentsSelect() {
    this.equipmentsList = [];
    this.equipments.forEach(equipment => {
      this.equipmentsList.push({id: equipment.id.toString(), value: equipment.name});
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
   * Function that initializes the Teams multiselect with only teams that are not on this task
   */
  initTeamsDiff() {
    this.teamSubscription = this.teamService.teamSubject.subscribe(
      (teams: Team[]) => {
        teams.forEach((team) => {
          if (this.teams.indexOf(team) === -1) {
            this.teamsDiff.push(team);
          }
        });
      }
    );
  }

  /**
   * Function that enables the input according to the attribute
   * @param attribute the attribute describing the input type
   */
  enableInput(attribute: string) {
    switch (attribute) {
      case 'description':
        this.descriptionInputEnabled = true;
        break;
      case 'end_date':
        this.dateInputEnabled = true;
        break;
      case 'duration':
        this.durationInputEnabled = true;
        break;
      case 'equipment':
        this.equipmentInputEnabled = true;
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
    switch (attribute) {
      case 'description':
        this.task.description = this.description;
        this.descriptionInputEnabled = false;
        break;
      case 'end_date':
        const date_str = this.taskService.normaliseEndDateValue(this.date);
        this.task.end_date = date_str;
        this.dateInputEnabled = false;
        break;
      case 'duration':
        this.durationInputEnabled = false;
        this.task.time = this.durationDays + ' days, ' + this.durationTime.hour + ':' + this.durationTime.minute + ':00';
        break;
      case 'equipment':
        if(this.selectedEquipment[0] == null){
          this.equipmentInputEnabled = false;
          this.task.equipment = null;
          this.equipmentName = null;
        } else {
          this.equipmentInputEnabled = false;
          this.task.equipment = this.selectedEquipment[0].id;
          this.equipmentName = this.selectedEquipment[0].value;
        }
        break;
      default:
        break;
    }
    this.taskService.updateTask(this.task.id, this.task).subscribe(
      (response) => {
        this.taskService.getTask(this.task.id).subscribe(
          (task: Task) => {
            this.task = task;
            this.formatDurationStringAndInitDurationInput();
          }
        );
      }
    );
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
    const init_str = this.task.time;
    let days: string;
    let time: string;
    let right_part: string;
    let left_part: string;
    let days_str: string;
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
      }
    );
  }

  /**
   * Function that is triggered to load the modal template for modification
   * @param content the modal to open
   */
  openModify(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-modify'}).result.then((result) => {
      if (result === 'OK') {
        // this.onModifyTeam();
      }
    },
    (error) => {});
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
    this.teamsDiff = [];
    let found = false;
    this.teams.forEach(team => {
          found = false;
          this.teamsTask.forEach(
          (teamTask) => {
            if (team.id === teamTask.id) {
              found = true;
            }
          }
          );
          if (!found) {
            this.teamsDiff.push({id: team.id.toString(), value: team.name});
          }
    });
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
        }
      );
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
      }
    );
  }

  /**
   * Function that realises all the requests to validate the task when the button is clicked
   */
  onValidateTask() {

    if (this.checkFormContent()) {
      // upload Files
      const tempNewFilesIds: number[] = [];
      let fileCount = 0;
      if (this.fileToUpload.length > 0) {
        for (const file of this.fileToUpload) {
          this.fileService.uploadFile(file.data).subscribe(fileUploaded => {
            tempNewFilesIds.push(fileUploaded.id);
            fileCount++;
            if (fileCount === this.fileToUpload.length) {
              const tempTask = this.task;
              for (const id of tempNewFilesIds) {
                tempTask.files.push(id);
              }
              tempTask.over = true;
              this.taskService.updateTask(tempTask.id, tempTask).subscribe(
                (res) => {
                  this.ngOnInit();
                  this.router.navigate(['tasks-management']);
                }
              );
            }
          });
        }
      } else {
        const tempTask = this.task;
        tempTask.over = true;
        this.taskService.updateTask(tempTask.id, tempTask).subscribe(
          (res) => {
            this.ngOnInit();
            this.router.navigate(['tasks-management']);
          }
        );
      }
      // update FieldObjects values
      let i = 0;
      for (const endCondition of this.endConditionsOriginal) {
        endCondition.value = this.endConditionValues[i].toString();
        //console.log(endCondition);
        this.taskService.updateFieldObject(endCondition).subscribe();
        i++;
      }
    } else {
      this.validationError = true;
    }

  }

  /**
   * Function that registers the image to load
   * @param event the event linked to the image field modification
   */
  onSetPhotoToUpload(i, event) {
    if (this.fileToUpload.length > 0) {
      this.removeOldFile(i);
    }
    let formData: FormData;
    if (!this.files.includes(event.target.files[0])) {
      formData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      formData.append('is_manual', 'false' );
      this.fileToUpload.push({id: i, data: formData});
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
    this.tasksSubscription.unsubscribe();
    this.equipmentSubscription.unsubscribe();
    this.triggerConditionSubscription.unsubscribe();
    this.endConditionSubscription.unsubscribe();
  }

}
