import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentManagementComponent } from './equipment-management.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EquipmentManagementComponent', () => {
  let component: EquipmentManagementComponent;
  let fixture: ComponentFixture<EquipmentManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentManagementComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('US4_A18 - should create', () => {
    expect(component).toBeTruthy();
  });
});
