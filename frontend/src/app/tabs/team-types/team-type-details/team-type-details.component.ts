import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamTypeService } from '../../../services/team-types/team-type.service';
import { TeamType } from '../../../models/team-type';
import { Permission } from '../../../models/permission';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-user-details',
  templateUrl: './team-type-details.component.html',
  styleUrls: ['./team-type-details.component.scss']
})
export class TeamTypeDetailsComponent implements OnInit {

  id: number;
  name: string;
  permissions: Permission[];
  teams: Team[];

  team_type: TeamType;

  constructor(private router: Router, private teamTypeService: TeamTypeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params.id;
    });
    this.teamTypeService.getTeamType(this.id).subscribe((team_type: any) => {
      this.name = team_type.name;
    });
    // team_type.permissions.forEach((id) => {
    //   this.permissions.push(new Permission(id));
    // });
    // team_type.teams.forEach((id) => {
    //   this.teams.push(new Team(id));
    // });
  }

}
