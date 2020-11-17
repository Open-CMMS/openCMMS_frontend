import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/models/user-profile';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  // Local Variables
  private currentUser: UserProfile;

  /**
   * Constructor of JwtInterceptorService
   * @param authenticationService the auth service
   * @param router the service used to handle routing
   * @param modalService the service used to handle modal
   */
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    ) { }

  /**
   * Function that intercepts the requests to add the JWT token in headers.
   * @param request the request
   * @param next the HttpHandler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!request.url.includes('get_user_permissions')) {
      const currentUserPermissions = this.authenticationService.getCurrentUserPermissions();
      if (this.currentUser && currentUserPermissions.length === 0) {
        this.authenticationService.getUserPermissions(this.currentUser.id).subscribe(
          (perms) => {
            this.authenticationService.userPermissions = perms;
          }
        );
      }
    }

    if (this.currentUser && this.currentUser.token) {
      request = request.clone({
          setHeaders: {
              Authorization: `Bearer ${this.currentUser.token}`
          }
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        console.log('err', err);
        if (err.status === 401) {
          this.authenticationService.logout();
        } else {
          if (err.status === 500 ) {
            console.log('500');
          } else {
            if (err.status === 400 && err.error.is_blocked === 'True') {
              console.log('400');
              this.router.navigate(['account-blocked']);
            } else {
              if (err.status === 400 && err.error.error === 'Mot de passe incorrect') {
                console.log('Mot de passe incorrect');
                this.modalService.open(err.error.error);
                this.router.navigate(['sign-in']);
              }
            }
          }
        }
        return of(err);
      })
    );
  }
}
