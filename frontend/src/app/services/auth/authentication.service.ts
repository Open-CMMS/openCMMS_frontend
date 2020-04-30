import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { UserProfile } from '../../models/user-profile';
import { UserService } from '../users/user.service';


@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private currentUser: UserProfile;
  private currentUserSubject = new Subject<UserProfile>();
  private API_URL = 'https://application.lxc.pic.brasserie-du-slalom.fr/api/gestion/';

  /**
   * Constructor of AutheticationService
   * @param httpClient The http instance
   * @param userService The UserService instance
   */
  constructor(private httpClient: HttpClient, private userService: UserService) {
    this.currentUser = null;
    this.emitCurrentUser();
  }

  emitCurrentUser() {
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
      this.httpClient.post<any>(this.API_URL + 'login', reqJSON, httpOptions)
                     .toPromise()
                     .then(
                        res => {
                          this.userService.getUser(res).toPromise().then(
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
    * Logout method.
    */
  public logout() {
    this.httpClient.get<boolean>(`https://application.lxc.pic.brasserie-du-slalom.fr/api/gestion/logout/`);
    this.currentUser = null;
    this.emitCurrentUser();
  }
}