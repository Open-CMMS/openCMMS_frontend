import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/tasks/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/teams/team.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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

  // Local variables
  task: Task = null;
  teamsTask: Team[] = [];
  loaded = false;


  constructor(private taskService: TaskService,
              private route: ActivatedRoute,
              private teamService: TeamService,
              private router: Router,
              private modalService: NgbModal,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    let id: number;
    this.route.params.subscribe(params => {
      id = +params.id;
    });

    this.taskService.getTask(id).subscribe(
      (task: Task) => {
        this.task = task;
        console.log(this.task);
        this.teamsTask = [];
        this.task.teams.forEach(teamId => {
          this.teamService.getTeam(teamId).subscribe((team: Team) => {
            this.teamsTask.push(team);
          });
        });
        this.loaded = true;
      }
    );
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

  // /**
  //  * Function that display the modify button on Task considering user permissions
  //  */
  // onChangeTaskPermission() {
  //   return this.utilsService.isAUserPermission(
  //     this.authenticationService.getCurrentUserPermissions(),
  //     'change_task'
  //     );
  // }

}
