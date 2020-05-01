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
  infoPath: string;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onUserDetailsAccess(): string {
    if (this.authenticationService.getCurrentUser()) {
      return 'users/' + this.authenticationService.getCurrentUser().id;
    } else {
      return '';
    }
  }

  onLogout() {
    this.authenticationService.logout().then(
      (res) => {
        this.router.navigate(['sign-in']);
      }
    );
  }

}
