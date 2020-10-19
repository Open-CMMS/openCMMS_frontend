import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
/**
 * Class for the component in charge of Teams list display
 */
export class TeamManagementComponent implements OnInit {
  // Local Variables
  faPlus = faPlus;

  /**
   * Constructor for the TeamManagement component
   * @param router the service used to handle redirection
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   */
  constructor(private router: Router,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
  }

  /**
   * Function that redirect to the new Team creation page
   */
  onCreateTeam() {
    this.router.navigate(['/new-team']);
  }

  /**
   * Function that display Create Team button in navbar when current User has the correct permission
   */
  onAddTeamPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'add_team'
      );
  }

}
