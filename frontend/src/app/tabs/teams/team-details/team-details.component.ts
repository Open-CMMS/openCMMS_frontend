import { Component, OnInit, OnDestroy } from '@angular/core';
import { Team } from 'src/app/models/team';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from 'src/app/services/teams/team.service';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons';
import { UserProfile } from 'src/app/models/user-profile';
import { TeamType } from 'src/app/models/team-type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamTypeService } from 'src/app/services/team-types/team-type.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/users/user.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
/**
 * Class for the component in charge of Team details display
 */
export class TeamDetailsComponent implements OnInit, OnDestroy {
  // Font awesome logos
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;

  // Local variables
  team: Team = null;
  teamUsers: UserProfile[] = [];
  teamType: TeamType;
  teamTypes: TeamType[];
  teamTypesSubscription: Subscription;
  updateError = false;
  users: UserProfile[] = [];
  loading = false;
  usersList = [];
  usersSubscription: Subscription;

  // Forms
  updateForm: FormGroup;
  addUserForm: FormGroup;
  dropdownUsersSettings: IDropdownSettings;

  /**
   * Constructor for component TeamDetailsComponent
   * @param router the service used to handle redirections
   * @param teamService the service to communicate with backend on Team objects
   * @param teamTypeService the service to communicate with backend on TeamType objects
   * @param route the service used to analyse the current URL
   * @param formBuilder the service to handle forms
   * @param modalService the service used to handle modal windows
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   * @param userService the service to communicate with backend on User objects
   */
  constructor(private router: Router,
              private teamService: TeamService,
              private userService: UserService,
              private teamTypeService: TeamTypeService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    let id: number;
    this.route.params.subscribe(params => {
      id = +params.id;
    });
    this.teamService.getTeam(id)
                    .subscribe((teamGet: Team) => {
                      this.team = new Team(teamGet.id, teamGet.name, teamGet.team_type, teamGet.user_set);
                      // Init team type
                      // Nb: the team type is required
                      this.teamTypeService.getTeamType(this.team.team_type)
                                          .subscribe(
                                            teamType => {
                                              this.teamType = teamType;
                                              this.initForm();
                                              this.loading = true;
                                            }
                                          );
                      this.teamUsers = [];
                      this.team.user_set.forEach(userId => {
                        this.userService.getUser(userId).subscribe((user) => {
                          this.teamUsers.push(new UserProfile(user.id,
                                                              user.username,
                                                              user.first_name,
                                                              user.last_name,
                                                              user.email,
                                                              user.password,
                                                              user.nb_tries,
                                                              user.is_active));
                        });
                      });
                  },
                  (error) => {
                    this.router.navigate(['/four-oh-four']);
                  });

    // Loading team types and users for teams modification
    this.teamTypesSubscription = this.teamTypeService.team_types_subject.subscribe(
      (teamTypes: TeamType[]) => {
        this.teamTypes = teamTypes;
      }
      );
    this.teamTypeService.emitTeamTypes();
    this.usersSubscription = this.userService.usersSubject.subscribe(
        (users: any) => {
          users.forEach(
            (user) => {
              this.users.push(new UserProfile(user.id,
                user.username,
                user.first_name,
                user.last_name,
                user.email,
                user.password,
                user.nb_tries,
                user.is_active));
              });
            });
    this.userService.emitUsers();
  }

