import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private utilsService: UtilsService) { }

  ngOnInit(): void {

  }

  /**
   * Function that display User button in navbar when current User has the correct permission
   */
  onViewUserPermission() {
    if (this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'view_userprofile'
        )) {
          return true;
      } else {
        return false;
      }
  }
  
  /**
   * Function that display Equipment button in navbar when current User has the correct permission
   */
  onViewEquipmentPermission() {
    if (this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'view_equipment'
        )) {
          return true;
      } else {
        return false;
      }
  }

  /**
   * Function that display Teams button in navbar when current User has the correct permission
   */
  onViewTeamsPermission() {
    if (this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'view_team'
        )) {
          return true;
      } else {
        return false;
      }
  }

  /**
   * Function that display TeamTypes button in navbar when current User has the correct permission
   */
  onViewTeamTypesPermission() {
    if (this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'view_teamtype'
        )) {
          return true;
      } else {
        return false;
      }
  }

  /**
   * Function that display TaskManagement button in navbar when current User has the correct permission
   */
  onViewTasksPermission() {
    if (this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'view_task'
        )) {
          return true;
      } else {
        return false;
      }
  }

  /**
   * Function that display App settings button in navbar when current User has the correct permission
   */
  onAddUserPermission() {
    if (this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'add_userprofile'
      )) {
        return true;
    } else {
      return false;
    }
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

}
