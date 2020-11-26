import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileService } from './file.service';

describe('FileService', () => {
  const BASE_URL_API = environment.baseUrl;
  let service: FileService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ FileService ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.inject(FileService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returned Equipment should match the right data of getFile', () => {
    service.getFile(1).subscribe();

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/files/1/');

    expect(req.request.method).toEqual('GET');
  });

  it('returned Observable should match the right data on uploading file', () => {
    service.uploadFile(new FormData()).subscribe();

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/files/');

    expect(req.request.method).toEqual('POST');
  });

  it('returned Observable should match the right data on delete', () => {
    service.deleteFile(1).subscribe();

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/files/1/');

    expect(req.request.method).toEqual('DELETE');
  });
});
