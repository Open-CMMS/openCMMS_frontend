import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEquipmentTypeComponent } from './new-equipment-type.component';

describe('NewEquipmentTypeComponent', () => {
  let component: NewEquipmentTypeComponent;
  let fixture: ComponentFixture<NewEquipmentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEquipmentTypeComponent ]
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
});
