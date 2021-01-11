import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTaskComponent } from './new-task.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('NewTaskComponent', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTaskComponent ],
      imports: [ NgbModule, RouterTestingModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, NgMultiSelectDropDownModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('US5_A2 - should create', () => {
    expect(component).toBeTruthy();
  });
});
