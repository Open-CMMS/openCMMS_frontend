import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  idCurrentUser: number;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {
    this.idCurrentUser = this.authenticationService.getCurrentUser().id;
    console.log(this.idCurrentUser);
  }

  onLogout() {
    this.authenticationService.logout().then(
      (res) => {
        this.router.navigate(['sign-in']);
      }
    );
  }

}
