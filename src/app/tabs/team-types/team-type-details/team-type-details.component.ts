import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamTypeService } from '../../../services/team-types/team-type.service';
import { TeamType } from '../../../models/team-type';
import { Permission } from '../../../models/permission';
import { PermissionService } from 'src/app/services/permissions/permission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TeamService } from 'src/app/services/teams/team.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { faInfoCircle, faPencilAlt, faTrash, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import {UrlService} from '../../../services/shared/url.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './team-type-details.component.html',
  styleUrls: ['./team-type-details.component.scss']
})
export class TeamTypeDetailsComponent implements OnInit {

  faInfoCircle = faInfoCircle;
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  faChevronLeft = faChevronLeft;

  // local variables
  id: number;
  name: string;
  perms: any[] = [];
  teams: any[] = [];
  previousUrl = '';

  all_permissions: Permission[] = [];

  team_type: TeamType;

  // variables for the dropdown selects in the modify form
  permsList = [];
  selectedPerms = [];
  dropdownPermsSettings: IDropdownSettings;

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
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   * @param urlService the service used to handle URL
   */
  constructor(private router: Router,
              private teamTypeService: TeamTypeService,
              private permissionService: PermissionService,
              private teamService: TeamService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService,
              private urlService: UrlService) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.urlService.previousUrl$.subscribe( (previousUrl: string) => {
      this.previousUrl = previousUrl;
    });
    this.initFields();
    this.permissionService.getPermissions().subscribe((permissions: Permission[]) => {
      this.all_permissions = permissions;
      this.initPermsSelect();
    });
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
      this.teams = team_type.team_set;
      this.perms = team_type.perms;
      this.initSelectedPerms();
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
   * Function that opens the modify modal for name
   * @param contentModify the content to put in the modal
   */
  openModifyName(contentModify) {
    this.modalService.open(contentModify, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then(
      (result) => {
        if (result === 'OK') {
          this.modifyTeamType('name');
        }
        this.modalService.dismissAll();
      }
    );
  }

  /**
   * Function that opens the modify modal
   * @param contentModify the content to put in the modal
   */
  openModifyPerms(contentModify) {
    this.modalService.open(contentModify, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then(
      (result) => {
        if (result === 'OK') {
          this.modifyTeamType('perms');
        }
        this.modalService.dismissAll();
      }
    );
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
   * Function that initialize the fields in the form to create a new TeamType
   */
  initForm() {
    this.teamTypeForm = this.formBuilder.group({
      name: ['', Validators.required],
      permissions: [''],
    });
  }

  /**
   * Function that submits the form to modify the teamType
   */
  modifyTeamType(modifiedField: string) {

    const teams = [];
    const permissions = [];

    for (const perm of this.selectedPerms) {
      permissions.push(perm.id);
    }

    for (const team of this.teams) {
      teams.push(team.id);
    }

    this.teamTypeService.updateTeamType(new TeamType(this.id, this.name, permissions, teams)).subscribe(
        (team_type) => {
          const old_team_type = this.teamTypeService.team_types.find((value) => {
            return value.id === team_type.id;
          });
          const index = this.teamTypeService.team_types.indexOf(old_team_type);
          this.teamTypeService.team_types[index] = team_type;

          this.teamTypeService.emitTeamTypes();
          this.teamService.getTeams(); // To avoid deleted team with no team type issue
          this.initFields();
        });
  }

  /**
   * Function that displays the Modify button if user is allowed to do so
   */
  onChangeTeamTypesPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'change_teamtype'
      );
  }

  /**
   * Function that displays the Delete button if user is allowed to do so
   */
  onDeleteTeamTypesPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'delete_teamtype'
      );
  }

  /**
   * Function to return to the listing page.
   */
  onPreviousPage() {
    this.router.navigate([this.previousUrl]);
  }

}
