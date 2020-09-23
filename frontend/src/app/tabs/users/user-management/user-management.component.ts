import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})

/**
 * Class for the component in charge of User list display
 */
export class UserManagementComponent implements OnInit {
  // Local Variables
  faPlus = faPlus;


  /**
   * Constructor for the UserManagement component
   * @param router the service used to handle redirection
   * @param authenticationService the auth service
   * @param utilsService the service used for useful functions
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
   * Function that displays the Create button if user is allowed to do so
   */
  onAddUserPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'add_userprofile'
      );
  }

  /**
   * Function that redirect to the new Team creation page
   */
  onCreateUser() {
    this.router.navigate(['/new-user']);
  }

}
