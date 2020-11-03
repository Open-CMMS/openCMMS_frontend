import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-data-provider-management',
  templateUrl: './data-provider-management.component.html',
  styleUrls: ['./data-provider-management.component.scss']
})
export class DataProviderManagementComponent implements OnInit {

  faPlus = faPlus;

  constructor() { }

  ngOnInit(): void {
  }

}
