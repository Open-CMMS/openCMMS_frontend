import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTypeDetailsComponent } from './equipment-type-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';


describe('EquipmentTypeDetailsComponent', () => {
  let component: EquipmentTypeDetailsComponent;
  let fixture: ComponentFixture<EquipmentTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentTypeDetailsComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('US4_A29 - should create', () => {
    expect(component).toBeTruthy();
  });
});
