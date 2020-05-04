import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

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
  onCreateUser() {
    this.router.navigate(['/new-user']);
  }

}
