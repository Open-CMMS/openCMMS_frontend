import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamTypeService } from '../../../services/team-types/team-type.service';
import { TeamType } from '../../../models/team-type';
import { Permission } from '../../../models/permission';
import { Team } from '../../../models/team';
import { PermissionService } from 'src/app/services/permissions/permission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TeamService } from 'src/app/services/teams/team.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-details',
  templateUrl: './team-type-details.component.html',
  styleUrls: ['./team-type-details.component.scss']
})
export class TeamTypeDetailsComponent implements OnInit {

  faInfoCircle = faInfoCircle;

  // local vaiables
  id: number;
  name: string;
  perms: Permission[];
  teams: Team[];

  all_permissions: Permission[] = [];
  all_teams: Team[] = [];

  team_type: TeamType;

  // variables for the dropdown selects in the modify form
  permsList = [];
  teamsList = [];
  selectedPerms = [];
  selectedTeams = [];
  dropdownPermsSettings: IDropdownSettings;
  dropdownTeamsSettings: IDropdownSettings;


  // the Forms
  teamTypeForm: FormGroup;

  /**
   * Constructor for the NewTeamComponent
   * @param router the service used to handle redirections
   * @param teamTypeService the service to communicate with backend on TeamType objects
   * @param permissionService the service to communicate with backend on Permission objects
   * @param teamService the service to communicate with backend on Team objects
   * @param route the service to get the id of the teamType in the url
   * @param modalService the service to create popups
   * @param formBuilder the service to handle forms
   */
  constructor(private router: Router,
              private teamTypeService: TeamTypeService,
              private permissionService: PermissionService,
              private teamService: TeamService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private formBuilder: FormBuilder) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.initFields();
    this.permissionService.getPermissions().subscribe((permissions: Permission[]) => {
      this.all_permissions = permissions;
      this.initPermsSelect();
    });
    this.teamService.teamSubject.subscribe((teams: Team[]) => {
      this.all_teams = teams;
      this.initTeamsSelect();
    });
    this.teamService.emitTeams();
    this.initForm();
  }

  /**
   * Function that initialize the team type fields when the component is loaded
   */
  initFields() {
    this.route.params.subscribe(params => {
      this.id = +params.id;
    });
    this.teamTypeService.getTeamType(this.id).subscribe((team_type: TeamType) => {
      this.name = team_type.name;
      this.teams = Array();
      team_type.team_set.forEach((id) => {
        this.teamService.getTeam(id).subscribe((team: Team) => {
          this.teams.push(team);
          this.initSelectedTeams();
        });
      });
      this.perms = Array();
      team_type.perms.forEach((id) => {
        this.permissionService.getPermission(id).subscribe((perm: Permission) => {
          this.perms.push(perm);
          this.initSelectedPerms();
        });
      });
    });
  }

  /**
   * Function that navigates to the TeamDetailComponent
   * @param team the team to navigate to
   */
  onViewTeam(team) {
    this.router.navigate(['/teams', team.id]);
  }

  /**
   * Function that opens the modify modal
   * @param contentModify the content to put in the modal
   */
  openModify(contentModify) {
    this.modalService.open(contentModify, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  /**
   * Function that opens the delete modal
   * @param contentDelete the content to put in the modal
   */
  openDelete(contentDelete) {
    this.modalService.open(contentDelete, {ariaLabelledBy: 'modal-basic-title'});
  }

  /**
   * Function that deletes the teamType and navigates back to the TeamTypeListComponent
   */
  onDelete() {
    this.teamTypeService.deleteTeamType(this.id);
    this.router.navigate(['/team-types']);
    this.modalService.dismissAll();
  }

  /**
   * Function that initialize the dropdown select for permissions
   */
  initPermsSelect() {
    this.permsList = [];
    this.all_permissions.forEach(perm => {
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
   * Function that initialize the selected permissions in the select
   */
  initSelectedPerms() {
    this.selectedPerms = [];
    this.perms.forEach(perm => {
      this.selectedPerms.push({id: perm.id.toString(), value: perm.name.toString()});
    });
  }

  /**
   * Function that initialize the dropdown select for teams
   */
  initTeamsSelect() {
    this.teamsList = [];
    this.all_teams.forEach(team => {
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
   * Function that initialize the selected teams in the select
   */
  initSelectedTeams() {
    this.selectedTeams = [];
    this.teams.forEach(team => {
      this.selectedTeams.push({id: team.id.toString(), value: team.name.toString()});
    });
  }

  /**
   * Function that initialize the fields in the form to create a new TeamType
   */
  initForm() {
    this.teamTypeForm = this.formBuilder.group({
      name: ['', Validators.required],
      permissions: ['', Validators.required],
      teams: ['', Validators.required]
    });
  }

  /**
   * Function that submits the form to modify the teamType
   */
  modifyTeamType() {
    const formValue = this.teamTypeForm.value;

    const nameStr = 'name';
    const permissionsStr = 'permissions';
    const teamsStr = 'teams';

    const id = this.id;
    const name = formValue[nameStr];
    const permissions = [];
    formValue[permissionsStr].forEach(item => {
      permissions.push(item.id);
    });
    const teams = [];
    formValue[teamsStr].forEach(item => {
      teams.push(item.id);
    });
    this.teamTypeService.updateTeamType(new TeamType(id, name, permissions, teams)).subscribe(
        team_type => {
          const old_team_type = this.teamTypeService.team_types.find((value) => {
            return value.id === team_type.id;
          });
          const index = this.teamTypeService.team_types.indexOf(old_team_type);
          this.teamTypeService.team_types[index] = team_type;

          this.teamTypeService.emitTeamTypes();

          this.initFields();
        });
    this.modalService.dismissAll();
  }

}
