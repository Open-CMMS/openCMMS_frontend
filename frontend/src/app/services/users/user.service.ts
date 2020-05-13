import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../models/user-profile';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  private users: UserProfile[] = [];
  usersSubject = new Subject<UserProfile[]>();

  private BASE_URL_API = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.getUsers();
  }

  /**
   * Function that updates the subject usersSubject
   */
  emitUsers() {
    this.usersSubject.next(this.users);
  }

  /**
   * Getter on the List of all users saved on the server's database
   * @return the response which contain all users
   */
  getUsers() {
    this.users = [];
    this.httpClient.get<UserProfile[]>(this.BASE_URL_API + '/api/usersmanagement/users/')
                  .subscribe(
                    (response) => {
                      response.forEach(element => {
                        const user = new UserProfile(element.id, element.username, element.first_name,
                                              element.last_name, element.email, element.password,
                                              element.nb_tries, element.is_active);
                        this.users.push(user);
                      });
                      this.emitUsers();
                    },
                  );
  }

  /**
   * Getter on a user saved on the server's database
   * @param id the id attribut of a user
   * @return a specific user
   */
  getUser(id: number ): Observable<UserProfile> {
    return this.httpClient
      .get<UserProfile>(this.BASE_URL_API + '/api/usersmanagement/users/' + id + '/');
  }

  /**
   * Fonction to update a existing user in the database
   * @param userModified User concerned with the modification and with modifications applied
   */
  updateUser(userModified: UserProfile) {

    const last_name = userModified.last_name;
    const first_name = userModified.first_name;
    const email = userModified.email;

    const userJson = JSON.stringify({last_name, first_name, email});

    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient
                      .put<UserProfile>(this.BASE_URL_API + '/api/usersmanagement/users/' + userModified.id + '/',
                                  userJson,
                                  httpOptions);
  }

  /**
   * Fonction to update a existing user in the database
   * @param userModified User concerned with the modification and with modifications applied
   */
  updateUserPassword(userModified: UserProfile, newPassword: string) {

    const password = newPassword;

    const userJson = JSON.stringify({password});

    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient
                      .put<UserProfile>(this.BASE_URL_API + '/api/usersmanagement/users/' + userModified.id + '/',
                                  userJson,
                                  httpOptions);
  }

  /**
   * Fonction to save a new user in the database
   * @param userToCreate User to be saved in the server's database
   */
  createUser(username: string, first_name: string, last_name: string, email: string, password: string): Observable<any> {
    const userJson = JSON.stringify({username, first_name, last_name, email, password});

    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient
            .post(this.BASE_URL_API + '/api/usersmanagement/users/',
                  userJson,
                  httpOptions);
  }

  /**
   * Fonction that delete a user saved on the server's database
   * @param userId id attribut of the user you want to delete
   */
  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete(this.BASE_URL_API + '/api/usersmanagement/users/' + userId + '/');
  }

  /**
   * Getter to know if there is any user in the server's database
   * @returns a boolean, true if there is no user, else return false
   */
  is_first_user() {
    return this.httpClient.get<any>(this.BASE_URL_API + '/api/usersmanagement/users/is_first_user/');
  }

  /**
   * getter on a possible suffix to add to the user's username, if userame is already used by another user
   * @param username the username of the new possible user
   * @return a string containing the suffixe to be added to the current username
   */
  getUsernameSuffix(username: string ) {
    return this.httpClient.get<string>(this.BASE_URL_API + '/api/usersmanagement/users/username_suffix?username='
    + username);
  }
}
