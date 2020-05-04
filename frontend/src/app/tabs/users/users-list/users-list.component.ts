import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfile } from '../../../models/user-profile';
import { Router } from '@angular/router';
import { faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/users/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})

/**
 * Class for the component in charge of showing a list of all users
 */
export class UsersListComponent implements OnInit, OnDestroy {
  // local Variables
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  users: UserProfile[] = [];
  usersSubscription: Subscription;

  /**
   * Constructor for the TeamList component
   * @param userService the service to communicate with backend on UserProfile objects
   * @param router the service used to handle redirections
   * @param modalService the service to handle modal windows
   */
  constructor(private userService: UserService, private router: Router, private modalService: NgbModal ) { }

  /**
   * Function that initialize the component when loaded
   * The component is initialized by getting all the user registered
   * on the backend database and saving them in a local variable.
   */
  ngOnInit(): void {
    // this.userService.getUsers();
    this.usersSubscription = this.userService.usersSubject.subscribe(
      (us: UserProfile[]) => {
        this.users = us;
      }
    );
    this.userService.emitUsers();
  }

  /**
   * Function that redirect to a precise User details page
   * @param user The User to display
   */
  onViewUser(user: UserProfile) {
    this.router.navigate(['/users', user.id]);
  }

  /**
   * Function that opens the modal to confirm a deletion
   * @param content the modal template to load
   * @param user the user concerned by the deletion
   */
  openDelete(content, user: UserProfile) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteUser(user);
      }
    });
  }

  /**
   * Function to delete a user
   * @param user the user to delete
   */
  onDeleteUser(user: UserProfile) {
    this.userService.deleteUser(user.id).subscribe(
      (resp) => {
        this.router.navigate(['/users']);
        this.userService.getUsers();
      }
    );
  }


  /**
   * Function called at the destruction of the component
   */
  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

}
