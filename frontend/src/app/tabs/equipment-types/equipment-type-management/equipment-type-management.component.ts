import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipment-type-management',
  templateUrl: './equipment-type-management.component.html',
  styleUrls: ['./equipment-type-management.component.scss']
})
export class EquipmentTypeManagementComponent implements OnInit {

  faPlus = faPlus;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Function that navigates to the create equipment type component
   */
  onCreateEquipmentType() {
    this.router.navigate(['/new-equipment-type']);
  }

}