  /**
   * Function that initialize the multiselect for Users
   */
  initUsersSelect() {
    this.usersList = [];
    let found = false;
    this.users.forEach(user => {
          found = false;
          this.teamUsers.forEach(
          (teamUser) => {
            if (user.id === teamUser.id) {
              found = true;
            }
          }
          );
          if (!found) {
            this.usersList.push({id: user.id.toString(), value: user.username});
          }
    });
    this.dropdownUsersSettings = {
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
   * Function that is triggered when validating the modal of deletion
   */
  onDeleteTeam() {
    this.teamService.deleteTeam(this.team.id).subscribe(
      (resp) => {
        this.teamService.getTeams();
        this.router.navigate(['/teams']);
      }
    );
  }

  /**
   * Function that is triggered when validating the modal of modification
   */
  onModifyTeam() {
    const formValues = this.updateForm.value;
    const tempTeam = JSON.parse(JSON.stringify(this.team));
    if (this.team.name !== formValues.teamName) {
      tempTeam.name = formValues.teamName;
    }
    if (this.teamType.id !== formValues.teamType) {
      tempTeam.team_type = formValues.teamType;
    }
    this.teamService.updateTeam(this.team.id, tempTeam).subscribe(teamUpdated => {
      this.team = teamUpdated;
      this.teamTypeService.getTeamType(this.team.team_type)
                                          .subscribe(
                                            teamType => {
                                              this.teamType = teamType;
                                              this.initForm();
                                            }
                                          );
      this.teamService.getTeams();
      this.updateError = false;
    },
    (error) => {
      this.updateError = true;
    });
  }

  /**
   * Function that redirect to the user details view when clicking on a user
   * @param user the user requested
   */
  onViewUser(user: UserProfile) {
    this.router.navigate(['/users', user.id]);
  }

  /**
   * Function that add a user in a team
   */
  onAddUser() {
    const formValues = this.addUserForm.value;
    const usersToAdd = [];
    formValues.users.forEach(item => {
      usersToAdd.push(item.id);
    });
    const tempTeam = JSON.parse(JSON.stringify(this.team));
    usersToAdd.forEach(item => {
      tempTeam.user_set.push(item);
    });
    this.teamService.updateTeam(this.team.id, tempTeam).subscribe(teamUpdated => {
      this.team = teamUpdated;
      this.teamTypeService.getTeamType(this.team.team_type)
                                          .subscribe(
                                            teamType => {
                                              this.teamType = teamType;
                                              this.ngOnInit();
                                              this.initForm();
                                            }
                                          );
      this.updateError = false;
      this.teamService.getTeams();
    },
    (error) => {
      this.updateError = true;
    });
  }

  /**
   * Function that remove a user from a team
   * @param user the user to remove
   */
  onRemoveUserFromTeam(user: UserProfile) {
    const tempTeam = JSON.parse(JSON.stringify(this.team));
    const index = tempTeam.user_set.indexOf(user.id);
    tempTeam.user_set.splice(index, 1);
    this.teamService.updateTeam(this.team.id, tempTeam).subscribe(teamUpdated => {
      this.team = teamUpdated;
      this.teamTypeService.getTeamType(this.team.team_type)
                                          .subscribe(
                                            teamType => {
                                              this.teamType = teamType;
                                              this.ngOnInit();
                                              this.initForm();
                                            }
                                            );
      this.updateError = false;
      this.teamService.getTeams();
    },
    (error) => {
      this.updateError = true;
    });
  }

  /**
   * Function that is triggered to load the modal template for deletion
   * @param content the modal to open
   */
  openDelete(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteTeam();
      }
    },
    (error) => {});
  }

  /**
   * Function that is triggered to load the modal template for modification
   * @param content the modal to open
   */
  openModify(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-modify'}).result.then((result) => {
      if (result === 'OK') {
        this.onModifyTeam();
      }
    },
    (error) => {});
  }

  /**
   * Function that is triggered to load the modal template for user addition
   * @param content the modal to open
   */
  openAddUser(content) {
    this.initUsersSelect();
    this.modalService.open(content, {ariaLabelledBy: 'modal-addUser'}).result.then((result) => {
      if (result === 'OK') {
        this.onAddUser();
      }
    },
    (error) => {});
  }

  /**
   * Function that initializes the different forms used in the component
   */
  initForm() {
    this.updateForm = this.formBuilder.group({
      teamName: '',
      teamType: ''
    });
    this.updateForm.setValue({
      teamName: this.team.name,
      teamType: this.teamType.id
    });

    this.addUserForm = this.formBuilder.group({
      users: ''
    });
  }

  /**
   * Function that display the delete button on Teams considering user permissions
   */
  onDeleteTeamPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'delete_team'
      );
  }

  /**
   * Function that display the modify button on Teams considering user permissions
   */
  onChangeTeamPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'change_team'
      );
  }

  ngOnDestroy(): void {
    this.teamTypesSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }
}
