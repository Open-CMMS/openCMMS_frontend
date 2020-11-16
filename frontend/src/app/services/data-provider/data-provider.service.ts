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
    this.dataProvidersSubject.next(this.dataProviders);
  }

  emitEquipments() {
    this.equipmentsSubject.next(this.equipments);
  }

  emitFileNames() {
    this.fileNamesSubject.next(this.fileNames);
  }

  getDataProviders() {
    this.dataProviders = [];
    this.fileNames = [];
    const DATAPROVIDER = 'data_providers';
    const PYTHONFILES = 'python_files';
    const EQUIPMENTS = 'equipments';
    this.httpClient.get<DataProvider[]>(this.BASE_URL_API + '/api/dataproviders/')
      .subscribe(
        (response) => {
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
          response[PYTHONFILES].forEach(element => {
            this.fileNames.push(element);
          });
          response[EQUIPMENTS].forEach(element => {
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
          this.emitEquipments();
          this.emitFileNames();
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

  // getDataProvider(id: number): Observable<any> {
  //   console.log('pass getDataProvider');
  // return this.httpClient
  //   .get<any>(this.BASE_URL_API + '/api/maintenancemanagement/dataproviders/'+id+'/');
  // }

  formatDataProvider(dataProvider: DataProvider) {
    const equipment_id: any = dataProvider.equipment.id;
    const field_id: any = dataProvider.field_object.id;
    return new DataProvider(
      dataProvider.id,
      dataProvider.name,
      dataProvider.file_name,
      dataProvider.recurrence,
      dataProvider.is_activated,
      equipment_id,
      dataProvider.ip_address,
      field_id,
    );
  }

  testDataProvider(dataProvider: DataProvider, needFormat: boolean): Observable<any> {
    if (needFormat) {
      dataProvider = this.formatDataProvider(dataProvider);
    }
    const dpJson = JSON.stringify(dataProvider);
    const httpOptions = {
      headers: new HttpHeaders( {
        'Content-type': 'application/json'
      }),
    };
    return this.httpClient.post<any>(this.BASE_URL_API + '/api/dataproviders/test/', dpJson, httpOptions);
  }


  updateDataProvider(id, dataProvider: DataProvider, needFormat: boolean): Observable<DataProvider> {
    if (needFormat) {
      dataProvider = this.formatDataProvider(dataProvider);
    }
    const dpJson = JSON.stringify(dataProvider);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.httpClient.put<DataProvider>(this.BASE_URL_API + '/api/dataproviders/' + id + '/', dpJson, httpOptions);
  }

  deleteDataProvider(dataProviderId: number) {
    console.log(this.BASE_URL_API + '/api/dataproviders/' + dataProviderId + '/');
    return this.httpClient.delete<DataProvider>(this.BASE_URL_API + '/api/dataproviders/' + dataProviderId + '/');
  }
}
