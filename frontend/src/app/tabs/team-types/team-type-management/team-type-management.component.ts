import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-team-type-management',
  templateUrl: './team-type-management.component.html',
  styleUrls: ['./team-type-management.component.scss']
})
export class TeamTypeManagementComponent implements OnInit {

  faPlus = faPlus;

  /**
   * Constructor for the TeamTypeManagementComponent
   * @param router the service used to handle redirections
   * @param utilsService the service used for useful methods
   * @param authenticationService the authentication service
   */
  constructor(private router: Router,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  /**
   * Function that navigates to the create team type component
   */
  onCreateTeamType() {
    this.router.navigate(['/new-team-type']);
  }

  /**
   * Function that displays the creation button if user is allowed to do so
   */
  onAddTeamTypesPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'add_teamtype'
      );
  }


}
