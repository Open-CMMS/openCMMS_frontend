import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

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
  onCreateTeam() {
    this.router.navigate(['/new-team']);
  }

}
