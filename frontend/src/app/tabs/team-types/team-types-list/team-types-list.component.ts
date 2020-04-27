import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamTypeService } from 'src/app/services/team-types/team-type.service';
import { Subscription } from 'rxjs';
import { TeamType } from 'src/app/models/team-type';
import { Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-team-types-list',
  templateUrl: './team-types-list.component.html',
  styleUrls: ['./team-types-list.component.scss']
})
export class TeamTypesListComponent implements OnInit, OnDestroy {
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;

  teamTypes: TeamType[] = [];
  teamTypesSubscription: Subscription;

  constructor(private teamTypeService: TeamTypeService, private router: Router) { }

  ngOnInit(): void {
    this.teamTypesSubscription = this.teamTypeService.team_types_subject.subscribe(
      (teamTypes: TeamType[]) => {
        this.teamTypes = teamTypes;
      }
    );
    this.teamTypeService.emitTeamTypes();
  }

  onViewTeamType(i: number) {
    this.router.navigate(['/team-types', i]);
  }

  onDeleteTeamType(i: number) {
    console.log('delete : ' + i);
  }

  ngOnDestroy() {
    this.teamTypesSubscription.unsubscribe();
  }

}
