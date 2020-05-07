import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipment-management',
  templateUrl: './equipment-management.component.html',
  styleUrls: ['./equipment-management.component.scss']
})
export class EquipmentManagementComponent implements OnInit {
  /**
   * Constructor for the UserManagement component
   * @param router the service used to handle redirection
   */

  constructor(private router: Router) { }

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

}
