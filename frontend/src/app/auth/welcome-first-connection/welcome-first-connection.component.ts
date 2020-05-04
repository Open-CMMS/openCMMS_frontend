import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-first-connection',
  templateUrl: './welcome-first-connection.component.html',
  styleUrls: ['./welcome-first-connection.component.scss']
})
export class WelcomeFirstConnectionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSignUp() {
    this.router.navigate(['sign-up']);
  }

}
