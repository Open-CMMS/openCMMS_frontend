import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private BASE_URL_API = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  /**
   * Getter on a specific file saved on the server's database
   * @param fileId the id attribut of a equipment
   * @return the specific Equipment
   */
  getFile( fileId: number ): Observable<FormData> {
    return this.httpClient
      .get<FormData>(this.BASE_URL_API + '/api/maintenancemanagement/files/' + fileId + '/');
  }

  /**
   * Fonction to save a new equipment in the database
   * @param file the file you want to upload
   */
  uploadFile(file: FormData) {
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    };

    return this.httpClient
            .post(this.BASE_URL_API + '/api/maintenancemanagement/files/',
                  file,
                  httpOptions);
  }


  /**
   * Fonction that delete a file saved on the server's database
   * @param fileId id attribut of the file you want to delete
   */
  deleteFile(fileId: number) {
    return this.httpClient.delete(this.BASE_URL_API + '/api/maintenancemanagement/files/' + fileId + '/');
  }
}
