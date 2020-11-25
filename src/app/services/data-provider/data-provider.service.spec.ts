import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DataProvider } from 'src/app/models/data-provider';
import { Equipment } from 'src/app/models/equipment';
import { Field } from 'src/app/models/field';
import { environment } from 'src/environments/environment';

import { DataProviderService } from './data-provider.service';

describe('DataProviderService', () => {
  let service: DataProviderService;
  const BASE_URL_API = environment.baseUrl;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataProviderService],
      imports: [ HttpClientTestingModule]});

    service = TestBed.inject(DataProviderService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    httpTestingController.expectOne(BASE_URL_API + '/api/dataproviders/');
  });

  it('should verify the parameters and content of the equipment type get action', () => {
    const test: any[] = ['unField'];
    const test2: any = 'salut';
    const eq1: Equipment = new Equipment(1, 'test', 'equipmentTypeTest', test, test2);
    const field1: Field = new Field(1, 'field1', ['test'], 'ceci est un test');
    const mockDataProviders = [
      {
        id: 1,
        name: 'DataProvider 1',
        file_name: 'test1.py',
        recurrence: '1d',
        is_activated: true,
        equipment: eq1,
        ip_address: '192.168.101.1',
        field_object : field1,
      },
      {
        id: 2,
        name: 'DataProvider 2',
        file_name: 'test2.py',
        recurrence: '2d',
        is_activated: false,
        equipment: eq1,
        ip_address: '192.168.101.2',
        field_object : field1
      }];
    service.getDataProviders();

    let dataProviders: DataProvider[] = [];
    service.dataProvidersSubject.subscribe(
                        (dataProvidersInService: DataProvider[]) => {
                          dataProviders = dataProvidersInService;
                          expect(dataProviders.length).toBe(2);

                          expect(dataProviders[0].id).toBe(1);
                          expect(dataProviders[0].name).toBe('DataProvider 1');
                          expect(dataProviders[0].file_name).toBe('test1.py');
                          expect(dataProviders[0].recurrence).toBe('1d');
                          expect(dataProviders[0].equipment).toBe(eq1);
                          expect(dataProviders[0].ip_address).toBe('192.168.101.1');
                          expect(dataProviders[0].field_object).toBe(field1);

                          expect(dataProviders[1].id).toBe(2);
                          expect(dataProviders[1].name).toBe('DataProvider 2');
                          expect(dataProviders[1].file_name).toBe('test2.py');
                          expect(dataProviders[1].recurrence).toBe('2d');
                          expect(dataProviders[1].equipment).toBe(eq1);
                          expect(dataProviders[1].ip_address).toBe('192.168.101.2');
                          expect(dataProviders[1].field_object).toBe(field1);
                        });

    const req = httpTestingController.match(BASE_URL_API + '/api/dataproviders/');
    expect(req[0].request.method).toEqual('GET');
    expect(req[1].request.method).toEqual('GET');
    req[0].flush(mockDataProviders[0]);
    req[1].flush(mockDataProviders[1]);

  });

  it('should verify the parameters and content of the equipment type by id GET request', () => {
    const test: any[] = ['unField'];
    const test2: any = 'salut';
    const eq1: Equipment = new Equipment(1, 'test', 'equipmentTypeTest', test, test2);
    const field1: Field = new Field(1, 'field1', ['test'], 'ceci est un test');
    const mockDataProviders = [
      {
        id: 1,
        name: 'DataProvider 1',
        file_name: 'test1.py',
        recurrence: '1d',
        is_activated: true,
        equipment: eq1,
        ip_address: '192.168.101.1',
        field_object : field1,
        },
        {
          id: 2,
          name: 'DataProvider 2',
          file_name: 'test2.py',
          recurrence: '2d',
          is_activated: false,
          equipment: eq1,
          ip_address: '192.168.101.2',
          field_object : field1
        }
      ];
    httpTestingController.expectOne(BASE_URL_API + '/api/dataproviders/');
    service.getDataProvider(1).subscribe((dataProvider: DataProvider) => {
      expect(dataProvider.id).toBe(1);
      expect(dataProvider.name).toBe('DataProvider 1');
      expect(dataProvider.file_name).toBe('test1.py');
      expect(dataProvider.recurrence).toBe('1d');
      expect(dataProvider.equipment).toBe(eq1);
      expect(dataProvider.ip_address).toBe('192.168.101.1');
      expect(dataProvider.field_object).toBe(field1);
    });

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/dataproviders/1/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockDataProviders[0]);
  });

  it('should verify the update of a equipment type in database', () => {
    const test: any[] = ['unField'];
    const test2: any = 'salut';
    const eq1: Equipment = new Equipment(1, 'test', 'equipmentTypeTest', test, test2);
    const field1: Field = new Field(1, 'field1', ['test'], 'ceci est un test');
    const mockDataProvider = {
      id: 1,
      name: 'DataProvider 1',
      file_name: 'test1.py',
      recurrence: '1d',
      is_activated: true,
      equipment: eq1,
      ip_address: '192.168.101.1',
      field_object : field1
    };
    httpTestingController.expectOne(BASE_URL_API + '/api/dataproviders/');
    const newDataProvider = new DataProvider(1, 'DataProvider 1', 'test1.py', '1d', true, eq1, '192.168.101.1', field1 );
    service.updateDataProvider(1, newDataProvider, true).subscribe(
      dataProvider => {
        expect(dataProvider.id).toBe(1);
        expect(dataProvider.name).toBe('DataProvider 1');
        expect(dataProvider.file_name).toBe('test1.py');
        expect(dataProvider.recurrence).toBe('1d');
        expect(dataProvider.is_activated).toBe(true);
        expect(dataProvider.equipment).toBe(eq1);
        expect(dataProvider.ip_address).toBe('192.168.101.1');
        expect(dataProvider.field_object).toBe(field1);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/dataproviders/' + newDataProvider.id + '/');
    expect(req.request.method).toEqual('PUT');
    req.flush(mockDataProvider);
  });

  it('should verify the deletion of a data provider in database', () => {
    httpTestingController.expectOne(BASE_URL_API + '/api/dataproviders/');
    service.deleteDataProvider(1).subscribe();
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/dataproviders/1/');
    expect(req.request.method).toEqual('DELETE');
  });

  it('should verify the test of a data provider', () => {
    const test: any[] = ['unField'];
    const test2: any = 'salut';
    const eq1: Equipment = new Equipment(1, 'test', 'equipmentTypeTest', test, test2);
    const field1: Field = new Field(1, 'field1', ['test'], 'ceci est un test');
    httpTestingController.expectOne(BASE_URL_API + '/api/dataproviders/');
    const newDataProvider = new DataProvider(1, 'DataProvider 1', 'test1.py', '1d', true, eq1, '192.168.101.1', field1 );

    service.testDataProvider(newDataProvider, true).subscribe();
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/dataproviders/test/');
    expect(req.request.method).toEqual('POST');
  });
});
