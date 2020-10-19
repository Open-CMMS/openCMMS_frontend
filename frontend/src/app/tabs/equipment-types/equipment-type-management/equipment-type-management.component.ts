import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-equipment-type-management',
  templateUrl: './equipment-type-management.component.html',
  styleUrls: ['./equipment-type-management.component.scss']
})
export class EquipmentTypeManagementComponent implements OnInit {

  faPlus = faPlus;

  /**
   * Constructor of EquipmentTypeManagementComponent
   * @param router the service used to handle routing
   * @param utilsService the service used for useful functions
   * @param authenticationService the authy service
   */
  constructor(private router: Router,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  /**
   * Function that navigates to the create equipment type component
   */
  onCreateEquipmentType() {
    this.router.navigate(['/new-equipment-type']);
  }

  /**
   * Function that display Create button when having permission
   */
  onAddEquipmentTypePermission() {
    return this.utilsService.isAUserPermission(
        this.authenticationService.getCurrentUserPermissions(),
        'add_equipmenttype'
        );
  }

}
