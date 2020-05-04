import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Subject } from 'rxjs';
import { UserProfile } from '../../models/user-profile';
import { environment } from 'src/environments/environment';


@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private currentUser: UserProfile;
  currentUserSubject = new Subject<UserProfile>();
  private BASE_URL_API = environment.baseUrl;
  private userPermissions: any[] = [];

  /**
   * Constructor of AutheticationService
   * @param httpClient The http instance
   * @param userService The UserService instance
   */
  constructor(private httpClient: HttpClient) {
    if (localStorage.getItem('currentUser') !== 'null' && localStorage.getItem('currentUserPerms') !== 'null') {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.userPermissions = JSON.parse(localStorage.getItem('currentUserPerms'));
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
    * @param userName Name provided by user.
    * @param password Key provided by user.
    */
  public login(username: string, password: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    };

    // const reqJSON = '{"username": "' + username + '", "password": "' + password + '"}';

    const params = new HttpParams().set('username', username).set('password', password);

    const promise = new Promise((resolve, reject) => {
      this.httpClient.post<any>(this.BASE_URL_API + '/api/usersmanagement/login', params, httpOptions)
                     .toPromise()
                     .then(
                        res => {
                          console.log(res);
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
                          this.currentUser.token = res.token;
                          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                          this.getUserPermissions(this.currentUser.id)
                                          .subscribe(
                                            (perms) => {
                                              this.userPermissions = perms;
                                              localStorage.setItem('currentUserPerms', JSON.stringify(this.userPermissions));
                                            }
                                          );
                          this.emitCurrentUser();
                          resolve();
                        },
                        error => {
                          console.log('Connection error !: ' + error);
                          reject(error);
                        }
                      );

    });

    return promise;
  }

  getUserPermissions(id: number ) {
    return this.httpClient.get<any>(this.BASE_URL_API + '/api/usersmanagement/users/' + id + '/get_user_permissions');
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
            this.userPermissions = [];
            localStorage.setItem('currentUser', null);
            localStorage.setItem('currentUserPerms', null);
            this.emitCurrentUser();
            resolve();
          }
        );
      }
    );
  }
}
