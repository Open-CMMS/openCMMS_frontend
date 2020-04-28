import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from 'src/app/services/teams/team.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent implements OnInit {

  team: Team;
  constructor(private router: Router, private teamService: TeamService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id: number;
    this.route.params.subscribe(params => {
      id = +params.id;
    });
    this.teamService.getTeam(id).subscribe((teamGet: Team) => {
      console.log(teamGet);
      this.team = new Team(teamGet.id, teamGet.name, teamGet.team_type);
    });
  }

}
