import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTypeManagementComponent } from './team-type-management.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('TeamTypeManagementComponent', () => {
  let component: TeamTypeManagementComponent;
  let fixture: ComponentFixture<TeamTypeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamTypeManagementComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('US1_A4 - should create', () => {
    expect(component).toBeTruthy();
  });
});
