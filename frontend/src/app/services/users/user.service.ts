import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../models/user-profile';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class UserService {

  users: UserProfile[] = [];
  usersSubject = new Subject<UserProfile[]>();

  private BASE_URL_API = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
  }


  /**
   * Getter on the List of all users saved on the server's database
   * @return the response which contain all users
   */
  getUsers(): Observable<any> {
    return this.httpClient
      .get<any>(this.BASE_URL_API + '/api/usersmanagement/users/');
  }

  /**
   * Getter on a user saved on the server's database
   * @param id the id attribut of a user
   * @return a specific user
   */
  getUser(id: number ): Observable<any> {
    return this.httpClient
      .get<any>(this.BASE_URL_API + '/api/usersmanagement/users/' + id + '/');
  }

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
   * Fonction to save a new user in the database
   * @param userToCreate User to be saved in the server's database
   */
  createUser(lastName: string, firstName: string, username: string, email: string, password: string): Observable<any> {

    const newUser = {lastName, firstName, username, email, password};

    const userJson = JSON.stringify(newUser);

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
    const suffix = this.httpClient.get<string>(this.BASE_URL_API + '/api/usersmanagement/users/username_suffix?username='
    + username);
    return username + suffix;
  }

}
