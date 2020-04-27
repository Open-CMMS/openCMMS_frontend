import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/models/permission';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/services/permissions/permission.service';
import { TeamType } from 'src/app/models/team-type';
import { NgForm } from '@angular/forms';
import { TeamTypeService } from 'src/app/services/team-types/team-type.service';
import { Team } from 'src/app/models/team';
import { TeamService } from 'src/app/services/teams/team.service';

@Component({
  selector: 'app-new-team-type',
  templateUrl: './new-team-type.component.html',
  styleUrls: ['./new-team-type.component.scss']
})
export class NewTeamTypeComponent implements OnInit {

  permissions: Permission[] = [];
  permissionsSubscription: Subscription;
  teams: Team[] = [];
  newTeamType: TeamType;

  constructor(private teamTypeService: TeamTypeService,
              private permissionService: PermissionService,
              private teamService: TeamService,
              private router: Router) { }

  ngOnInit(): void {
    // this.permissionsSubscription = this.permissionService.permissionsSubject.subscribe(
    //   (permissions: Permission[]) => {
    //     this.permissions = permissions;
    //   }
    // );
    // this.teamService.getTeams().subscribe((teams: Team[]) => {
    //   this.teams = teams;
    // });
    // this.permissionService.emitPermissions();
  }

  onSubmit(form: NgForm) {
    const nameStr = 'name';
    const permissionsStr = 'permissions';
    const teamsStr = 'teams';

    const name = form.value[nameStr];
    const permissions = form.value[permissionsStr];
    const teams = form.value[teamsStr];
    this.teamTypeService.createTeamType(new TeamType(name, permissions, teams));
  }

}
