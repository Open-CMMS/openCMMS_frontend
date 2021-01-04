import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';

import { NewTeamTypeComponent } from './new-team-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

describe('NewTeamTypeComponent', () => {
  let component: NewTeamTypeComponent;
  let fixture: ComponentFixture<NewTeamTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTeamTypeComponent ],
      imports: [ RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, NgMultiSelectDropDownModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTeamTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('US1_A2 - should create', () => {
    expect(component).toBeTruthy();
  });
});
