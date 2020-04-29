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
  constructor(
    private httpClient: HttpClient,
    private utils: UtilsService
    ) { }

  getPermission(permissionId): Observable<any> {
    return this.httpClient
    .get<any>(this.BASE_URL_API + '/api/usersmanagement/perms/' + permissionId + '/')
    .pipe(
      catchError(this.utils.handleError)
    );
  }

  getPermissions(): Observable<any[]> {
    return this.httpClient
    .get<any>(this.BASE_URL_API + '/api/usersmanagement/perms/')
    .pipe(
      catchError(this.utils.handleError)
    );
  }
}
