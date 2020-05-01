import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { UserProfile } from '../../models/user-profile';
import { UserService } from '../users/user.service';
import { environment } from 'src/environments/environment';


@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private currentUser: UserProfile;
  private currentUserSubject = new Subject<UserProfile>();
  private BASE_URL_API = environment.baseUrl;
  /**
   * Constructor of AutheticationService
   * @param httpClient The http instance
   * @param userService The UserService instance
   */
  constructor(private httpClient: HttpClient, private userService: UserService) {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } else {
      this.currentUser = null;
    }
    this.emitCurrentUser();
  }
  /**
   * Switch current user to another.
   */
  private emitCurrentUser() {
    this.currentUserSubject.next(this.currentUser);
  }

  /**
   * Get the current User.
   * @returns The current User
   */
  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

   /**
    * Login method.
    * @param userName Name provided by user.
    * @param password Key provided by user.
    */
  public login(username: string, password: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    const reqJSON = '{"username": "' + username + '", "password": "' + password + '"}';

    const promise = new Promise((resolve, reject) => {
      this.httpClient.post<any>(this.BASE_URL_API + '/api/usersmanagement/login', reqJSON, httpOptions)
                     .toPromise()
                     .then(
                        res => {
                          this.userService.getUser(res.user_id).toPromise().then(
                            user => {
                              this.currentUser = new UserProfile(
                                user.id,
                                user.username,
                                user.first_name,
                                user.last_name,
                                user.email,
                                user.password,
                                user.nbTries,
                                user.isActive
                                );
                              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                              this.emitCurrentUser();
                              resolve();
                            },
                            error => {
                              console.log('Connection error !: ' + error);
                              reject(error);
                            }
                          );
                        },
                        error => {
                          console.log('Connection error !: ' + error);
                          reject(error);
                        }
                      );

    });

    return promise;
  }

   /**
    * Logout the current user.
    */
  public logout() {
    return new Promise(
      (resolve, reject) => {
        this.httpClient.get<any>(this.BASE_URL_API + '/api/usersmanagement/logout').subscribe(
          (res) => {
            this.currentUser = null;
            localStorage.setItem('currentUser', null);
            this.emitCurrentUser();
            resolve();
          }
        );
      }
    );
  }
}
