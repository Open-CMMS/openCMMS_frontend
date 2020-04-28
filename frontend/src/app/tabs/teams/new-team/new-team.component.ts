import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/teams/team.service';
import { TeamTypeService } from 'src/app/services/team-types/team-type.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TeamType } from 'src/app/models/team-type';
import { UserProfile } from 'src/app/models/user-profile';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-new-team',
  templateUrl: './new-team.component.html',
  styleUrls: ['./new-team.component.scss']
})
export class NewTeamComponent implements OnInit {

  // Local variables
  users: UserProfile[];
  teamTypes: TeamType[];
  teamTypesSubscription: Subscription;
  creationError = false;
  // Forms
  createForm: FormGroup;

  constructor(private router: Router,
              private teamService: TeamService,
              private teamTypeService: TeamTypeService,
              private formBuilder: FormBuilder
              ) { }

  ngOnInit(): void {
    this.teamTypesSubscription = this.teamTypeService.team_types_subject.subscribe(
      (teamTypes: TeamType[]) => {
        this.teamTypes = teamTypes;
      }
    );
    this.initForm();
  }

  initForm() {
    this.createForm = this.formBuilder.group({
      teamName: ['', Validators.required],
      teamType: ['', Validators.required],
      users: ['']
    });
  }

  onCreateTeam() {
    const formValues = this.createForm.value;
    const newTeam = new Team(1, formValues.teamName, formValues.teamType, []);
    this.teamService.createTeam(newTeam).subscribe(
      (team: Team) => {
        this.router.navigate(['/teams']);
        this.teamService.getTeams();
      },
      (error) => {
        this.creationError = true;
      }
    );
  }

}
