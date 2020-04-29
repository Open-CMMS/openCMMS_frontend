import { Component, OnInit, OnDestroy } from '@angular/core';
import { Team } from 'src/app/models/team';
import { Subscription } from 'rxjs';
import { TeamService } from 'src/app/services/teams/team.service';
import { Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit, OnDestroy {
  faTrash = faTrash;
  teams: Team[] = [];
  teamsSubscription: Subscription;

  constructor(private teamService: TeamService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.teamsSubscription = this.teamService.teamSubject.subscribe(
      (teams: Team[]) => {
        this.teams = teams;
      }
    );
    this.teamService.emitTeams();
  }

  onViewTeam(team: Team) {
    this.router.navigate(['/teams/', team.id]);
  }

  openDelete(content, team: Team) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteTeam(team);
      }
    });
  }

  onDeleteTeam(team: Team) {
    this.teamService.deleteTeam(team.id).subscribe(
      (resp) => {
        this.teamService.getTeams();
        this.router.navigate(['/teams']);
      }
    );
  }

  ngOnDestroy() {
    this.teamsSubscription.unsubscribe();
  }

}
