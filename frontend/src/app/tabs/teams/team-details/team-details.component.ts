import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from 'src/app/services/teams/team.service';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons';
import { UserProfile } from 'src/app/models/user-profile';
import { TeamType } from 'src/app/models/team-type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamTypeService } from 'src/app/services/team-types/team-type.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent implements OnInit {
  // Font awesome logos
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;

  // Local variables
  team: Team = null;
  teamUsers: UserProfile[] = [];
  teamType: TeamType;
  teamTypes: TeamType[];
  teamTypesSubscription: Subscription;
  updateError = false;
  users: UserProfile[] = [];
  loading = false;


  // Forms
  updateForm: FormGroup;
  addUserForm: FormGroup;

  constructor(private router: Router,
              private teamService: TeamService,
              private userService: UserService,
              private teamTypeService: TeamTypeService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    let id: number;
    this.route.params.subscribe(params => {
      id = +params.id;
    });
    this.teamService.getTeam(id)
                    .subscribe((teamGet: Team) => {
                      this.team = new Team(teamGet.id, teamGet.name, teamGet.team_type, teamGet.user_set);
                      // Init team type
                      this.teamTypeService.getTeamType(this.team.team_type)
                                          .subscribe(
                                            teamType => {
                                              this.teamType = teamType;
                                              this.initForm();
                                              this.loading = true;
                                            }
                                          );
                      this.team.user_set.forEach(userId => {
                        this.userService.getUser(userId).subscribe((user) => {
                          this.teamUsers.push(new UserProfile(user.id,
                                                              user.last_name,
                                                              user.first_name,
                                                              user.username,
                                                              user.email,
                                                              user.password,
                                                              user.nb_tries,
                                                              user.is_active));
                        });
                      });
                  },
                  (error) => {
                    this.router.navigate(['/four-oh-four']);
                  });
    this.teamTypesSubscription = this.teamTypeService.team_types_subject.subscribe(
      (teamTypes: TeamType[]) => {
        this.teamTypes = teamTypes;
      }
    );
  }

  onDeleteTeam() {
    this.teamService.deleteTeam(this.team.id).subscribe(
      (resp) => {
        this.teamService.getTeams();
        this.router.navigate(['/teams']);
      }
    );
  }

  onModifyTeam() {
    const formValues = this.updateForm.value;
    const tempTeam = JSON.parse(JSON.stringify(this.team));
    console.log(tempTeam);
    if (this.team.name !== formValues.teamName) {
      tempTeam.name = formValues.teamName;
    }
    if (this.teamType.id !== formValues.teamType) {
      tempTeam.team_type = formValues.teamType;
    }
    this.teamService.updateTeam(this.team.id, tempTeam). subscribe(teamUpdated => {
      this.team = teamUpdated;
      this.teamTypeService.getTeamType(this.team.team_type)
                                          .subscribe(
                                            teamType => {
                                              this.teamType = teamType;
                                              this.initForm();
                                            }
                                          );
      this.updateError = false;
    },
    (error) => {
      this.updateError = true;
    });
  }

  onViewUser(user: UserProfile) {
    this.router.navigate(['/users', user.id]);
  }

  onAddUser() {
    // To complete when userService is ready
  }

  onRemoveUserFromTeam(user: UserProfile) {
    // Remove user from user_set of the Team and update it
    this.teamService.updateTeam(this.team.id, this.team);
  }

  openDelete(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-delete'}).result.then((result) => {
      if (result === 'OK') {
        this.onDeleteTeam();
      }
    });
  }

  openModify(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-modify'}).result.then((result) => {
      if (result === 'OK') {
        this.onModifyTeam();
      }
    });
  }

  openAddUser(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-addUser'}).result.then((result) => {
      if (result === 'OK') {
        this.onAddUser();
      }
    });
  }

  initForm() {
    this.updateForm = this.formBuilder.group({
      teamName: '',
      teamType: ''
    });
    this.updateForm.setValue({
      teamName: this.team.name,
      teamType: this.teamType.id
    });

    this.addUserForm = this.formBuilder.group({
      users: ''
    });
  }
}
