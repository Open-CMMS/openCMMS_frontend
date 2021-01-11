import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TeamsListComponent } from './teams-list.component';
import { Team } from 'src/app/models/team';
import { environment } from 'src/environments/environment';

describe('TeamsListComponent', () => {
  let component: TeamsListComponent;
  let fixture: ComponentFixture<TeamsListComponent>;
  let httpTestingController: HttpTestingController;
  const BASE_URL_API = environment.baseUrl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamsListComponent ],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('US3_A11 - should create', () => {
    expect(component).toBeTruthy();
  });

  it('US3_A12 - should delete a team from the list', () => {
    const team = new Team(1, 'Test', 2, []);
    component.onDeleteTeam(team);
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/');
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/1');
    expect(req.request.method).toBe('DELETE');
    httpTestingController.verify();
  });
});
