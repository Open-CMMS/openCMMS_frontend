import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Permission } from 'src/app/models/permission';
import { HttpClient } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { UtilsService } from '../utils/utils.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private BASE_URL_API = environment.baseUrl;
  constructor(
    private httpClient: HttpClient,
    private utils: UtilsService
    ) { }

  getPermission(permissionId) : Observable<Permission> {
    return this.httpClient
    .get<Permission>(this.BASE_URL_API + '/api/usersmanagement/perms/'+permissionId+'/')
    .pipe(
      catchError(this.utils.handleError)
    );
  }

  getPermissions(permissionId) : Observable<Permission[]> {
    return this.httpClient
    .get<Permission[]>(this.BASE_URL_API + '/api/usersmanagement/perms/')
    .pipe(
      catchError(this.utils.handleError)
    );
  }
}
