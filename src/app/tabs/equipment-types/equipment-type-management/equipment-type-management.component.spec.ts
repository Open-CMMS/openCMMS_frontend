import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTypeManagementComponent } from './equipment-type-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EquipmentTypeManagementComponent', () => {
  let component: EquipmentTypeManagementComponent;
  let fixture: ComponentFixture<EquipmentTypeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentTypeManagementComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('US4_A30 - should create', () => {
    expect(component).toBeTruthy();
  });
});
