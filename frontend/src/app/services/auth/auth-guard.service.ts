import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, RouterLink } from '@angular/router';
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
        return new Promise<boolean>(
            (resolve, reject) => {
                const currentUser = this.authenticationService.getCurrentUser();
                if (currentUser !== null) { // A user is connected so then we can check the perms
                    if (route.data.requiredPerms.length > 0) {
                        this.userService.getUserPermissions(currentUser.id).subscribe(
                            (res) => {
                                if (this.checkUserPermissions(route, res)) {
                                    resolve(true);
                                } else {
                                    this.router.navigate(['four-oh-four']);
                                    resolve(false);
                                }
                            },
                            (error) => {
                                this.router.navigate(['four-oh-four']);
                                resolve(false);
                            }
                        );
                    } else {
                        resolve(true);
                    }
                } else {
                    this.router.navigate(['sign-in']);
                    resolve(false);
                }
            }
        );
    }

    private checkUserPermissions(route: ActivatedRouteSnapshot, userPerms: any[]): boolean {
        let permissionFound: boolean;
        let index = 0;
        const breakException = {};
        try {
            route.data.requiredPerms.forEach(permRequired => {
                permissionFound = false;
                while (!permissionFound && index < userPerms.length) {
                    if (userPerms[index].codename === permRequired) {
                        permissionFound = true;
                    } else {
                        index++;
                    }
                }
                if (!permissionFound) {
                    throw breakException;
                }
            });
        } catch (e) {
            if (e !== breakException) {
                throw e;
            } else {
                return false;
            }
        }
        return true;
    }
}
