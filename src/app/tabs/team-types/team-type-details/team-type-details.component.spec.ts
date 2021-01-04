import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TeamTypeDetailsComponent } from './team-type-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('TeamTypeDetailsComponent', () => {
  let component: TeamTypeDetailsComponent;
  let fixture: ComponentFixture<TeamTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamTypeDetailsComponent ],
      imports: [ RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('US1_A3 - should create', () => {
    expect(component).toBeTruthy();
  });
});
