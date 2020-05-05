import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTypeDetailsComponent } from './equipment-type-details.component';

describe('EquipmentTypeDetailsComponent', () => {
  let component: EquipmentTypeDetailsComponent;
  let fixture: ComponentFixture<EquipmentTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentTypeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
