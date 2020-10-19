import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  // Local Variables
  private currentUser: UserProfile;

  /**
   * Constructor of JwtInterceptorService
   * @param authenticationService the auth service
   */
  constructor(
    // private authenticationService: AuthenticationService
    ) { }

  /**
   * Function that intercepts the requests to add the JWT token in headers.
   * @param request the request
   * @param next the HttpHandler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.authenticationService.currentUserSubject.subscribe(
    //   (currentUser) => {
    //     this.currentUser = currentUser;
    //   }
    // );
    // this.authenticationService.emitCurrentUser();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser && this.currentUser.token) {
      request = request.clone({
          setHeaders: {
              Authorization: `Bearer ${this.currentUser.token}`
          }
      });
    }
    return next.handle(request);
  }
}
