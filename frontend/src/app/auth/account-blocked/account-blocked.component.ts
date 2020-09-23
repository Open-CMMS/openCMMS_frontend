import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-blocked',
  templateUrl: './account-blocked.component.html',
  styleUrls: ['./account-blocked.component.scss']
})
/**
 * Component AccountBlockedComponent
 * This component is displayed when a user entered 3 wrong passwords
 */
export class AccountBlockedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
