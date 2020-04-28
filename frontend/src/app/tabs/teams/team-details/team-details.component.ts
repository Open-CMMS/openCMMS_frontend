import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from 'src/app/services/teams/team.service';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons';
import { UserProfile } from 'src/app/models/user-profile';
import { TeamType } from 'src/app/models/team-type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;

  team: Team;
  teamUsers: UserProfile[] = [];
  teamType: TeamType;
  constructor(private router: Router,
              private teamService: TeamService,
              private route: ActivatedRoute,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    let id: number;
    this.route.params.subscribe(params => {
      id = +params.id;
    });
    this.teamService.getTeam(id).subscribe((teamGet: Team) => {
      console.log(teamGet);
      this.team = new Team(teamGet.id, teamGet.name, teamGet.team_type, teamGet.user_set);
    });
    // Init team type
    this.teamType = new TeamType();
    this.teamType.name = 'Admins';

    // Init team users
    this.team.user_set.forEach(userId => {
      this.teamUsers.push(new UserProfile());
    });
  }

  onDeleteTeam() {
    this.teamService.deleteTeam(this.team.id);
  }

  onModifyTeam() {

  }

  onViewUser(user: UserProfile) {
  }

  onRemoveUserFromTeam(user: UserProfile) {
  }

  openDelete(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteTeam();
        console.log('Supprimé');
      }
    });
  }

  openModify(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-modify'}).result.then((result) => {
      if (result === 'OK') {
        this.onModifyTeam();
        console.log('Modifié');
      }
    });
  }
}
