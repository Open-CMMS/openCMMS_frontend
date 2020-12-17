import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/models/permission';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/services/permissions/permission.service';
import { TeamType } from 'src/app/models/team-type';
import {NgForm, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { TeamTypeService } from 'src/app/services/team-types/team-type.service';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/teams/team.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-new-team-type',
  templateUrl: './new-team-type.component.html',
  styleUrls: ['./new-team-type.component.scss']
})

/**
 * Class for the component in charge of new TeamType creations
 */

export class NewTeamTypeComponent implements OnInit {

  // Local variables
  permissions: Permission[] = [];
  permissionsSubscription: Subscription;
  teams: Team[] = [];
  newTeamType: TeamType;

  // variables for the dropdown selects
  permsList = [];
  teamsList = [];
  dropdownPermsSettings: IDropdownSettings;
  dropdownTeamsSettings: IDropdownSettings;

  // Forms :
  teamTypeForm: FormGroup;

  /**
   * Constructor for the NewTeamComponent
   * @param teamService the service to communicate with backend on Team objects
   * @param permissionService the service to communicate with backend on Permission objects
   * @param teamTypeService the service to communicate with backend on TeamType objects
   * @param router the service used to handle redirections
   * @param formBuilder the service to handle forms
   */

  constructor(private teamTypeService: TeamTypeService,
              private permissionService: PermissionService,
              private teamService: TeamService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.permissionService.getPermissions().subscribe((permissions: Permission[]) => {
        this.permissions = permissions;
        this.initPermsSelect();
      }
    );
    this.teamService.teamSubject.subscribe((teams: Team[]) => {
      this.teams = teams;
      this.initTeamsSelect();
    });
    this.teamService.emitTeams();
    this.initForm();
  }

  /**
   * Function that initialize the dropdown select for permissions
   */
  initPermsSelect() {
    this.permsList = [];
    this.permissions.forEach(perm => {
      this.permsList.push({id: perm.id.toString(), value: perm.name.toString()});
    });
    this.dropdownPermsSettings = {
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
   * Function that initialize the dropdown select for teams
   */
  initTeamsSelect() {
    this.teamsList = [];
    this.teams.forEach(team => {
      this.teamsList.push({id: team.id.toString(), value: team.name.toString()});
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
   * Function that initialize the fields in the form to create a new TeamType
   */
  initForm() {
    this.teamTypeForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhiteSpaceValidator]],
      permissions: [''],
      teams: ['']
    });
  }

  public noWhiteSpaceValidator(control: FormControl) {
    const isWhiteSpace = (control.value || '').trim().length === 0;
    const isValid = !isWhiteSpace;
    return isValid ? null : {whitespace: true};
  }

  /**
   * Function that submits the form to create a new team type
   */
  onSubmit() {
    const formValue = this.teamTypeForm.value;

    const nameStr = 'name';
    const permissionsStr = 'permissions';
    const teamsStr = 'teams';

    const id = 0;
    const name = formValue[nameStr];
    const permissions = [];
    if (formValue[permissionsStr]) {
      formValue[permissionsStr].forEach(item => {
        permissions.push(item.id);
      });
    }
    const teams = [];
    if (formValue[teamsStr]) {
      formValue[teamsStr].forEach(item => {
        teams.push(item.id);
      });
    }
    this.teamTypeService.createTeamType(new TeamType(id, name, permissions, teams)).subscribe(
      team_type => {
        this.teamTypeService.team_types.push(team_type);
        this.teamTypeService.emitTeamTypes();
        this.teamTypeForm.reset();
        this.router.navigate(['/team-types']);
      });
  }

}
