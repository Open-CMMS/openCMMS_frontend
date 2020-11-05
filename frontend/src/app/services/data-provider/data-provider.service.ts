import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataProvider } from '../../models/data-provider';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  private dataProviders: DataProvider[] = [];
  dataProvidersSubject = new Subject<DataProvider[]>();

  private BASE_URL_API = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.getDataProviders();
  }

  emitDataProviders() {
    console.log('pass emitDataProviders');
    this.dataProvidersSubject.next(this.dataProviders);
  }

  getDataProviders() {
    this.dataProviders = [];
    const DATAPROVIDER = 'data_providers'
    this.httpClient.get<DataProvider[]>(this.BASE_URL_API + '/api/dataproviders/')
      .subscribe(
        (response) => {
          console.log(response[DATAPROVIDER]);
          response[DATAPROVIDER].forEach(element => {
            const dataProvider = new DataProvider(element.id,
              element.name,
              element.file_name,
              element.recurrence,
              element.activated,
              element.equipmeent,
              element.equipement_IP,
              element.concerned_field);
            this.dataProviders.push(dataProvider);
          });
          this.emitDataProviders();
        },
      );
  }

  getDataProvider(id: number): Observable<DataProvider> {
    return this.httpClient.get<any>(this.BASE_URL_API + '/api/dataproviders/' + id + '/');
  }

  createDataProvider(newDataProvider: DataProvider): Observable<DataProvider> {
    const dpJson = JSON.stringify(newDataProvider);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.httpClient.post<DataProvider>(this.BASE_URL_API + '/api/dataproviders/', dpJson, httpOptions);
  }


  switchStateDataProviders(dataProviderId: number) {
    console.log('switch state');
  }
  // getDataProvider(id: number): Observable<any> {
  //   console.log('pass getDataProvider');
  // return this.httpClient
  //   .get<any>(this.BASE_URL_API + '/api/maintenancemanagement/dataproviders/'+id+'/');
  // }

  updateDataProvider(dataProvider: DataProvider): Observable<DataProvider> {
    console.log('update');
    return null;
  }

  deleteDataProvider(dataProviderId: number) {
    console.log('pass deleteDataProvider');
    return this.httpClient.delete(this.BASE_URL_API + '/api/dataproviders/' + dataProviderId + '/');
  }
}
