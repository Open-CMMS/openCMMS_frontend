import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NewTeamComponent } from './new-team.component';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

describe('NewTeamComponent', () => {
  let component: NewTeamComponent;
  let fixture: ComponentFixture<NewTeamComponent>;
  let httpTestingController: HttpTestingController;
  const BASE_URL_API = environment.baseUrl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTeamComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize a form', () => {
    component.initForm();
    expect(component.createForm.contains('teamName')).toBe(true);
    expect(component.createForm.contains('teamName')).toBe(true);
    expect(component.createForm.contains('users')).toBe(true);
  });

  it('should call thye creation method of Team', () => {
    component.onCreateTeam();

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    const req = httpTestingController.match(BASE_URL_API + '/api/usersmanagement/teams/');
    expect(req[1].request.method).toBe('POST');
    httpTestingController.verify();
  });
});
