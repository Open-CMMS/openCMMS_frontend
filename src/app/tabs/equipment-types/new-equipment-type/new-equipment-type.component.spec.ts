import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewEquipmentTypeComponent } from './new-equipment-type.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

describe('NewEquipmentTypeComponent', () => {
  let component: NewEquipmentTypeComponent;
  let fixture: ComponentFixture<NewEquipmentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEquipmentTypeComponent ],
      imports: [ RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, NgbModule, NgMultiSelectDropDownModule ]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(NewEquipmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize a form', () => {
    expect(component.equipmentTypeForm.contains('name')).toBe(true);
  });

});
