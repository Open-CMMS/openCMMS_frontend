import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';


import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserProfile } from 'src/app/models/user-profile';

describe('UserService', () => {
  const BASE_URL_API = environment.baseUrl;
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ UserService ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    const mockUsers = [
      {
          id: 2,
          username: 'jmarie',
          first_name: 'Joran',
          last_name: 'Marie',
          email: 'joran.marie2@insa-rouen.fr',
          password: 'pbkdf2_sha256$180000$9rJ0klyN3tbv$Nsn6jDDiCbWo5TaIJDALhe49eVKeRMlztrRkss0q/Eo=',
          nb_tries: 0,
          is_active: false
      },
      {
          id: 3,
          username: 'hmaricato',
          first_name: 'Hugo',
          last_name: 'Maricato',
          email: 'hugo.maricato@insa-rouen.fr',
          password: 'pbkdf2_sha256$180000$3z7mTh3cm86A$X54aJoJJGnroNdBElFxP5hVCaFJSZGEYRvFuxMvuij0=',
          nb_tries: 0,
          is_active: false
      }
  ];

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockUsers);
  });

  it('returnd Observable should match the right data', () => {
    const mockUsers = [
      {
          id: 2,
          username: 'jmarie',
          first_name: 'Joran',
          last_name: 'Marie',
          email: 'joran.marie2@insa-rouen.fr',
          password: 'pbkdf2_sha256$180000$9rJ0klyN3tbv$Nsn6jDDiCbWo5TaIJDALhe49eVKeRMlztrRkss0q/Eo=',
          nb_tries: 0,
          is_active: false
      },
      {
          id: 3,
          username: 'hmaricato',
          first_name: 'Hugo',
          last_name: 'Maricato',
          email: 'hugo.maricato@insa-rouen.fr',
          password: 'pbkdf2_sha256$180000$3z7mTh3cm86A$X54aJoJJGnroNdBElFxP5hVCaFJSZGEYRvFuxMvuij0=',
          nb_tries: 0,
          is_active: false
      }
  ];

    service.getUsers();

    let users: UserProfile[] = [];
    service.usersSubject.subscribe((usersRegistered: UserProfile[]) => {
      users = usersRegistered;
      expect(users.length).toBe(2);
      expect(users[0].id).toEqual(2);
      expect(users[0].last_name).toEqual('Marie');
      expect(users[0].first_name).toEqual('Joran');
      expect(users[0].username).toEqual('jmarie');
      expect(users[0].email).toEqual('joran.marie2@insa-rouen.fr');
      expect(users[0].nb_tries).toEqual(0);
      expect(users[0].is_active).toEqual(false);
      expect(users[1].id).toEqual(3);
      expect(users[1].last_name).toEqual('Maricato');
      expect(users[1].first_name).toEqual('Hugo');
      expect(users[1].username).toEqual('hmaricato');
      expect(users[1].email).toEqual('hugo.maricato@insa-rouen.fr');
      expect(users[1].nb_tries).toEqual(0);
      expect(users[1].is_active).toEqual(false);
    });

    const req = httpTestingController.match(BASE_URL_API + '/api/usersmanagement/users/');

    expect(req[0].request.method).toEqual('GET');
    expect(req[1].request.method).toEqual('GET');

    req[1].flush(mockUsers);

  });

  it('returned UserProfile should match the right data of getUser()', () => {
    const mockUser = {
      id: 3,
      username: 'hmaricato',
      first_name: 'Hugo',
      last_name: 'Maricato',
      email: 'hugo.maricato@insa-rouen.fr',
      password: 'pbkdf2_sha256$180000$3z7mTh3cm86A$X54aJoJJGnroNdBElFxP5hVCaFJSZGEYRvFuxMvuij0=',
      nb_tries: 0,
      is_active: false
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/');
    service.getUser(3).subscribe((user: UserProfile) => {
      expect(user.id).toEqual(3);
      expect(user.last_name).toEqual('Maricato');
      expect(user.first_name).toEqual('Hugo');
      expect(user.username).toEqual('hmaricato');
      expect(user.email).toEqual('hugo.maricato@insa-rouen.fr');
      expect(user.nb_tries).toEqual(0);
      expect(user.is_active).toEqual(false);
    });

    const req2 = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/3/');

    expect(req2.request.method).toEqual('GET');

    req2.flush(mockUser);

  });

  it('returned Observable should match the right data for update', () => {
    const mockUser = {
      id: 3,
      username: 'hmaricato',
      first_name: 'Hugo',
      last_name: 'Maricat',
      email: 'hugo.maricato@insa-rouen.fr',
      password: 'pbkdf2_sha256$180000$3z7mTh3cm86A$X54aJoJJGnroNdBElFxP5hVCaFJSZGEYRvFuxMvuij0=',
      nb_tries: 0,
      is_active: false
    };

    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/');
    service.updateUser(new UserProfile(3,  'hmaricato', 'Hugo', 'Maricat', 'hugo.maricato@insa-rouen.fr',
    'pbkdf2_sha256$180000$3z7mTh3cm86A$X54aJoJJGnroNdBElFxP5hVCaFJSZGEYRvFuxMvuij0=', 0, false))
      .subscribe(userData => {
        expect(userData.username).toEqual('hmaricato');
        expect(userData.first_name).toEqual('Hugo');
        expect(userData.last_name).toEqual('Maricat');
      });
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/3/');

    expect(req.request.method).toEqual('PUT');

    req.flush(mockUser);
  });


  it('returned Observable should match the right data on creating new user', () => {
    const mockUser = {
      id: 0,
      username: 'hmaricato',
      first_name: 'Hugo',
      last_name: 'Maricato',
      email: 'h.m@insa-rouen.fr',
      password: 'test1234',
      nb_tries: 0,
      is_active: false
    };

    service.createUser('hmaricato', 'Maricato', 'Hugo', 'h.m@insa-rouen.fr', 'test1234')
      .subscribe(userData => {
        expect(userData.last_name).toEqual('Maricato');
        expect(userData.first_name).toEqual('Hugo');
        expect(userData.username).toEqual('hmaricato');
        expect(userData.email).toEqual('h.m@insa-rouen.fr');
        expect(userData.nb_tries).toEqual(0);
        expect(userData.is_active).toEqual(false);
      });

    const req = httpTestingController.match(BASE_URL_API + '/api/usersmanagement/users/');

    expect(req[1].request.method).toEqual('POST');

    req[1].flush(mockUser);
  });

  it('returned Observable should match the right data on delete', () => {
    httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/');
    service.deleteUser(1).subscribe();

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/1/');

    expect(req.request.method).toEqual('DELETE');
  });


});
