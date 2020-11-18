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
    let test: any[] = ['unField'];
    let test2: any = 'salut';
    let eq1: Equipment = new Equipment(1,'test','equipmentTypeTest',test,test2);
    let field1: Field = new Field(1,'field1',['test'],'ceci est un test')
    const mockDataProviders = [
      {
        id: 1,
        name: 'DataProvider 1',
        fileName: 'test1.py',
        recurrence: 'tous les jours',
        activated: true,
        equipment: eq1,
        equipment_IP: '192.168.101.1',
        concerned_field : field1
      },
      {
        id: 2,
        name: 'DataProvider 2',
        fileName: 'test2.py',
        recurrence: 'tous les 2 jours',
        activated: false,
        equipment: eq1,
        equipment_IP: '192.168.101.2',
        concerned_field : field1
      }
    ];
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/data-providers/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockDataProviders);
  });

  it('should verify the parameters and content of the equipment type get action', () => {
    let test: any[] = ['unField'];
    let test2: any = 'salut';
    let eq1: Equipment = new Equipment(1,'test','equipmentTypeTest',test,test2);
    let field1: Field = new Field(1,'field1',['test'],'ceci est un test')
    const mockDataProviders = [
      {
        id: 1,
        name: 'DataProvider 1',
        fileName: 'test1.py',
        recurrence: 'tous les jours',
        activated: true,
        equipment: eq1,
        equipment_IP: '192.168.101.1',
        concerned_field : field1
      },
      {
        id: 2,
        name: 'DataProvider 2',
        fileName: 'test2.py',
        recurrence: 'tous les 2 jours',
        activated: false,
        equipment: eq1,
        equipment_IP: '192.168.101.2',
        concerned_field : field1
      }];
    service.getDataProviders();

    let dataProviders: DataProvider[] = [];
    service.dataProvidersSubject.subscribe(
                        (dataProvidersInService: DataProvider[]) => {
                          dataProviders = dataProvidersInService;
                          expect(dataProviders.length).toBe(2);
                          
                          expect(dataProviders[0].id).toBe(1);
                          expect(dataProviders[0].name).toBe('DataProvider 1');
                          expect(dataProviders[0].fileName).toBe('test1.py');
                          expect(dataProviders[0].recurrence).toBe('tous les jours');
                          expect(dataProviders[0].activated).toBe(true);
                          expect(dataProviders[0].equipment).toBe(eq1);
                          expect(dataProviders[0].equipment_IP).toBe('192.168.101.1');
                          expect(dataProviders[0].concerned_field).toBe(field1);

                          expect(dataProviders[1].id).toBe(2);
                          expect(dataProviders[1].name).toBe('DataProvider 2');
                          expect(dataProviders[0].fileName).toBe('test2.py');
                          expect(dataProviders[0].recurrence).toBe('tous les jours');
                          expect(dataProviders[0].activated).toBe(true);
                          expect(dataProviders[0].equipment).toBe(eq1);
                          expect(dataProviders[0].equipment_IP).toBe('192.168.101.2');
                          expect(dataProviders[0].concerned_field).toBe(field1);
                        });

    const req = httpTestingController.match(BASE_URL_API + '/api/maintenancemanagement/dataProviders/');
    expect(req[0].request.method).toEqual('GET');
    expect(req[1].request.method).toEqual('GET');
    req[1].flush(mockDataProviders);
  });

  it('should verify the parameters and content of the equipment type by id GET request', () => {
    let test: any[] = ['unField'];
    let test2: any = 'salut';
    let eq1: Equipment = new Equipment(1,'test','equipmentTypeTest',test,test2);
    let field1: Field = new Field(1,'field1',['test'],'ceci est un test')
    const mockDataProviders = [
      {
        id: 1,
        name: 'DataProvider 1',
        fileName: 'test1.py',
        recurrence: 'tous les jours',
        activated: true,
        equipment: eq1,
        equipment_IP: '192.168.101.1',
        concerned_field : field1
      },
      {
        id: 2,
        name: 'DataProvider 2',
        fileName: 'test2.py',
        recurrence: 'tous les 2 jours',
        activated: false,
        equipment: eq1,
        equipment_IP: '192.168.101.2',
        concerned_field : field1
      }];
    // httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/');
    service.getDataProvider(1).subscribe((dataProvider: DataProvider) => {
      expect(dataProvider.name).toBe('DataProvider 1');
      expect(dataProvider.equipment).toBe(eq1);
    });

    const req2 = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/data-providers/1/');
    expect(req2.request.method).toEqual('GET');
    req2.flush(mockDataProviders);
  });

  it('should verify the update of a equipment type in database', () => {
    let test: any[] = ['unField'];
    let test2: any = 'salut';
    let eq1: Equipment = new Equipment(1,'test','equipmentTypeTest',test,test2);
    let field1: Field = new Field(1,'field1',['test'],'ceci est un test')
    const mockDataProvider = 
    {
      id: 1,
      name: 'DataProvider 1',
      fileName: 'test1.py',
      recurrence: 'tous les jours',
      activated: true,
      equipment: eq1,
      equipment_IP: '192.168.101.1',
      concerned_field : field1
    };
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/data-providers/');
    const newDataProvider = new DataProvider(1, 'DataProvider 1', 'test1.py', 'tous les jours', true, eq1, '192.168.101.1', field1 );
    service.updateDataProvider(newDataProvider).subscribe(
      dataProvider => {
        expect(dataProvider.id).toBe(1);
        expect(dataProvider.name).toBe('DataProvider 1');
        expect(dataProvider.fileName).toBe('test1.py');
        expect(dataProvider.recurrence).toBe('tous les jours');
        expect(dataProvider.activated).toBe(true);
        expect(dataProvider.equipment).toBe(eq1);
        expect(dataProvider.equipment_IP).toBe('192.168.101.1');
        expect(dataProvider.concerned_field).toBe(field1);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/data-providers/' + newDataProvider.id + '/');
    expect(req.request.method).toEqual('PUT');
    req.flush(mockDataProvider);
  });
  
  it('should verify the deletion of a data provider in database', () => {
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/data-providers/');
    service.deleteDataProvider(1);

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/data-providers/1/');
    expect(req.request.method).toEqual('DELETE');
  });
});
