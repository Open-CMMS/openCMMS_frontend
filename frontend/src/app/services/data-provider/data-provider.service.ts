import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataProvider } from '../../models/data-provider';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import {Equipment} from '../../models/equipment';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  // Local variables

  private dataProviders: DataProvider[] = [];
  dataProvidersSubject = new Subject<DataProvider[]>();

  private fileNames: string[] = [];
  fileNamesSubject = new Subject<string[]>();

  private equipments: Equipment[] = [];
  equipmentsSubject = new Subject<Equipment[]>();

  private BASE_URL_API = environment.baseUrl;

  /**
   * Constructor of dataProviderDetailsComponent
   * @param dataProviderService the service used to handle dataProviders
   * @param route the service used to handle route parameters
   * @param equipmentService the service used to handle equipments
   * @param router the service used to handle routing
   * @param formBuilder the service used to handle forms
   */

  constructor(private httpClient: HttpClient) {
    this.getDataProviders();
  }

  /**
   * emit all Data Proviers.
   */
  emitDataProviders() {
    this.dataProvidersSubject.next(this.dataProviders);
  }

  /**
   * emit all Equipments.
   */

  emitEquipments() {
    this.equipmentsSubject.next(this.equipments);
  }
  /**
   * emit all File Names.
   */
  emitFileNames() {
    this.fileNamesSubject.next(this.fileNames);
  }

  /**
   *  get all Data Providers.
   */

  getDataProviders() {
    this.dataProviders = [];
    this.fileNames = [];
    const DATAPROVIDER = 'data_providers';
    const PYTHONFILES = 'python_files';
    const EQUIPMENTS = 'equipments';
    this.httpClient.get<DataProvider[]>(this.BASE_URL_API + '/api/dataproviders/')
      .subscribe(
        async (response) => {
          await response[DATAPROVIDER].forEach(element => {
            const dataProvider = new DataProvider(element.id,
              element.name,
              element.file_name,
              element.recurrence,
              element.is_activated,
              element.equipment,
              element.ip_address,
              element.field_object);
            this.dataProviders.push(dataProvider);
          });
          await response[PYTHONFILES].forEach(element => {
            this.fileNames.push(element);
          });
          await response[EQUIPMENTS].forEach(element => {
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

  /**
   * Give the data Provider relative to the id.
   * @param id the id of the data provider.
   */

  getDataProvider(id: number): Observable<DataProvider> {
    return this.httpClient.get<any>(this.BASE_URL_API + '/api/dataproviders/' + id + '/');
  }

  /**
   * Function that creata a Data Provider.
   * @param newDataProvider Data Provider to create.
   */

  createDataProvider(newDataProvider: DataProvider): Observable<DataProvider> {
    const dpJson = JSON.stringify(newDataProvider);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this.httpClient.post<DataProvider>(this.BASE_URL_API + '/api/dataproviders/', dpJson, httpOptions);
  }

 /**
  * Function that change the type of some variables.
  * @param dataProvider dataProvider to Handle.
  */
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

  /**
   * Function that test the current dataProvider.
   * @param dataProvider dataProvider to test.
   * @param needFormat Bolean to know if we have to change format.
   */

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

  /**
   * Function that updates the Data Provider.
   * @param id id of the dataProvider
   * @param dataProvider DataProvider to Update
   * @param needFormat bolean to activate formalisation.
   */

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
  /**
   * Delete a Data Provider.
   * @param dataProviderId dataProvider Id
   */
  deleteDataProvider(dataProviderId: number) {
    return this.httpClient.delete<DataProvider>(this.BASE_URL_API + '/api/dataproviders/' + dataProviderId + '/');
  }
}
