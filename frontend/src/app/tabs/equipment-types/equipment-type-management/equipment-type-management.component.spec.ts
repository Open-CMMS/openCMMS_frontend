import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTypeManagementComponent } from './equipment-type-management.component';

describe('EquipmentTypeManagementComponent', () => {
  let component: EquipmentTypeManagementComponent;
  let fixture: ComponentFixture<EquipmentTypeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentTypeManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
