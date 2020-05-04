import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-type-management',
  templateUrl: './team-type-management.component.html',
  styleUrls: ['./team-type-management.component.scss']
})
export class TeamTypeManagementComponent implements OnInit {

  faPlus = faPlus;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Function that navigates to the create team type component
   */
  onCreateTeamType() {
    this.router.navigate(['/new-team-type']);
  }


}
