import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';


import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UserService', () => {
  const BASE_URL_API = environment.baseUrl;
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ UserService ],
      imports: [ HttpClientTestingModule ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returnd Observable should match the right data', () => {
    const mockUsers = [
      {
          id: 2,
          last_name: 'Marie',
          first_name: 'Joran',
          username: 'jmarie',
          email: 'joran.marie2@insa-rouen.fr',
          password: 'pbkdf2_sha256$180000$9rJ0klyN3tbv$Nsn6jDDiCbWo5TaIJDALhe49eVKeRMlztrRkss0q/Eo=',
          nb_tries: 0,
          is_active: false
      },
      {
          id: 3,
          last_name: 'Maricato',
          first_name: 'Hugo',
          username: 'hmaricato',
          email: 'hugo.maricato@insa-rouen.fr',
          password: 'pbkdf2_sha256$180000$3z7mTh3cm86A$X54aJoJJGnroNdBElFxP5hVCaFJSZGEYRvFuxMvuij0=',
          nb_tries: 0,
          is_active: false
      }
  ];

    service.getUsers()
    .subscribe(users => {
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

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/gestion/users/');

    expect(req.request.method).toEqual('GET');

    req.flush(mockUsers);

  });
});
