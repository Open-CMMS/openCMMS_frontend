import { TestBed } from '@angular/core/testing';

import { JwtInterceptorService } from './jwt-interceptor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('JwtInterceptorService', () => {
  let service: JwtInterceptorService;
  const BASE_URL_API = environment.baseUrl;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ JwtInterceptorService ],
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(JwtInterceptorService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
