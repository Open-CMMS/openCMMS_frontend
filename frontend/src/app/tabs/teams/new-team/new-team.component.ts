import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/teams/team.service';
import { TeamTypeService } from 'src/app/services/team-types/team-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class NewTeamComponent implements OnInit {

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
    this.usersSubscription = this.userService.usersSubject.subscribe(
      (users: UserProfile[]) => {
        this.users = users;
        this.initUsersSelect();
      }
    );
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
      teamName: ['', Validators.required],
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
    formValues.users.forEach(item => {
      usersToAdd.push(item.id);
    });
    const newTeam = new Team(1, formValues.teamName, formValues.teamType, usersToAdd);
    this.teamService.createTeam(newTeam).subscribe(
      (team: Team) => {
        this.router.navigate(['/teams']);
        this.teamService.getTeams();
      },
      (error) => {
        this.creationError = true;
      }
    );
  }

}
