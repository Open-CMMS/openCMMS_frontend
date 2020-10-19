import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEquipmentComponent } from './new-equipment.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


describe('NewEquipmentComponent', () => {
  let component: NewEquipmentComponent;
  let fixture: ComponentFixture<NewEquipmentComponent>;
  let httpTestingController: HttpTestingController;
  const BASE_URL_API = environment.baseUrl;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEquipmentComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule]
    })
    .compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    router.initialNavigation();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize a form', () => {
    expect(component.createForm.contains('name')).toBe(true);
    expect(component.createForm.contains('equipmentType')).toBe(true);
    expect(component.createForm.contains('file')).toBe(true);
  });

});
