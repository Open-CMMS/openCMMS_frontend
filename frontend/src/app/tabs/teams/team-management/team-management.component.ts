import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent implements OnInit {
  faPlus = faPlus;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onCreateTeam() {
    console.log('Coucou');
    this.router.navigate(['/new-team']);
  }

}
