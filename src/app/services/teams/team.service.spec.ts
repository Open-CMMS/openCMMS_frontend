import { TestBed } from '@angular/core/testing';

import { TeamService } from './team.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Team } from 'src/app/models/team';

describe('TeamService', () => {
  let service: TeamService;
  const BASE_URL_API = environment.baseUrl;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ TeamService ],
      imports: [ HttpClientTestingModule ]});

    service = TestBed.inject(TeamService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('US3_A13 - should be created', () => {
    expect(service).toBeTruthy();
    const mockTeams = [
      {
        id: 0,
        name: 'Team 1',
        team_type: 0,
        user_set: [1, 2]
      },
      {
        id: 1,
        name: 'Team 2',
        team_type: 1,
        user_set: []
      }
    ];

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockTeams);
  });

  it('US3_A14 - should verify the parameters and content of the team get action', () => {
    const mockTeams = [
      {
        id: 0,
        name: 'Team 1',
        team_type: 0,
        user_set: [1, 2]
      },
      {
        id: 1,
        name: 'Team 2',
        team_type: 1,
        user_set: []
      }
    ];
    service.getTeams();

    let teams: Team[] = [];
    service.teamSubject.subscribe(
                        (teamsInService: Team[]) => {
                          teams = teamsInService;
                          expect(teams.length).toBe(2);
                          expect(teams[0].id).toBe(0);
                          expect(teams[0].name).toBe('Team 1');
                          expect(teams[0].team_type).toBe(0);
                          expect(teams[0].user_set.length).toBe(2);
                          expect(teams[0].user_set[0]).toBe(1);
                          expect(teams[0].user_set[1]).toBe(2);

                          expect(teams[1].id).toBe(1);
                          expect(teams[1].name).toBe('Team 2');
                          expect(teams[1].user_set.length).toBe(0);
                        });

    const req = httpTestingController.match(BASE_URL_API + '/api/usersmanagement/teams/');
    expect(req[0].request.method).toEqual('GET');
    expect(req[1].request.method).toEqual('GET');
    req[1].flush(mockTeams);
  });

  it('US3_A15 - should verify the parameters and content of the team by id GET request', () => {
    const mockTeam = {
        id: 1,
        name: 'Team 2',
        team_type: 1,
        user_set: []
    };
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/');
    service.getTeam(1).subscribe((team: Team) => {
      expect(team.name).toBe('Team 2');
      expect(team.team_type).toBe(1);
      expect(team.user_set).toEqual([]);
    });

    const req2 = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/1');
    expect(req2.request.method).toEqual('GET');
    req2.flush(mockTeam);
  });

  it('US3_A16 - should verify the creation of a new team', () => {
    const mockTeam = {
        id: 1,
        name: 'Team 2',
        team_type: 1,
        user_set: []
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/');
    const newTeam = new Team(1, 'Team 2', 1, []);
    service.createTeam(newTeam).subscribe(
      team => {
        expect(team.name).toBe('Team 2');
        expect(team.team_type).toBe(1);
        expect(team.user_set).toEqual([]);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/');
    expect(req.request.method).toEqual('POST');
    req.flush(mockTeam);
  });

  it('US3_A17 - should verify the update of a team in database', () => {
    const mockTeam = {
        id: 1,
        name: 'Team 2',
        team_type: 2,
        user_set: []
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/');
    const newTeam = new Team(1, 'Team 2', 2, []);
    service.updateTeam(newTeam.id, newTeam).subscribe(
      team => {
        expect(team.name).toBe('Team 2');
        expect(team.team_type).toBe(2);
        expect(team.user_set).toEqual([]);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/' + newTeam.id);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockTeam);
  });

  it('US3_A18 - should verify the deletion of a team in database', () => {
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/');
    service.deleteTeam(1).subscribe();

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teams/1');
    expect(req.request.method).toEqual('DELETE');
  });
});
