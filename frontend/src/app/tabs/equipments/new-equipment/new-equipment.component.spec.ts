import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEquipmentComponent } from './new-equipment.component';

describe('NewEquipmentComponent', () => {
  let component: NewEquipmentComponent;
  let fixture: ComponentFixture<NewEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
