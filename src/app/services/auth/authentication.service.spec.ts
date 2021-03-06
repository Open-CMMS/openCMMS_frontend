import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { UserProfile } from 'src/app/models/user-profile';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthenticationService', () => {
  const BASE_URL_API = environment.baseUrl;
  let authenticationService: AuthenticationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AuthenticationService ],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    });
    authenticationService = TestBed.inject(AuthenticationService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  it('US2_A6 - should be created', () => {
    expect(authenticationService).toBeTruthy();
  });

  it('US2_A7 - should verify the parameters and result of the login call', () => {
    const mockUser =
      new UserProfile(2, 'hmaricato', 'hugo', '', 'hugo.simoes_maricato@insa-rouen.fr',
      '!fmEy1YLWGsoWhQ4TgYb3LRqwUGbQwHaFiJFam8jf', 0, true);
    mockUser.token = 'toto';
    authenticationService.login('hmaricato', '!fmEy1YLWGsoWhQ4TgYb3LRqwUGbQwHaFiJFam8jf')
      .then((user: UserProfile)  => {
        if (user) {
          expect(user.username).toBe('hmaricato');
          expect(user.id).toBe(2);
          expect(user.last_name).toBe('');
          expect(user.first_name).toBe('hugo');
          expect(user.token).toBe('toto');
        }
      });
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/login');
    expect(req.request.method).toEqual('POST');
    req.flush(mockUser);
  });

  it('US2_A8 - should verify get the user\'s permissions ', () => {
    const mockPerms = [
      'add_userprofile',
      'delete_team',
      'change_teamtype'
    ];

    authenticationService.getUserPermissions(2).subscribe(
      (perms) => {
        expect(perms[0]).toBe('add_userprofile');
        expect(perms[1]).toBe('delete_team');
        expect(perms[2]).toBe('change_teamtype');
      }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/users/2/get_user_permissions');
    expect(req.request.method).toEqual('GET');
    req.flush(mockPerms);
  });

  it('US2_A9 - should verify the token for setting password', () => {
    authenticationService.verifyToken('username', 'token').subscribe();
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/check_token');
    expect(req.request.method).toEqual('POST');
  });

  it('US2_A10 - should set a password', () => {
    authenticationService.setPassword('username', 'password', 'token').subscribe();
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/set_password');
    expect(req.request.method).toEqual('POST');
  });

  it('US2_A11 - should send an email to the user (identified with email and username) who forget his password ', () => {
    authenticationService.forgotPassword('jessica.billore@insa-rouen.fr', 'jbillore').subscribe();
    const req = httpTestingController.expectOne(
      BASE_URL_API + '/api/usersmanagement/forget_password?email=jessica.billore@insa-rouen.fr&&username=jbillore');
    expect(req.request.method).toEqual('GET');
  });

  it('US2_A12 - should send an email to the user (identified with email) who forget his password', () => {
    authenticationService.forgotPassword_email('jessica.billore@insa-rouen.fr').subscribe();
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/forget_password?email=jessica.billore@insa-rouen.fr');
    expect(req.request.method).toEqual('GET');
  });

  it('US2_A13 - should send an email to the user (identified with username) who forget his password', () => {
    authenticationService.forgotPassword_username('jbillore').subscribe();
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/forget_password?username=jbillore');
    expect(req.request.method).toEqual('GET');
  });
});
