import { Component, OnInit, OnDestroy } from '@angular/core';
import { faTrash, faInfoCircle, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
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

  // Local Variables
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  faPlus = faPlus;
  faCheck = faCheck;

  tasks: Task[] = [];
  currentUser: UserProfile;
  tasksSubscription: Subscription = null;
  currentUserSubscription: Subscription = null;
  myTasks: boolean;

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
          this.tasksSubscription = this.taskService.taskSubject.subscribe(
            (tasks: Task[]) => {
              this.tasks = tasks;
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
        // this.router.navigate(['/tasks']); // Modify to take the current link into account
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
   * Compare function call by sort when neeeded to sort by date.
   * @param a the date a
   * @param b the date b
   */
  compareDate(a: Task, b: Task) {
    const dateA = new Date(a.end_date);
    const dateB = new Date(b.end_date);
    // @ts-ignore
    return dateB - dateA;
  }

  /**
   * Function called when the tasks need to be sorting by end_date
   */
  sortingByEndDate() {
    this.tasks.sort(this.compareDate);
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
