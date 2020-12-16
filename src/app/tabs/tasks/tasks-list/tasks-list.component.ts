import {Component, OnInit, OnDestroy} from '@angular/core';
import { faTrash, faInfoCircle, faPlus, faCheck, faSearch, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { TaskService } from 'src/app/services/tasks/task.service';
import { Task } from 'src/app/models/task';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UserProfile } from 'src/app/models/user-profile';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit, OnDestroy {

  // Icon
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  faPlus = faPlus;
  faCheck = faCheck;
  faSearch = faSearch;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  taskState: boolean;

  // Local variables
  tasks: Task[] = [];
  noValidatedTasks: Task[] = [];
  currentUser: UserProfile;
  tasksSubscription: Subscription = null;
  currentUserSubscription: Subscription = null;
  myTasks: boolean;
  p = 1;
  sortByDate = false;
  sortByDuration = false;
  showValidatedTaskButton = null;

  // Search text
  searchText = '';

  modalTaskName = '';

  /**
   * Constructor for the TasksList component
   * @param taskService the service used to handle tasks
   * @param router the service used to handle redirections
   * @param modalService the service to handle modal windows
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   * @param route the activated route
   */
  constructor(private taskService: TaskService,
              private router: Router,
              private modalService: NgbModal,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {

    // Checking the route
    this.route.url.subscribe(
      (route) => {
        if (route[0].path === 'tasks') { // Users tasks display
          this.taskState = true;
          this.currentUserSubscription = this.authenticationService.currentUserSubject.subscribe(
            (currentUser) => {
              this.currentUser = currentUser;
            }
          );
          this.authenticationService.emitCurrentUser();
          this.taskService.getUserTasks(this.currentUser.id).subscribe(
            (tasks: Task[]) => {
              this.tasks = tasks;
            }
          );
          this.myTasks = true;
        } else { // path equals tasks-management: all the tasks are displayed
          this.taskState = false;
          this.taskService.getTasks();
          this.tasksSubscription = this.taskService.taskSubject.subscribe(
            (tasks: Task[]) => {
              this.tasks = tasks;
              tasks.forEach(task => {
                if (task.over === false) {
                  this.noValidatedTasks.push(task);
                }
              });
              this.showValidatedTaskButton = {showValidatedTasks : false, text: 'Show validated tasks'};
            }
          );
          this.taskService.emitTasks();
          this.myTasks = false;
        }
      }
    );
  }

  /**
   * Function that redirect to a precise Task details page
   * @param task The task to display
   */
  onViewTask(task: Task) {
    this.router.navigate(['/tasks/', task.id]);
  }

  /**
   * Function that opens the modal to confirm a deletion
   * @param content the modal template to load
   * @param task the task concerned by the deletion
   */
  openDelete(content, task: Task) {
    this.modalTaskName = task.name;
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteTask(task);
      }
    });
  }

  /**
   * Function to delete a team
   * @param task the team to delete
   */
  onDeleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe(
      (resp) => {
        this.taskService.getTasks();
        this.taskService.getUserTasks(this.currentUser.id).subscribe(
          (tasks: Task[]) => {
            this.tasks = tasks;
          }
        );
      }
    );
  }

  /**
   * Function that display the delete button on Teams considering user permissions
   */
  onDeleteTaskPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'delete_task'
      );
  }

  /**
   * Function to navigate on the tasks creation page
   */
  onCreateTask() {
    this.router.navigate(['/new-task']);
  }

  /**
   * Function that display Create Team button in navbar when current User has the correct permission
   */
  onAddTeamPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'add_task'
      );
  }

  /**
   * Compare function call by sort when needed to sort by date.
   * @param a a date
   * @param b b date
   */
  compareDate(a: Task, b: Task) {
    const dateA = new Date(a.end_date);
    const dateB = new Date(b.end_date);
    // @ts-ignore
    return dateB - dateA;
  }

  compareDuration(a: Task, b: Task) {
    const duration_A = a.duration;
    const duration_B = b.duration;
    const times_A = duration_A.split(' ');
    const times_B = duration_B.split(' ');
    let duration_in_minutes_A = 0;
    let duration_in_minutes_B = 0;
    times_A.forEach( time => {
      switch (time.charAt(time.length - 1 )) {
        case 'd':
          duration_in_minutes_A += parseInt(time.split('d')[0], 10) * 24 * 60;
          break;
        case 'h':
          duration_in_minutes_A += parseInt(time.split('h')[0], 10) * 60;
          break;
        case 'm':
          duration_in_minutes_A += parseInt(time.split('m')[0], 10);
          break;
      }
    });
    times_B.forEach( time => {
      switch (time.charAt(time.length - 1 )) {
        case 'd':
          duration_in_minutes_B += parseInt(time.split('d')[0], 10) * 24 * 60;
          break;
        case 'h':
          duration_in_minutes_B += parseInt(time.split('h')[0], 10) * 60;
          break;
        case 'm':
          duration_in_minutes_B += parseInt(time.split('m')[0], 10);
          break;
      }
    });
    return duration_in_minutes_B - duration_in_minutes_A;
  }

  /**
   * Function called when the tasks need to be sorting by end_date
   */
  sortingByEndDate() {
    this.sortByDuration = false;
    this.sortByDate = true;
    this.tasks.sort(this.compareDate);
    this.tasks.forEach(task => {
      if (task.end_date) {
        const index = this.tasks.indexOf(task);
        this.tasks.splice(index, 1);
        this.tasks.unshift(task);
      }
    });
  }

  sortingByDuration() {
    this.sortByDate = false;
    this.sortByDuration = true;

    this.tasks.sort(this.compareDuration);
    this.tasks.forEach(task => {
      if (task.duration) {
        const index = this.tasks.indexOf(task);
        this.tasks.splice(index, 1);
        this.tasks.unshift(task);
      }
    });
  }

  /**
   * Set the state of the button that allows to hide or show validated tasks
   */
  showValidateTask() {
    if (this.showValidatedTaskButton.showValidatedTasks) {
      this.showValidatedTaskButton = {showValidatedTasks : false, text: 'Show validated tasks'};
    } else {
      this.showValidatedTaskButton = {showValidatedTasks : true, text: 'Hide validated tasks'};
    }
  }

  /**
   * Function called at the destruction of the component
   */
  ngOnDestroy() {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }


}
