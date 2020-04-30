import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { UserProfile } from 'src/app/models/user-profile';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('AuthenticationService', () => {
  const BASE_URL_API = environment.baseUrl;
  let authenticationService: AuthenticationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AuthenticationService ],
      imports: [ HttpClientTestingModule ]
    });
    authenticationService = TestBed.inject(AuthenticationService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });

  it('should verify the parameters and result of the login call', () => {
    const mockUser =
      new UserProfile(2, 'hmaricato', 'hugo', '', 'hugo.simoes_maricato@insa-rouen.fr',
      '!fmEy1YLWGsoWhQ4TgYb3LRqwUGbQwHaFiJFam8jf', 0, true);
    authenticationService.login('hmaricato', '!fmEy1YLWGsoWhQ4TgYb3LRqwUGbQwHaFiJFam8jf')
      .then((user: UserProfile)  => {
         expect(user.username).toBe('hmaricato');
         expect(user.id).toBe(2);
         expect(user.last_name).toBe('');
         expect(user.first_name).toBe('hugo');
      });
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/login');
    expect(req.request.method).toEqual('POST');
    req.flush(mockUser);
  });
  // it('should verify the parameters of the logout call', () => {
  //   authenticationService.logout();
  //   const authSpy = spyOn(authenticationService, 'logout');
  //   expect(authenticationService.logout).toHaveBeenCalled();
  // });
});
