import { TestBed } from '@angular/core/testing';
import { EquipmentTypeService } from './equipment-type.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { EquipmentType } from 'src/app/models/equipment-type';

describe('EquipmentTypeService', () => {
  let service: EquipmentTypeService;
  const BASE_URL_API = environment.baseUrl;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ EquipmentTypeService ],
      imports: [ HttpClientTestingModule ]});

    service = TestBed.inject(EquipmentTypeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('US4_A20 - should be created', () => {
    expect(service).toBeTruthy();
    const mockEquipmentTypes = [
      {
        id: 0,
        name: 'EquipmentType 1',
        equipment_set: [1, 2]
      },
      {
        id: 1,
        name: 'EquipmentType 2',
        equipment_set: [3]
      }
    ];

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockEquipmentTypes);
  });

  it('US4_A21 - should verify the parameters and content of the equipment type get action', () => {
    const mockEquipmentTypes = [
      {
        id: 0,
        name: 'EquipmentType 1',
        equipment_set: [1, 2]
      },
      {
        id: 1,
        name: 'EquipmentType 2',
        equipment_set: [3]
      }
    ];
    service.getEquipmentTypes();

    let equipmentTypes: EquipmentType[] = [];
    service.equipment_types_subject.subscribe(
                        (equipmentTypesInService: EquipmentType[]) => {
                          equipmentTypes = equipmentTypesInService;
                          expect(equipmentTypes.length).toBe(2);
                          expect(equipmentTypes[0].id).toBe(0);
                          expect(equipmentTypes[0].name).toBe('EquipmentType 1');
                          expect(equipmentTypes[1].id).toBe(1);
                          expect(equipmentTypes[1].name).toBe('EquipmentType 2');
                        });

    const req = httpTestingController.match(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/');
    expect(req[0].request.method).toEqual('GET');
    expect(req[1].request.method).toEqual('GET');
    req[1].flush(mockEquipmentTypes);
  });

  it('US4_A22 - should verify the parameters and content of the equipment type by id GET request', () => {
    const mockEquipmentType = {
        id: 1,
        name: 'EquipmentType 1',
        equipment_set: [1, 2]
      };
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/');
    service.getEquipmentType(1).subscribe((equipmentType: EquipmentType) => {
      expect(equipmentType.name).toBe('EquipmentType 1');
    });

    const req2 = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/1/');
    expect(req2.request.method).toEqual('GET');
    req2.flush(mockEquipmentType);
  });

  it('US4_A23 - should verify the creation of a new equipment type', () => {
    const mockEquipmentType = {
        id: 1,
        name: 'EquipmentType 2',
        equipment_set: [1]
      };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/');
    const newEquipmentType = new EquipmentType(1, 'EquipmentType 2', [1]);
    service.createEquipmentType(newEquipmentType).subscribe(
      equipmentType => {
        expect(equipmentType.name).toBe('EquipmentType 2');
        expect(equipmentType.equipment_set.length).toBe(1);
        expect(equipmentType.equipment_set[0]).toBe(1);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/');
    expect(req.request.method).toEqual('POST');
    req.flush(mockEquipmentType);
  });

  it('US4_A24 - should verify the update of a equipment type in database', () => {
    const mockEquipmentType = {
        id: 1,
        name: 'EquipmentType 2',
        equipment_set: [2]
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/');
    const newEquipmentType = new EquipmentType(1, 'EquipmentType 2', [2]);
    service.updateEquipmentType(newEquipmentType).subscribe(
      equipmentType => {
        expect(equipmentType.name).toBe('EquipmentType 2');
        expect(equipmentType.equipment_set.length).toBe(1);
        expect(equipmentType.equipment_set[0]).toBe(2);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/' + newEquipmentType.id + '/');
    expect(req.request.method).toEqual('PUT');
    req.flush(mockEquipmentType);
  });

  it('US4_A25 - should verify the deletion of a equipment type in database', () => {
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/');
    service.deleteEquipmentType(1);

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/1/');
    expect(req.request.method).toEqual('DELETE');
  });
});
