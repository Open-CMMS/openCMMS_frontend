import { Component, OnInit, OnDestroy } from '@angular/core';
import { Team } from 'src/app/models/team';
import { Subscription } from 'rxjs';
import { TeamService } from 'src/app/services/teams/team.service';
import { Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit, OnDestroy {
  faTrash = faTrash;
  teams: Team[] = [];
  teamsSubscription: Subscription;

  constructor(private teamService: TeamService, private router: Router) { }

  ngOnInit(): void {
    this.teamsSubscription = this.teamService.teamSubject.subscribe(
      (teams: Team[]) => {
        this.teams = teams;
      }
    );
    this.teamService.emitTeams();
    console.log(this.teams);
  }

  onViewTeam(team: Team) {
    this.router.navigate(['/teams/', team.id]);
  }

  onDeleteTeam(i: number) {

  }

  ngOnDestroy() {
    this.teamsSubscription.unsubscribe();
  }

}
