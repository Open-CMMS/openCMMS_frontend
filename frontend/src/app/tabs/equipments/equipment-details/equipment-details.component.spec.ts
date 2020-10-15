import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentDetailsComponent } from './equipment-details.component';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Equipment } from 'src/app/models/equipment';
import { Field } from 'src/app/models/field';
import { Mock } from 'protractor/built/driverProviders';

describe('EquipmentDetailsComponent', () => {
  let component: EquipmentDetailsComponent;
  let fixture: ComponentFixture<EquipmentDetailsComponent>;
  let httpTestingController: HttpTestingController;
  const BASE_URL_API = environment.baseUrl;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EquipmentDetailsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule]

    })
    .compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    router.initialNavigation();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should delete the equipment', () => {
    const mockFields = [new Field(1, 'name', ['value1', 'value2'], 'description')];
    component.currentEquipment = new Equipment(6, 'test', 2, [0, 1], mockFields);
    component.onDeleteEquipment();
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/NaN/');
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/');
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/6/');
    expect(req.request.method).toBe('DELETE');
    httpTestingController.verify();
  });

  it('should update the equipment', () => {
    const mockFields = [new Field(1, 'name', ['value1', 'value2'], 'description')];
    component.currentEquipment = new Equipment(6, 'test', 2, [0, 1], mockFields);
    component.initForm();
    component.onModifyEquipment();
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/');
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/NaN/');
    httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipmenttypes/');
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/equipments/6/');
    expect(req.request.method).toBe('PUT');
    httpTestingController.verify();
  });

  it('should init the forms', () => {
    const mockFields = [new Field(1, 'name', ['value1', 'value2'], 'description')];
    component.currentEquipment = new Equipment(6, 'test', 2, [0, 1], mockFields);
    component.initForm();
    expect(component.equipmentUpdateForm.contains('name')).toBe(true);
    expect(component.equipmentUpdateForm.contains('equipment_type')).toBe(true);
    expect(component.equipmentUpdateForm.contains('files')).toBe(true);


    expect(component.equipmentUpdateForm.value.name).toBe(component.currentEquipment.name);
    expect(component.equipmentUpdateForm.value.equipment_type).toBe(component.currentEquipment.equipment_type);
    expect(component.equipmentUpdateForm.value.files).toBe(component.currentEquipment.files);
  });
});
