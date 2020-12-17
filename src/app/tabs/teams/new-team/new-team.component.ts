import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamService } from 'src/app/services/teams/team.service';
import { TeamTypeService } from 'src/app/services/team-types/team-type.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TeamType } from 'src/app/models/team-type';
import { UserProfile } from 'src/app/models/user-profile';
import { Team } from 'src/app/models/team';
import { UserService } from 'src/app/services/users/user.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-new-team',
  templateUrl: './new-team.component.html',
  styleUrls: ['./new-team.component.scss']
})
/**
 * Class for the component in charge of new Team creations
 */
export class NewTeamComponent implements OnInit, OnDestroy {

  // Local variables
  users: UserProfile[];
  teamTypes: TeamType[];
  teamTypesSubscription: Subscription;
  usersSubscription: Subscription;
  creationError = false;

  // Multiple Select
  usersList = [];
  dropdownUsersSettings: IDropdownSettings;

  // Forms
  createForm: FormGroup;


  /**
   * Constructor for the NewTeamComponent
   * @param router the service used to handle redirections
   * @param teamService the service to communicate with backend on Team objects
   * @param teamTypeService the service to communicate with backend on TeamType objects
   * @param formBuilder the service to handle forms
   * @param userService the to communicate with backend on User objects
   */
  constructor(private router: Router,
              private teamService: TeamService,
              private teamTypeService: TeamTypeService,
              private userService: UserService,
              private formBuilder: FormBuilder
              ) { }
  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.teamTypesSubscription = this.teamTypeService.team_types_subject.subscribe(
      (teamTypes: TeamType[]) => {
        this.teamTypes = teamTypes;
      }
    );
    this.teamTypeService.emitTeamTypes();
    this.usersSubscription = this.userService.usersSubject.subscribe(
      (users: UserProfile[]) => {
        this.users = users;
        this.initUsersSelect();
      }
    );
    this.userService.getUsers();
    this.userService.emitUsers();
    this.initForm();
  }

  /**
   * Function that initialize the multiselect for Users
   */
  initUsersSelect() {
    this.usersList = [];
    this.users.forEach(user => {
      this.usersList.push({id: user.id.toString(), value: user.username});
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
   * Function that initialize the fields in the form to create a new Team
   */
  initForm() {
    this.createForm = this.formBuilder.group({
      teamName: ['', [Validators.required, this.noWhiteSpaceValidator]],
      teamType: ['', Validators.required],
      users: ['']
    });
  }

  /**
   * Function that is triggered when a new Team is being created (when button "Create new team" is pressed)
   */
  onCreateTeam() {
    const formValues = this.createForm.value;
    const usersToAdd = [];
    const usersArray: Array<any> = formValues.users;
    Object.values(usersArray).forEach(item => {
      usersToAdd.push(item.id);
    });
    const newTeam = new Team(1, formValues.teamName, formValues.teamType, usersToAdd);
    this.teamService.createTeam(newTeam).subscribe(
      (res) => {
        if (res.data) {
          this.router.navigate(['/teams']);
          this.teamService.getTeams();
        } else {
          if (res.error) {
            this.creationError = true;
          }
        }

      },
    );

  }

  public noWhiteSpaceValidator(control: FormControl) {
    const isWhiteSpace = (control.value || '').trim().length === 0;
    const isValid = !isWhiteSpace;
    return isValid ? null : {whitespace: true};
  }

  /**
   * Function that clears subscriptions
   */
  ngOnDestroy(): void {
    this.teamTypesSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }

}
