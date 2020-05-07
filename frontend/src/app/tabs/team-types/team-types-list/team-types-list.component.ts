import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamTypeService } from 'src/app/services/team-types/team-type.service';
import { Subscription } from 'rxjs';
import { TeamType } from 'src/app/models/team-type';
import { Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-team-types-list',
  templateUrl: './team-types-list.component.html',
  styleUrls: ['./team-types-list.component.scss']
})

/**
 * Class for the component in charge of listing all team types
 */
export class TeamTypesListComponent implements OnInit, OnDestroy {
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;

  teamTypes: TeamType[] = [];
  teamTypesSubscription: Subscription;

  /**
   * Constructor for the TeamTypeListComponent
   * @param teamTypeService the service to communicate with backend on TeamType objects
   * @param router the service used to handle redirections
   */
  constructor(private teamTypeService: TeamTypeService,
              private router: Router,
              private modalService: NgbModal) { }

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
  openDelete(contentDelete, i: number) {
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
   * Function called when the component is destroyed
   */
  ngOnDestroy() {
    this.teamTypesSubscription.unsubscribe();
  }

}
