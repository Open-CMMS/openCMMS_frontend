import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EquipmentService } from './equipment.service';
import { Equipment } from 'src/app/models/equipment';

describe('EquipmentService', () => {
  const BASE_URL_API = environment.baseUrl;
  let service: EquipmentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ EquipmentService ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.inject(EquipmentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    const mockEquipment = [
      {
          id: 1,
          name: 'clé',
          equipment_type: '1',
          files: [1, 2, 3]
      },
      {
        id: 2,
        name: 'brosse',
        equipment_type: '1',
        files: [4]
    }
  ];

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockEquipment);
  });

  it('returned Observable should match all the right Equipments', () => {
    const mockEquipment = [
      {
          id: 1,
          name: 'clé',
          equipment_type: 1,
          files: [1, 2, 3]
      },
      {
        id: 2,
        name: 'brosse',
        equipment_type: 1,
        files: [4]
    }
  ];

    service.getEquipments();

    let equipments: Equipment[] = [];
    let files1: number[] = [];
    let files2: number[] = [];
    service.equipmentsSubject.subscribe((equipmentsRegistered: Equipment[]) => {
      equipments = equipmentsRegistered;
      files1 = equipments[0].files;
      files2 = equipments[1].files;
      expect(equipments.length).toBe(2);
      expect(equipments[0].id).toEqual(1);
      expect(equipments[1].id).toEqual(2);
      expect(equipments[0].name).toEqual('clé');
      expect(equipments[1].name).toEqual('brosse');
      expect(equipments[0].equipment_type).toEqual(1);
      expect(equipments[1].equipment_type).toEqual(1);
      expect(files1[0]).toEqual(1);
      expect(files1[1]).toEqual(2);
      expect(files1[2]).toEqual(3);
      expect(files2[0]).toEqual(4);
    });

    const req = httpTestingController.match(BASE_URL_API + '/api/maintenancemanagement/equipments/');

    expect(req[0].request.method).toEqual('GET');
    expect(req[1].request.method).toEqual('GET');

    req[1].flush(mockEquipment);

  });

  it('returned Equipment should match the right data of getEquipment', () => {
    const mockEquipment = {
      id: 1,
      name: 'clé',
      equipment_type: 1,
      files: [1, 2, 3]
  };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    service.getEquipment(1).subscribe((equipment: Equipment) => {
      expect(equipment.id).toEqual(1);
      expect(equipment.name).toEqual('clé');
      expect(equipment.equipment_type).toEqual(1);
      expect(equipment.files[0]).toEqual(1);
      expect(equipment.files[1]).toEqual(2);
      expect(equipment.files[2]).toEqual(3);
    });

    const req2 = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/1/');

    expect(req2.request.method).toEqual('GET');

    req2.flush(mockEquipment);

  });

  it('returned Observable should match the right data on update', () => {
    const mockEquipment = {
      id: 1,
      name: 'clé-anglaise',
      equipment_type: 1,
      files: [1, 2, 3]
  };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    service.updateEquipment(new Equipment(1, 'clé-anglaise', 1, [1, 2, 3]))
      .subscribe(equipment => {
        expect(equipment.name).toEqual('clé-anglaise');
        expect(equipment.equipment_type).toEqual(1);
        expect(equipment.files[0]).toEqual(1);
        expect(equipment.files[1]).toEqual(2);
        expect(equipment.files[2]).toEqual(3);
      });
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/1/');

    expect(req.request.method).toEqual('PUT');

    req.flush(mockEquipment);
  });


  it('returned Observable should match the right data on creating new equipment', () => {
    const mockEquipment = {
      id: 1,
      name: 'clé',
      equipment_type: 1,
      files: [1, 2, 3]
  };

    service.createEquipment('clé', 1, [1, 2, 3])
      .subscribe(equipment => {
        expect(equipment.name).toEqual('clé');
        expect(equipment.equipment_type).toEqual(1);
        expect(equipment.files[0]).toEqual(1);
        expect(equipment.files[1]).toEqual(2);
        expect(equipment.files[2]).toEqual(3);
      });

    const req = httpTestingController.match(BASE_URL_API + '/api/maintenancemanagement/equipments/');

    expect(req[1].request.method).toEqual('POST');

    req[1].flush(mockEquipment);
  });

  it('returned Observable should match the right data on delete', () => {
    const mockEquipment = {
      id: 1,
      name: 'clé',
      equipment_type: 1,
      files: [1, 2, 3]
  };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    service.deleteEquipment(1).subscribe(equipment => {
      expect(equipment.name).toEqual('clé');
      expect(equipment.equipment_type).toEqual(1);
      expect(equipment.files[0]).toEqual(1);
      expect(equipment.files[1]).toEqual(2);
      expect(equipment.files[2]).toEqual(3);
    });

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/1/');

    expect(req.request.method).toEqual('DELETE');

    req.flush(mockEquipment);
  });


});
