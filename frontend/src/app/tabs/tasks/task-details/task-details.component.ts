import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/tasks/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/teams/team.service';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { faTrash, faPen, faCalendar, faSave } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Equipment } from 'src/app/models/equipment';
import { EquipmentService } from 'src/app/services/equipments/equipment.service';
import { NewTaskComponent } from '../new-task/new-task.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
/**
 * Component used to display the details of a task and to validate it.
 */
export class TaskDetailsComponent implements OnInit {
  // Icons
  faTrash = faTrash;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;
  faPen = faPen;
  faCalendar = faCalendar;
  faSave = faSave;

  // Local variables
  task: Task = null;
  description: string;
  equipmentName = '';
  taskDuration = '';
  teamsTask: Team[] = [];
  loaded = false;
  teams: Team[] = [];
  teamsDiff = [];
  date: NgbDateStruct;

  descriptionInputEnabled = false;
  dateInputEnabled = false;

  // Forms
  updateForm: FormGroup;
  addTeamForm: FormGroup;
  dropdownTeamsSettings: IDropdownSettings;


  constructor(private taskService: TaskService,
              private route: ActivatedRoute,
              private teamService: TeamService,
              private equipmentService: EquipmentService,
              private router: Router,
              private modalService: NgbModal,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let id: number;
    this.route.params.subscribe(params => {
      id = +params.id;
    });

    this.taskService.getTask(id).subscribe(
      (task: Task) => {
        this.task = task;
        this.description = task.description;
        if (this.task.equipment) {
          this.equipmentService.getEquipment(this.task.equipment).subscribe(
            (equipment: Equipment) => {
              this.equipmentName = equipment.name;
            }
          );
        }
        this.teamsTask = [];
        this.task.teams.forEach(teamId => {
          this.teamService.getTeam(teamId).subscribe((team: Team) => {
            this.teamsTask.push(team);
          });
        });
        this.loaded = true;
        this.formatDurationString();
        this.initDateInput();
      }
    );

    this.teamService.teamSubject.subscribe(
      (teams) => {
        this.teams = teams;
      }
    );
    this.equipmentService.emitEquipments();
    this.teamService.emitTeams();
    this.initForm();
  }

  enableInput(attribute: string) {
    switch (attribute) {
      case 'description':
        this.descriptionInputEnabled = true;
        break;
      case 'end_date':
        this.dateInputEnabled = true;
        break;
      default:
        break;
    }
  }

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
      default:
        break;
    }
    this.taskService.updateTask(this.task.id, this.task).subscribe(
      (response) => {
        console.log('updated');
      }
    );
  }

  initDateInput() {
    const tab_date = this.task.end_date.split('-');
    this.date = {year: parseInt(tab_date[0], 10),
                month: parseInt(tab_date[1], 10),
                day: parseInt(tab_date[2], 10)};
  }

  formatDurationString() {
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
    } else {
      days_str = '';
    }

    this.taskDuration = days_str + time;
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
   * Function that add a user in a team
   */
  onViewTeamsPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'view_team'
      );
  }

  /**
   * Function that add a user in a team
   */
  onRemoveTeamFromTask(team: Task) {
    this.taskService.removeTeamFromTask(this.task.id, team.id).subscribe(
      (res) => {
        this.taskService.getTasks();
        this.ngOnInit();
      }
    );
  }

}
