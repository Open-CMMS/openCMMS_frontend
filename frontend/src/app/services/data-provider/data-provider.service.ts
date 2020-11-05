import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataProvider } from '../../models/data-provider';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import {Equipment} from "../../models/equipment";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  private dataProviders: DataProvider[] = [];
  dataProvidersSubject = new Subject<DataProvider[]>();

  private fileNames: string[] = [];
  fileNamesSubject = new Subject<string[]>();

  private equipments: Equipment[] = [];
  equipmentsSubject = new Subject<Equipment[]>();

  private BASE_URL_API = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.getDataProviders();
  }

  emitDataProviders() {
    console.log('pass emitDataProviders');
    this.dataProvidersSubject.next(this.dataProviders);
  }

  emitEquipments() {
    this.equipmentsSubject.next(this.equipments);
  }

  getDataProviders() {
    this.dataProviders = [];
    this.fileNames = [];
    const DATAPROVIDER = 'data_providers';
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
          console.log(response);
          console.log(response["python_files"]);
          // response['python_files'].forEach(element => {
          //   console.log(element);
          // });
          console.log(response["equipments"]);
          response['equipments'].forEach(element => {
            const equipment = new Equipment(
              element.id,
              element.name,
              element.equipment_type,
              element.files,
              element.field
              );
            this.equipments.push(equipment);
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
