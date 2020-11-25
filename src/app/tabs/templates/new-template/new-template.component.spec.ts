import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NewTemplateComponent } from './new-template.component';
import { environment } from 'src/environments/environment';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReactiveFormsModule } from '@angular/forms';

describe('NewTemplateComponent', () => {
  let component: NewTemplateComponent;
  let fixture: ComponentFixture<NewTemplateComponent>;
  let httpTestingController: HttpTestingController;
  const BASE_URL_API = environment.baseUrl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTemplateComponent ],
      imports: [ NgMultiSelectDropDownModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form to create Template (US18_A2)', () => {
    expect(component.createForm.contains('name')).toBe(true);
    expect(component.createForm.contains('description')).toBe(true);
    expect(component.createForm.contains('time')).toBe(true);
    expect(component.createForm.contains('equipment')).toBe(true);
    expect(component.createForm.contains('equipmentType')).toBe(true);
    expect(component.createForm.contains('teams')).toBe(true);
    expect(component.createForm.contains('file')).toBe(true);
  });
});
