import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  private currentUser: UserProfile;

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authenticationService.currentUserSubject.subscribe(
      (currentUser) => {
        this.currentUser = currentUser;
      }
    );
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
