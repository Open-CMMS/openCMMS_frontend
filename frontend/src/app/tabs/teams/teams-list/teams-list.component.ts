import { Component, OnInit, OnDestroy } from '@angular/core';
import { Team } from 'src/app/models/team';
import { Subscription } from 'rxjs';
import { TeamService } from 'src/app/services/teams/team.service';
import { Router } from '@angular/router';
import { faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
/**
 * Class for the component in charge of Team list display
 */
export class TeamsListComponent implements OnInit, OnDestroy {
  // Local Variables
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  teams: Team[] = [];
  teamsSubscription: Subscription;

  /**
   * Constructor for the TeamList component
   * @param teamService the service to communicate with backend on Team objects
   * @param router the service used to handle redirections
   * @param modalService the service to handle modal windows
   */
  constructor(private teamService: TeamService, private router: Router, private modalService: NgbModal) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.teamsSubscription = this.teamService.teamSubject.subscribe(
      (teams: Team[]) => {
        this.teams = teams;
      }
    );
    this.teamService.emitTeams();
  }

  /**
   * Function that redirect to a precide Team details page
   * @param team The team to display
   */
  onViewTeam(team: Team) {
    this.router.navigate(['/teams/', team.id]);
  }

  /**
   * Function that opens the modal to confirm a deletion
   * @param content the modal template to load
   * @param team the team concerned by the deletion
   */
  openDelete(content, team: Team) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteTeam(team);
      }
    });
  }

  /**
   * Function to delete a team
   * @param team the team to delete
   */
  onDeleteTeam(team: Team) {
    this.teamService.deleteTeam(team.id).subscribe(
      (resp) => {
        this.teamService.getTeams();
        this.router.navigate(['/teams']);
      }
    );
  }

  /**
   * Function called at the destruction of the component
   */
  ngOnDestroy() {
    this.teamsSubscription.unsubscribe();
  }

}
