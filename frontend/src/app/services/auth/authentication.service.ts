import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserProfile } from 'src/app/models/user-profile';
import { UserService } from 'src/app/services/users/user.service';
import { environment } from 'src/environments/environment';


@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<UserProfile>;
  private currentUser: Observable<UserProfile>;
  private BASE_URL_API = environment.baseUrl;

  // private currentRightList Array<Right>;
   /**
    * Constructor of AutheticationService
    * @param httpClient The http instance
    * @param userService The UserService instance
    */
  constructor(private httpClient: HttpClient, private userService: UserService) {
    this.currentUserSubject = new BehaviorSubject<UserProfile>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

   /**
    * Get the current User.
    * @returns The current User
    */
  public getCurrentUser(): UserProfile {
    return this.currentUserSubject.getValue();
  }

   /**
    * Login method.
    * @param userName Name provided by user.
    * @param password Key provided by user.
    */

  public login(username: string, password: string): Observable<boolean> {

    this.httpClient.post<any>(this.BASE_URL_API + 'login/', {username, password})
      .subscribe(id => this.currentUser = this.userService.getUser(id)
        .subscribe(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }));
    // const rep = new Observable<boolean>(response =>
    //   response.next(username === 'jmarie' && password === 'p@sword-au-top')
    // );

    // console.log(username === 'jmarie' && password === 'p@sword-au-top');
    // return (rep);

    if (username === 'jmarie' && password === 'p@sword-au-top') {
      this.userService.getUser(2)
      .subscribe(user => {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    });
    }
    const rep = new Observable<boolean>(response =>
      response.next(username === 'jmarie' && password === 'p@sword-au-top')
    );
    return (rep);
  }
   /**
    * Logout method.
    */
  public logout() {
    this.httpClient.get<boolean>(`http://application.lxc.pic.brasserie-du-slalom.fr/api/gestion/logout/`)
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
