import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, RouterLink } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { UserProfile } from 'src/app/models/user-profile';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

    currentUser: UserProfile;
    currentUserSubscription: Subscription;
    firstUser = true;

    /**
     * Constructor of AuthGuard.
     * @param router the service used for routing.
     * @param authenticationService the auth service.
     */
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUserSubject.subscribe(
            (currentUser) => {
                this.currentUser = currentUser;
            }
        );
        this.authenticationService.emitCurrentUser();
     }

    /**
     * Function that checks if you are allowed to acces a route.
     * @param route the requested route.
     */
    canActivate(route: ActivatedRouteSnapshot) {
        return new Promise<boolean>(
            (resolve, reject) => {
                if (this.currentUser !== null) { // A user is connected so then we can check the perms
                    if (route.data.requiredPerms.length > 0) {
                        this.authenticationService.getUserPermissions(this.currentUser.id).subscribe(
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
                    if (userPerms[index] === permRequired) {
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
