import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Subject } from 'rxjs';
import { UserProfile } from '../../models/user-profile';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class AuthenticationService {

  // Local variables
  private currentUser: UserProfile;
  currentUserSubject = new Subject<UserProfile>();
  private BASE_URL_API = environment.baseUrl;
  private userPermissions: any[] = [];

  /**
   * Constructor of AuthenticationService
   * @param httpClient The http instance
   * @param router the service used to handle routing
   */
  constructor(private httpClient: HttpClient, private router: Router) {
    if (localStorage.getItem('currentUser') !== 'null') {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } else {
      this.currentUser = null;
      this.userPermissions = [];
    }
    this.emitCurrentUser();
  }

  /**
   * Switch current user to another.
   */
  emitCurrentUser() {
    this.currentUserSubject.next(this.currentUser);
  }

  /**
   * Get the current User permissions.
   * @returns The current User permissions
   */
  public getCurrentUserPermissions(): any[] {
    return this.userPermissions;
  }

  /**
   * Login method.
   * @param username Name provided by user.
   * @param password Key provided by user.
   */
  public login(username: string, password: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    };

    const params = new HttpParams().set('username', username).set('password', password);

    const promise = new Promise((resolve, reject) => {
      this.httpClient.post<any>(this.BASE_URL_API + '/api/usersmanagement/login', params, httpOptions)
                     .toPromise()
                     .then(
                        res => {
                          if (res.user) {
                            this.currentUser = new UserProfile(
                              res.user.id,
                              res.user.username,
                              res.user.first_name,
                              res.user.last_name,
                              res.user.email,
                              res.user.password,
                              res.user.nb_tries,
                              res.user.is_active,
                              );
                          }
                          if (res.token && this.currentUser) {
                            this.currentUser.token = res.token;
                          }
                          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                          if (this.currentUser) {
                            this.getUserPermissions(this.currentUser.id)
                                            .subscribe(
                                              (perms) => {
                                                this.userPermissions = perms;
                                              }
                                            );
                          }
                          this.emitCurrentUser();
                          resolve();
                        },
                        error => {
                          console.log(error.error.is_blocked);
                          if (error.error.is_blocked === 'True') {
                            this.router.navigate(['account-blocked']);
                          }
                          reject(error);
                        }
                      );

    });

    return promise;
  }

  /**
   * Function that gets the set of a user's permissions.
   * @param id the id of the user.
   */
  getUserPermissions(id: number ) {
    return this.httpClient.get<any>(this.BASE_URL_API + '/api/usersmanagement/users/' + id + '/get_user_permissions');
  }

  /**
   * Logout the current user.
   */
  public logout() {
    localStorage.setItem('currentUser', null);
    window.location.reload();
    return new Promise(
      (resolve, reject) => {
        this.httpClient.get<any>(this.BASE_URL_API + '/api/usersmanagement/logout').subscribe(
          (res) => {
            this.currentUser = null;
            this.userPermissions = [];
            this.emitCurrentUser();
            resolve();
          }
        );
      }
    );
  }

  /**
   * Getter to know if there is any user in the server's database
   * @returns a boolean, true if there is no user, else return false
   */
  is_first_user() {
    return this.httpClient.get<any>(this.BASE_URL_API + '/api/usersmanagement/users/is_first_user');
  }

  /**
   * Function that verifies is the access to set a password is valid
   * @param username the user that wants to reset his password
   * @param token the token given in the URL by the API
   */
  verifyToken(username: string, token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    const json = '{"username": "' + username + '", "token": "' + token + '"}';

    return this.httpClient.post<any>(this.BASE_URL_API + '/api/usersmanagement/check_token', json, httpOptions );
  }

  /**
   * Function that set the new password
   * @param username the user that wants to set his password
   * @param password the password to set
   * @param token the token given in the URL by the API
   */
  setPassword(username: string, password: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    const json = '{"username": "' + username + '", "password": "' + password + '", "token": "' + token + '"}';

    return this.httpClient.post<any>(this.BASE_URL_API + '/api/usersmanagement/set_password', json, httpOptions);
  }
}
