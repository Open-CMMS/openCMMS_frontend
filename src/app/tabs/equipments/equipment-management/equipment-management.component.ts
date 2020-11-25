import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-equipment-management',
  templateUrl: './equipment-management.component.html',
  styleUrls: ['./equipment-management.component.scss']
})
export class EquipmentManagementComponent implements OnInit {
  faPlus = faPlus;
  /**
   * Constructor for the UserManagement component
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
  onCreateEquipment() {
    this.router.navigate(['/new-equipment']);
  }

  /**
   * Function that display Create button when having permission
   */
  onAddEquipmentPermission() {
    return this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'add_equipment'
        );
  }

}
