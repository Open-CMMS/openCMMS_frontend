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

  constructor(private httpClient: HttpClient, private http: HttpClient) {
    this.getUsers();
  }


  /**
   * Getter on the List of all users saved on the server's database
   * @return a list of users
   */
  getUsers(): Observable<any> {
    return this.httpClient
      .get<any[]>(this.BASE_URL_API + '/api/gestion/users/');
  }

}
