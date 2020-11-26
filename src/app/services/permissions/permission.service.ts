import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { UtilsService } from '../utils/utils.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private BASE_URL_API = environment.baseUrl;
  /**
   * Constructor of PermissionService.
   * @param httpClient The http instance.
   * @param utils The UtilsService instance.
   */
  constructor(
    private httpClient: HttpClient,
    private utils: UtilsService
    ) { }
  /**
   * Get one permission.
   * @param permissionId Id of the permission.
   * @returns Observable of the permission.
   */
  getPermission(permissionId): Observable<any> {
    return this.httpClient
    .get<any>(this.BASE_URL_API + '/api/usersmanagement/perms/' + permissionId + '/')
    .pipe(
      catchError(this.utils.handleError)
    );
  }
  /**
   * Get all permissions.
   * @returns Observable of the list of all permissions.
   */
  getPermissions(): Observable<any[]> {
    return this.httpClient
    .get<any>(this.BASE_URL_API + '/api/usersmanagement/perms/')
    .pipe(
      catchError(this.utils.handleError)
    );
  }
}
