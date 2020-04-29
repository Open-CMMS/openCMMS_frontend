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
/**
 * Class for the component in charge of new Team creations
 */
export class NewTeamComponent implements OnInit {

  // Local variables
  users: UserProfile[];
  teamTypes: TeamType[];
  teamTypesSubscription: Subscription;
  creationError = false;
  // Forms
  createForm: FormGroup;

  /**
   * Constructor for the NewTeamComponent
   * @param router the service used to handle redirections
   * @param teamService the service to communicate with backend on Team objects
   * @param teamTypeService the service to communicate with backend on TeamType objects
   * @param formBuilder the service to handle forms
   */
  constructor(private router: Router,
              private teamService: TeamService,
              private teamTypeService: TeamTypeService,
              private formBuilder: FormBuilder
              ) { }
  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.teamTypesSubscription = this.teamTypeService.team_types_subject.subscribe(
      (teamTypes: TeamType[]) => {
        this.teamTypes = teamTypes;
      }
    );
    this.initForm();
  }

  /**
   * Function that initialize the fields in the form to create a new Team
   */
  initForm() {
    this.createForm = this.formBuilder.group({
      teamName: ['', Validators.required],
      teamType: ['', Validators.required],
      users: ['']
    });
  }

  /**
   * Function that is triggered when a new Team is being created (when button "Create new team" is pressed)
   */
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
