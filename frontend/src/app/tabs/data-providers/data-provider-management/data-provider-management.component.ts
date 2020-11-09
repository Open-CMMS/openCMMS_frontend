import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {Router} from "@angular/router";
import {UtilsService} from "../../../services/utils/utils.service";
import {AuthenticationService} from "../../../services/auth/authentication.service";

@Component({
  selector: 'app-data-provider-management',
  templateUrl: './data-provider-management.component.html',
  styleUrls: ['./data-provider-management.component.scss']
})
export class DataProviderManagementComponent implements OnInit {

  faPlus = faPlus;

  constructor(private router: Router,
              private utilsService: UtilsService,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  onCreateDataProvider() {
    this.router.navigate(['/new-data-provider']);
  }

  /**
   * Function that display Create button when having permission
   */
  onAddEquipmentTypePermission() {
    return this.utilsService.isAUserPermission(
      this.authenticationService.getCurrentUserPermissions(),
      'add_dataprovider'
    );
  }

}
