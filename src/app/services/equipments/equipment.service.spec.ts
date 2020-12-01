import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EquipmentService } from './equipment.service';
import { Equipment } from 'src/app/models/equipment';
import { Field } from 'src/app/models/field';

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
          files: [1, 2, 3],
          fields: ['266', '267']
      },
      {
        id: 2,
        name: 'brosse',
        equipment_type: '1',
        files: [4],
        fields: ['21', '22']
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
          files: [1, 2, 3],
          fields: [new Field(1, 'name', ['value1', 'value2'], 'description'), new Field(2, 'name2', ['value12', 'value22'], 'description2')]
      },
      {
        id: 2,
        name: 'brosse',
        equipment_type: 1,
        files: [4],
        fields: [new Field(3, 'name3', ['value13', 'value23'], 'description3')]
    }
  ];

    service.getEquipments();

    let equipments: Equipment[] = [];
    let files1: number[] = [];
    let files2: number[] = [];
    let fields1: Field[] = [];
    let fields2: Field[] = [];
    service.equipmentsSubject.subscribe((equipmentsRegistered: Equipment[]) => {
      equipments = equipmentsRegistered;
      files1 = equipments[0].files;
      files2 = equipments[1].files;
      fields1 = equipments[0].fields;
      fields2 = equipments[1].fields;
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
      expect(fields1[0].id).toEqual(1);
      expect(fields1[1].id).toEqual(2);
      expect(fields2[0].id).toEqual(3);
      expect(fields1[0].name).toEqual('name');
      expect(fields1[1].name).toEqual('name2');
      expect(fields2[0].name).toEqual('name3');
      expect(fields1[0].value).toEqual(['value1', 'value2']);
      expect(fields1[1].value).toEqual(['value12', 'value22']);
      expect(fields2[0].value).toEqual(['value13', 'value23']);
      expect(fields1[0].description).toEqual('description');
      expect(fields1[1].description).toEqual('description2');
      expect(fields2[0].description).toEqual('description3');
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
      files: [1, 2, 3],
      fields: [new Field(3, 'name3', ['value13', 'value23'], 'description3')]
  };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    service.getEquipment(1).subscribe((equipment: Equipment) => {
      expect(equipment.id).toEqual(1);
      expect(equipment.name).toEqual('clé');
      expect(equipment.equipment_type).toEqual(1);
      expect(equipment.files[0]).toEqual(1);
      expect(equipment.files[1]).toEqual(2);
      expect(equipment.files[2]).toEqual(3);
      expect(equipment.fields[0].id).toEqual(3);
      expect(equipment.fields[0].name).toEqual('name3');
      expect(equipment.fields[0].value).toEqual(['value13', 'value23']);
      expect(equipment.fields[0].description).toEqual('description3');
    });

    const req2 = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/1/');

    expect(req2.request.method).toEqual('GET');

    req2.flush(mockEquipment);

  });

  it('returned Observable should match the right data on update', () => {
    const mockFields =  [new Field(1, 'name', ['value1', 'value2'], 'description'),
    new Field(2, 'name2', ['value12', 'value22'], 'description2')];
    const mockEquipment = {
      id: 1,
      name: 'clé-anglaise',
      equipment_type: 1,
      files: [1, 2, 3],
      fields: mockFields
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    const fields = [new Field(1, 'name', ['value1', 'value2'], 'description'),
    new Field(2, 'name2', ['value12', 'value22'], 'description2')];
    service.updateEquipment(new Equipment(1, 'clé-anglaise', 1, [1, 2, 3], fields))
      .subscribe(equipment => {
        expect(equipment.name).toEqual('clé-anglaise');
        expect(equipment.equipment_type).toEqual(1);
        expect(equipment.files[0]).toEqual(1);
        expect(equipment.files[1]).toEqual(2);
        expect(equipment.files[2]).toEqual(3);
        expect(equipment.fields[0].id).toEqual(1);
        expect(equipment.fields[1].id).toEqual(2);
        expect(equipment.fields[0].name).toEqual('name');
        expect(equipment.fields[1].name).toEqual('name2');
        expect(equipment.fields[0].value).toEqual(['value1', 'value2']);
        expect(equipment.fields[1].value).toEqual(['value12', 'value22']);
        expect(equipment.fields[0].description).toEqual('description');
        expect(equipment.fields[1].description).toEqual('description2');
      });
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/1/');

    expect(req.request.method).toEqual('PUT');

    req.flush(mockEquipment);
  });

  it('returned Observable should match the right data on update of the name', () => {
    const mockFields =  [new Field(1, 'name', ['value1', 'value2'], 'description'),
      new Field(2, 'name2', ['value12', 'value22'], 'description2')];
    const mockEquipment = {
      id: 1,
      name: 'clé-anglaise',
      equipment_type: 1,
      files: [1, 2, 3],
      fields: mockFields
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    service.updateEquipmentName('clé', 1)
      .subscribe(equipment => {
        expect(equipment.name).toEqual('clé-anglaise');
        expect(equipment.equipment_type).toEqual(1);
        expect(equipment.files[0]).toEqual(1);
        expect(equipment.files[1]).toEqual(2);
        expect(equipment.files[2]).toEqual(3);
        expect(equipment.fields[0].id).toEqual(1);
        expect(equipment.fields[1].id).toEqual(2);
        expect(equipment.fields[0].name).toEqual('name');
        expect(equipment.fields[1].name).toEqual('name2');
        expect(equipment.fields[0].value).toEqual(['value1', 'value2']);
        expect(equipment.fields[1].value).toEqual(['value12', 'value22']);
        expect(equipment.fields[0].description).toEqual('description');
        expect(equipment.fields[1].description).toEqual('description2');
      });
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/1/');

    expect(req.request.method).toEqual('PUT');

    req.flush(mockEquipment);
  });

  it('returned Observable should match the right data on update of the files', () => {
    const mockFields =  [new Field(1, 'name', ['value1', 'value2'], 'description'),
      new Field(2, 'name2', ['value12', 'value22'], 'description2')];
    const mockEquipment = {
      id: 1,
      name: 'clé-anglaise',
      equipment_type: 1,
      files: [1, 2, 3],
      fields: mockFields
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    service.updateEquipmentFile([1, 2, 3], 1)
      .subscribe(equipment => {
        expect(equipment.name).toEqual('clé-anglaise');
        expect(equipment.equipment_type).toEqual(1);
        expect(equipment.files[0]).toEqual(1);
        expect(equipment.files[1]).toEqual(2);
        expect(equipment.files[2]).toEqual(3);
        expect(equipment.fields[0].id).toEqual(1);
        expect(equipment.fields[1].id).toEqual(2);
        expect(equipment.fields[0].name).toEqual('name');
        expect(equipment.fields[1].name).toEqual('name2');
        expect(equipment.fields[0].value).toEqual(['value1', 'value2']);
        expect(equipment.fields[1].value).toEqual(['value12', 'value22']);
        expect(equipment.fields[0].description).toEqual('description');
        expect(equipment.fields[1].description).toEqual('description2');
      });
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/1/');

    expect(req.request.method).toEqual('PUT');

    req.flush(mockEquipment);
  });

  it('returned Observable should match the right data on creating new equipment', () => {
    const mockFields = [new Field(1, 'name', ['value1', 'value2'], 'description')];
    const mockEquipment = {
      id: 1,
      name: 'clé',
      equipment_type: 1,
      files: [1, 2, 3],
      fields: mockFields
  };

    service.createEquipment('clé', 1, [1, 2, 3], mockFields)
      .subscribe(equipment => {
        expect(equipment.name).toEqual('clé');
        expect(equipment.equipment_type).toEqual(1);
        expect(equipment.files[0]).toEqual(1);
        expect(equipment.files[1]).toEqual(2);
        expect(equipment.files[2]).toEqual(3);
        expect(equipment.fields[0].id).toEqual(1);
        expect(equipment.fields[0].name).toEqual('name');
        expect(equipment.fields[0].value).toEqual(['value1', 'value2']);
        expect(equipment.fields[0].description).toEqual('description');
      });

    const req = httpTestingController.match(BASE_URL_API + '/api/maintenancemanagement/equipments/');

    expect(req[1].request.method).toEqual('POST');

    req[1].flush(mockEquipment);
  });

  it('returned Observable should match the right data on delete', () => {
    const mockFields = [new Field(1, 'name', ['value1', 'value2'], 'description')];
    const mockEquipment = {
      id: 1,
      name: 'clé',
      equipment_type: 1,
      files: [1, 2, 3],
      fields: mockFields
  };

    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    service.deleteEquipment(1).subscribe(equipment => {
      expect(equipment.name).toEqual('clé');
      expect(equipment.equipment_type).toEqual(1);
      expect(equipment.files[0]).toEqual(1);
      expect(equipment.files[1]).toEqual(2);
      expect(equipment.files[2]).toEqual(3);
      expect(equipment.fields[0].id).toEqual(1);
      expect(equipment.fields[0].name).toEqual('name');
      expect(equipment.fields[0].value).toEqual(['value1', 'value2']);
      expect(equipment.fields[0].description).toEqual('description');
    });

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/1/');

    expect(req.request.method).toEqual('DELETE');

    req.flush(mockEquipment);
  });

  it('returned Observable should match the right data on delete field', () => {
        const mockEquipment = {
            id: 1,
            name: 'clé',
            equipment_type: 1,
            files: [1, 2, 3],
            fields: {id: 1, name: 'name', value: 'value', description: 'description'}
        };

        httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
        service.deleteFieldEquipment(1, 1).subscribe(equipment => {
            expect(equipment.name).toEqual('clé');
            expect(equipment.equipment_type).toEqual(1);
            expect(equipment.files[0]).toEqual(1);
            expect(equipment.files[1]).toEqual(2);
            expect(equipment.files[2]).toEqual(3);
        });

        const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/removefieldfromequipment/');

        expect(req.request.method).toEqual('DELETE');

        req.flush(mockEquipment);
    });

});
