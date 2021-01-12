import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuardService', () => {
  let service: AuthGuardService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AuthGuardService ],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    });
    service = TestBed.inject(AuthGuardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('US2_A5 - should be created', () => {
    expect(service).toBeTruthy();
  });
});
