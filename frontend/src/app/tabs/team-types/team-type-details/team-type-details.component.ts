import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamTypeService } from '../../../services/team-types/team-type.service';
import { TeamType } from '../../../models/team-type';
import { Permission } from '../../../models/permission';
import { Team } from '../../../models/team';
import { PermissionService } from 'src/app/services/permissions/permission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  templateUrl: './team-type-details.component.html',
  styleUrls: ['./team-type-details.component.scss']
})
export class TeamTypeDetailsComponent implements OnInit {

  id: number;
  name: string;
  perms: Permission[];
  teams: Team[];

  team_type: TeamType;

  constructor(private router: Router,
              private teamTypeService: TeamTypeService,
              private permissionService: PermissionService,
              private route: ActivatedRoute,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params.id;
    });
    this.teamTypeService.getTeamType(this.id).subscribe((team_type: TeamType) => {
      this.name = team_type.name;
      console.log(team_type);
      this.perms = Array();
      team_type.perms.forEach((id) => {
        this.permissionService.getPermission(id).subscribe((perm: Permission) => {
          this.perms.push(perm);
        });
      });
    });
    // team_type.teams.forEach((id) => {
    //   this.teams.push(new Team(id));
    // });
  }

  openModify(contentModify) {
    this.modalService.open(contentModify, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  openDelete(truc) {

  }

  onViewPerm(perm) {

  }

}
