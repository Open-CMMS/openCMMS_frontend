import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

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
   * Function that search in a set of permission of a user and 
   * @param userPerms the permissions of the current connected user
   * @param permissionCodename the permission codename
   */
  public isAUserPermission(userPerms: any[], permissionCodename: string): boolean {
    let permissionFound: boolean;
    let index = 0;
    const breakException = {};
    while (!permissionFound && index < userPerms.length) {
        if (userPerms[index].codename === permissionCodename) {
            permissionFound = true;
        } else {
            index++;
        }
    }
    if (permissionFound) {
        return true;
    } else {
        return false;
    }
  }
}
