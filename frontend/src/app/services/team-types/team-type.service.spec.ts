import { TestBed } from '@angular/core/testing';

import { TeamTypeService } from './team-type.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { TeamType } from 'src/app/models/team-type';

describe('TeamTypeService', () => {
  let service: TeamTypeService;
  const BASE_URL_API = environment.baseUrl;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ TeamTypeService ],
      imports: [ HttpClientTestingModule ]});

    service = TestBed.inject(TeamTypeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    const mockTeamTypes = [
      {
        id: 0,
        name: 'TeamType 1',
        perms: [1, 3],
        team_set: [1, 2]
      },
      {
        id: 1,
        name: 'TeamType 2',
        perms: [3, 4],
        team_set: [3]
      }
    ];

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockTeamTypes);
  });

  it('should verify the parameters and content of the team type get action', () => {
    const mockTeamTypes = [
      {
        id: 0,
        name: 'TeamType 1',
        perms: [1, 3],
        team_set: [1, 2]
      },
      {
        id: 1,
        name: 'TeamType 2',
        perms: [3, 4],
        team_set: [3]
      }
    ];
    service.getTeamTypes();

    let teamTypes: TeamType[] = [];
    service.team_types_subject.subscribe(
                        (teamTypesInService: TeamType[]) => {
                          teamTypes = teamTypesInService;
                          expect(teamTypes.length).toBe(2);
                          expect(teamTypes[0].id).toBe(0);
                          expect(teamTypes[0].name).toBe('TeamType 1');
                          expect(teamTypes[0].perms.length).toBe(2);
                          expect(teamTypes[0].perms[0]).toBe(1);
                          expect(teamTypes[0].perms[1]).toBe(3);
                          expect(teamTypes[0].team_set.length).toBe(2);
                          expect(teamTypes[0].team_set[0]).toBe(1);
                          expect(teamTypes[0].team_set[1]).toBe(2);

                          expect(teamTypes[1].id).toBe(1);
                          expect(teamTypes[1].name).toBe('TeamType 2');
                          expect(teamTypes[1].team_set.length).toBe(1);
                        });

    const req = httpTestingController.match(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    expect(req[0].request.method).toEqual('GET');
    expect(req[1].request.method).toEqual('GET');
    req[1].flush(mockTeamTypes);
  });

  it('should verify the parameters and content of the team type by id GET request', () => {
    const mockTeamType = {
        id: 1,
        name: 'TeamType 1',
        perms: [1, 3],
        team_set: [1, 2]
      };
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    service.getTeamType(1).subscribe((teamType: TeamType) => {
      expect(teamType.name).toBe('TeamType 1');
      expect(teamType.perms.length).toBe(2);
      expect(teamType.perms[0]).toBe(1);
      expect(teamType.perms[1]).toBe(3);
      expect(teamType.team_set.length).toBe(2);
      expect(teamType.team_set[0]).toBe(1);
      expect(teamType.team_set[1]).toBe(2);
    });

    const req2 = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/1/');
    expect(req2.request.method).toEqual('GET');
    req2.flush(mockTeamType);
  });

  it('should verify the creation of a new team type', () => {
    const mockTeamType = {
        id: 1,
        name: 'TeamType 2',
        perms: [1],
        team_set: []
      };

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    const newTeamType = new TeamType(1, 'TeamTytpe 2', [1], []);
    service.createTeamType(newTeamType).subscribe(
      teamType => {
        expect(teamType.name).toBe('TeamType 2');
        expect(teamType.perms.length).toBe(1);
        expect(teamType.perms[0]).toBe(1);
        expect(teamType.team_set).toEqual([]);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    expect(req.request.method).toEqual('POST');
    req.flush(mockTeamType);
  });

  it('should verify the update of a team type in database', () => {
    const mockTeamType = {
        id: 1,
        name: 'TeamType 2',
        perms: [2],
        team_set: []
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    const newTeamType = new TeamType(1, 'TeamType 2', [2], []);
    service.updateTeamType(newTeamType).subscribe(
      teamType => {
        expect(teamType.name).toBe('TeamType 2');
        expect(teamType.perms.length).toBe(1);
        expect(teamType.perms[0]).toBe(2);
        expect(teamType.team_set).toEqual([]);
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/' + newTeamType.id + '/');
    expect(req.request.method).toEqual('PUT');
    req.flush(mockTeamType);
  });

  it('should verify the deletion of a team type in database', () => {
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/');
    service.deleteTeamType(1);

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/teamtypes/1/');
    expect(req.request.method).toEqual('DELETE');
  });
});
