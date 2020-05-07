import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Function that treats errors on erquests with HttpClient.
   * @param error the error raised by the request.
   */
  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        'Backend returned code ${error.status}, ');
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  /**
   * Function that search in a set of permission of a user
   * and check if the user has a certain permission
   * @param userPerms the permissions of the current connected user
   * @param permissionCodename the permission codename
   */
  public isAUserPermission(userPerms: any[], permissionCodename: string): boolean {
    let permissionFound: boolean;
    let index = 0;
    const breakException = {};
    if (userPerms !== null) {
      while (!permissionFound && index < userPerms.length) {
          if (userPerms[index] === permissionCodename) {
              permissionFound = true;
          } else {
              index++;
          }
      }
    }
    if (permissionFound) {
        return true;
    } else {
        return false;
    }
  }
}
