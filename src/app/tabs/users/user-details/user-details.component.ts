import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faPencilAlt, faTrash, faInfoCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserProfile } from 'src/app/models/user-profile';
import { UserService } from 'src/app/services/users/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Subscription } from 'rxjs';
import { CrossMatch } from 'src/app/shares/cross-match.validator';
import {TeamService} from '../../../services/teams/team.service';
import {Team} from '../../../models/team';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})

/**
 * Class for the component in charge of showing user details
 */
export class UserDetailsComponent implements OnInit, OnDestroy {
  // Font awesome logos
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  faEnvelope = faEnvelope;

// Local variables
  loaded = false;
  updateError = false;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user: UserProfile = null;
  currentUserSubscription: Subscription;
  currentUser: UserProfile;
  onInfoPage = false;
  submitted = false;
  changePwdActivated = false;
  teamsSubscription: Subscription;
  teams = [];
  resendSuccess = null;

  // Forms
  userUpdateForm: FormGroup;
  setPasswordForm: FormGroup;

  /**
   * Constructor for component TeamDetailsComponent
   * @param router the service used to handle redirections
   * @param userService the service to communicate with backend on User objects
   * @param teamService the service used to handle Teams
   * @param route the service used to analyse the current URL
   * @param formBuilder the service to handle forms
   * @param modalService the service used to handle modal windows
   * @param authenticationService the auth service
   * @param utilsService the service used for useful functions
   */
  constructor(private router: Router,
              private userService: UserService,
              private teamService: TeamService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private authenticationService: AuthenticationService,
              private utilsService: UtilsService) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    let id: number;
    this.currentUserSubscription = this.authenticationService.currentUserSubject.subscribe(
      (currentUser) => {
        this.currentUser = currentUser;
      }
    );
    this.authenticationService.emitCurrentUser();
    this.route.params.subscribe(params => {
      if (params.id) {
        id = +params.id;
        this.onInfoPage = false;
      } else if (this.currentUser !== null) {
        id = this.currentUser.id;
        this.onInfoPage = true;
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
          this.teamsSubscription = this.teamService.teamSubject.subscribe(
            (teams: Team[]) => {
              teams.forEach(team => {
                if (team.user_set.includes(this.user.id)) {
                  this.teams.push({id: team.id, name: team.name});
                }
              });
            }
          );
          this.teamService.emitTeams();
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
   * Function that calls the service function that resend the onboarding mail to the current user
   */
  onResendOnboardingMail() {
    this.userService.resendOnboardingMail(this.user.id).subscribe(
      (response) => {
        this.resendSuccess = true;
      },
      (error) => {
        this.resendSuccess = false;
      }
    );
    setTimeout(
      () => {
        this.resendSuccess = null;
      }, 10000);
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
   * Function to set a new password
   */
  onSetPassword() {
    this.submitted = true;

    if (this.setPasswordForm.invalid) {
      return;
    }

    const formValues = this.setPasswordForm.value;
    this.userService.updateUserPassword(this.user, formValues.password).subscribe(userUpdated => {
      this.updateError = false;
      this.onInfoPage = true;
      this.changePwdActivated = false;
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
  openResend(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-resend'}).result.then((result) => {
      if (result === 'OK') {
        this.onResendOnboardingMail();
      }
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
   * Function that displays the form to change a user's
   * password when Change password is clicked
   */
  onActivateChangePassword() {
    this.changePwdActivated = true;
    this.onInfoPage = false;
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
    this.setPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(7)]],
      confPassword: ['', Validators.required]
    }, {
      validator: CrossMatch('password', 'confPassword')
    });
  }

  /**
   * Function that display Modify button in navbar when current User has the correct permission
   */
  onChangeUserPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'change_userprofile'
      );
  }

  /**
   * Function that display Delete button in navbar when current User has the correct permission
   */
  onDeleteUserPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'delete_userprofile'
      );
  }

  /**
   * Function that redirects on the team details page
   * @param id the id of the team
   */
  onViewTeam(id: number) {
    this.router.navigate(['/teams', id]);
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

}
