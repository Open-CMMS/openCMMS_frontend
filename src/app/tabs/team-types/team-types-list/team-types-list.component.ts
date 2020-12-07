import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamTypeService } from 'src/app/services/team-types/team-type.service';
import { Subscription } from 'rxjs';
import { TeamType } from 'src/app/models/team-type';
import { Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
@Component({
  selector: 'app-team-types-list',
  templateUrl: './team-types-list.component.html',
  styleUrls: ['./team-types-list.component.scss']
})

/**
 * Class for the component in charge of listing all team types
 */
export class TeamTypesListComponent implements OnInit, OnDestroy {
  // Local variables
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  teamTypes: TeamType[] = [];
  teamTypesSubscription: Subscription;
  modalTeamTypeName = '';

  /**
   * Constructor for the TeamTypeListComponent
   * @param teamTypeService the service to communicate with backend on TeamType objects
   * @param router the service used to handle redirections
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   */
  constructor(private teamTypeService: TeamTypeService,
              private router: Router,
              private modalService: NgbModal,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService) { }

  /**
   * Function that initializes the component when loaded
   */
  ngOnInit(): void {
    this.teamTypesSubscription = this.teamTypeService.team_types_subject.subscribe(
      (teamTypes: TeamType[]) => {
        this.teamTypes = teamTypes;
      }
    );
    this.teamTypeService.emitTeamTypes();
  }

  /**
   * Function that navigates to the TeamTypeDetailComponent
   * @param i the index of the teamType in the list
   */
  onViewTeamType(i: number) {
    const team_type_id = this.teamTypes[i].id;
    this.router.navigate(['/team-types', team_type_id]);
  }

  /**
   * Function that opens the delete modal
   * @param contentDelete the content to put in the modal
   * @param i the index of the teamtype to delete
   */
  openDelete(contentDelete, teamType, i) {
    this.modalTeamTypeName = teamType.name;
    this.modalService.open(contentDelete, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteTeamType(i);
      }
    });
  }

  /**
   * Function that navigates to delete a TeamType
   * @param i the index of the teamType in the list
   */
  onDeleteTeamType(i: number) {
    const team_type_id = this.teamTypes[i].id;
    this.teamTypeService.deleteTeamType(team_type_id);
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
   * Function called when the component is destroyed
   */
  ngOnDestroy() {
    this.teamTypesSubscription.unsubscribe();
  }

}
