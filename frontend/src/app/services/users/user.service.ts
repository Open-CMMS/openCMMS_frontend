import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../models/user-profile';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class UserService {

  users: UserProfile[] = [];
  usersSubject = new Subject<UserProfile[]>();

  private BASE_URL_API = environment.baseUrl;

  emitUsers() {
    this.usersSubject.next(this.users);
  }

  constructor(private httpClient: HttpClient) {
    this.getUsers().subscribe(
      (response) => {
        response.forEach(element => {
          const user = new UserProfile(element.id, element.last_name, element.first_name,
                                element.username, element.email, element.password,
                                element.nb_tries, element.is_active);
          this.users.push(user);
        });
        this.emitUsers();
      }
    );
  }


  /**
   * Getter on the List of all users saved on the server's database
   * @return the response which contain all users
   */
  getUsers(): Observable<any> {
    return this.httpClient
      .get<any>(this.BASE_URL_API + '/api/gestion/users/');
  }

  /**
   * Getter on a user saved on the server's database
   * @param id the id attribut of a user
   * @return a specific user
   */
  getUser(id: number ): Observable<any> {
    return this.httpClient
      .get<any>(this.BASE_URL_API + '/api/gestion/users/' + id + '/');
  }

}
