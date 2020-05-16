import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { UserProfile } from 'src/app/models/user-profile';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // Local Variables
  currentUser: UserProfile;
  currentUserSubscription: Subscription;
  loaded = false;

  /**
   * Constructor for the Navbar component
   * @param authenticationService the authentication service
   * @param router the service used for redirections
   * @param utilsService the service used for useful fonctions
   */
  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.authenticationService.currentUserSubject.subscribe(
      (user) => {
        this.currentUser = user;
        this.loaded = true;
      }
    );
    this.authenticationService.emitCurrentUser();
  }

  /**
   * Function that display User button in navbar when current User has the correct permission
   */
  onViewUserPermission() {
    return this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'view_userprofile'
        );
  }

  /**
   * Function that display Equipment button in navbar when current User has the correct permission
   */
  onChangeEquipmentPermission() {
    return this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'change_equipment'
        );
  }

  /**
   * Function that display Teams button in navbar when current User has the correct permission
   */
  onChangeTeamsPermission() {
    return this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'change_team'
        );
  }

  /**
   * Function that display TeamTypes button in navbar when current User has the correct permission
   */
  onChangeTeamTypesPermission() {
    return this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'change_teamtype'
        );
  }

  /**
   * Function that display TaskManagement button in navbar when current User has the correct permission
   */
  onChangeTasksPermission() {
    return this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'change_task'
        );
  }

  /**
   * Function that display App settings button in navbar when current User has the correct permission
   */
  onAddUserPermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'add_userprofile'
      );
  }

  /**
   * Function that calls the logout function in authenticationService to log out the current user
   */
  onLogout() {
    this.authenticationService.logout().then(
      (res) => {
        this.router.navigate(['sign-in']);
      }
    );
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

}
