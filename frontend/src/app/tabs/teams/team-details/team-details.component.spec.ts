import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TeamDetailsComponent } from './team-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Team } from 'src/app/models/team';
import { Router } from '@angular/router';
import { TeamType } from 'src/app/models/team-type';
import { UserProfile } from 'src/app/models/user-profile';

describe('TeamDetailsComponent', () => {
  let component: TeamDetailsComponent;
  let fixture: ComponentFixture<TeamDetailsComponent>;
  let httpTestingController: HttpTestingController;
  const BASE_URL_API = environment.baseUrl;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamDetailsComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    router.initialNavigation();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete the team', () => {
    component.team = new Team(1, 'Test', 2, []);
    component.onDeleteTeam();

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/');
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/NaN');
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/1');
    expect(req.request.method).toBe('DELETE');
    httpTestingController.verify();
  });

  it('should update the team', () => {
    component.team = new Team(1, 'Test', 2, []);
    component.teamType = new TeamType(2, 'Test TT', [], []);
    component.initForm();
    component.onModifyTeam();

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/');
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/NaN');
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/1');
    expect(req.request.method).toBe('PUT');
    httpTestingController.verify();
  });

  it('should remove a user from the team', () => {
    component.team = new Team(1, 'Test', 2, []);
    component.teamType = new TeamType(2, 'Test TT', [], []);
    component.initForm();
    component.onRemoveUserFromTeam(new UserProfile(1, 'Maricato', 'Hugo', 'hmaricato', 'h.m@insa-rouen.fr', 'mdp', 2, true));
    
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/');
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/NaN');
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/1');
    expect(req.request.method).toBe('PUT');
    httpTestingController.verify();
  });

  it('should init the forms', () => {
    component.team = new Team(1, 'Test', 2, []);
    component.teamType = new TeamType(2, 'Test TT', [], []);
    component.initForm();
    expect(component.updateForm.contains('teamName')).toBe(true);
    expect(component.updateForm.contains('teamType')).toBe(true);

    expect(component.updateForm.value.teamName).toBe(component.team.name);
    expect(component.updateForm.value.teamType).toBe(component.teamType.id);

    expect(component.addUserForm.contains('users')).toBe(true);
  });
});
