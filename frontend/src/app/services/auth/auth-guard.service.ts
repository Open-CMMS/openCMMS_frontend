import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { UserService } from 'src/app/services/users/user.service';
import { UserProfile } from 'src/app/models/user-profile';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // return new Promise<boolean>(
        //     (resolve, reject) => {
        //         const currentUser = this.authenticationService.getCurrentUser();
        //         console.log(currentUser);
        //         console.log(route.data.requiredPerms);
        //         if (currentUser !== null) { // A user is connected so then we can check the perms
        //             if (route.data.roles) {
        //                 this.userService.getUserPermissions(currentUser.id).subscribe(
        //                     (res) => {
        //                         // Check if the user perms are sufficient to access the requested URL
        //                         resolve(true);
        //                     },
        //                     (error) => {
        //                         this.router.navigate(['four-oh-four']);
        //                         resolve(false);
        //                     }
        //                 );
        //             }
        //         }
        //         this.router.navigate(['sign-in']);
        //         resolve(false);
        //     }
        // );

        const currentUser = this.authenticationService.getCurrentUser();
        console.log(currentUser);
        if (currentUser !== null) {
            // if (route.data.requiredPerms && route.data.requiredPerms.indexOf(this.userService.getUserPermissions(currentUser.id)[0].getCodename()) === -1) {
            //     console.log(route.data.roles);
            //     this.router.navigate(['']);
            //     return false;
            // }
            return true;
        }
        this.router.navigate(['sign-in']);
        return false;

    }
}
