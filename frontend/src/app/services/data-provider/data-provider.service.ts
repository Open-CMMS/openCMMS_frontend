import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataProvider} from '../../models/data-provider';
import {environment} from '../../../environments/environment';
import {Observable, Subject} from 'rxjs';

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
    // this.dataProvidersSubject.next(this.dataProviders);
  }

  getDataProviders() {
    console.log('pass getDataProviders');
    // this.dataProviders = [];
    // this.httpClient.get<DataProvider[]>(this.BASE_URL_API + '/api/maintenancemanagement/dataproviders/')
    //                 .subscribe(
    //                   (response) => {
    //                     response.forEach(element => {
    //                       const dataProvider = new DataProvider(' a completer');
    //                       this.dataProviders.push(dataProvider);
    //                     });
    //                     this.emitDataProviders();
    //                   },
    //                 );
  }
  getDataProvider(id: number) : Observable<DataProvider>{
    console.log('get provider');
    console.log(id);
    return null;
  }
  switchStateDataProviders(dataProviderId : number){
    console.log('switch state')
  }
  // getDataProvider(id: number): Observable<any> {
  //   console.log('pass getDataProvider');
    // return this.httpClient
    //   .get<any>(this.BASE_URL_API + '/api/maintenancemanagement/dataproviders/'+id+'/');
  // }

  updateDataProvider(dataProvider: DataProvider): Observable<DataProvider>{
    console.log('update');
    return null;
  }

  deleteDataProvider(dataProviderId: number){
    console.log('pass deleteDataProvider');
    // return this.httpClient.delete(this.BASE_URL_API + '/api/maintenancemanagement/dataproviders/' + dataProviderId + '/');
  }
}
