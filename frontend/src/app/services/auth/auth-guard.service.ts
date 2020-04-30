import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { UserService } from 'src/app/services/users/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.getCurrentUser();
        if (currentUser) {
            if (route.data.roles && route.data.roles.indexOf(this.userService.getUserPermissions(currentUser.id)[0].getCodename()) === -1) {
                console.log(route.data.roles);
                this.router.navigate(['']);
                return false;
            }
            return true;
        }
        this.router.navigate(['sign-in']);
        return false;
    }
}
