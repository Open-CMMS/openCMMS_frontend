import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup} from '@angular/forms';
import { UserProfile } from 'src/app/models/user-profile';
import { UserService } from 'src/app/services/users/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})

/**
 * Class for the component in charge of showing user details
 */
export class UserDetailsComponent implements OnInit {
  // Font awesome logos
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;

// Local variables
  loaded = false;
  updateError = false;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user: UserProfile = null;
  userUpdateForm: FormGroup;


  /**
   * Constructor for component TeamDetailsComponent
   * @param router the service used to handle redirections
   * @param userService the service to communicate with backend on User objects
   * @param route the service used to analyse the current URL
   * @param formBuilder the service to handle forms
   * @param modalService the service used to handle modal windows
   */
  constructor(private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private authenticationService: AuthenticationService) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    let id: number;
    this.route.params.subscribe(params => {
      if (params.id) {
        id = +params.id;
      } else {
        id = this.authenticationService.getCurrentUser().id;
      }
    });
    this.userService.getUser(id)
      .subscribe(
        (userLoaded: UserProfile) => {
          this.username = userLoaded.username;
          this.first_name = userLoaded.first_name;
          this.last_name = userLoaded.last_name;
          this.email = userLoaded.email;
          this.user = new UserProfile(userLoaded.id,
                                      userLoaded.username,
                                      userLoaded.first_name,
                                      userLoaded.last_name,
                                      userLoaded.email,
                                      userLoaded.password,
                                      userLoaded.nb_tries,
                                      userLoaded.is_active);
          this.loaded = true;
          this.initForm();
        },
        (error) => {
          this.router.navigate(['/four-oh-four']);
        }
      );
  }

  /**
   * Function to delete a user
   */
  onDeleteUser() {
    this.userService.deleteUser(this.user.id).subscribe(
      (resp) => {
        this.router.navigate(['/users']);
        this.userService.getUsers();
      }
    );
  }

  /**
   * Function to modify a user
   */
  onModifyUser() {
    const formValues = this.userUpdateForm.value;
    if (this.user.last_name !== formValues.lastName) {
      this.user.last_name = formValues.lastName;
    }
    if (this.user.first_name !== formValues.firstName) {
      this.user.first_name = formValues.firstName;
    }
    if (this.user.email !== formValues.email) {
      this.user.email = formValues.email;
    }
    this.userService.updateUser(this.user).subscribe(userUpdated => {
      this.updateError = false;
      this.initForm();
      this.userService.getUsers();
    },
    (error) => {
      this.updateError = true;
    });
  }

  /**
   * Function that opens the modal to confirm a deletion
   * @param content the modal template to load
   */
  openDelete(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteUser();
      }
    });
  }

  /**
   * Function that opens the modal to confirm a deletion
   * @param content the modal template to load
   */
  openModify(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-modify'}).result.then((result) => {
      if (result === 'OK') {
        this.onModifyUser();
      }
    });
  }

  /**
   * Fonction that initialise the form with the right values
   */
  initForm() {
    this.userUpdateForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      email: '',
    });
    this.userUpdateForm.setValue({
      lastName: this.user.last_name,
      firstName: this.user.first_name,
      email: this.user.email
    });
  }

}
