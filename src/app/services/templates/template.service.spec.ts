import { TestBed } from '@angular/core/testing';

import { TemplateService } from './template.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Template } from 'src/app/models/template';
import { assert } from 'console';

describe('TemplateService', () => {
  let service: TemplateService;
  const BASE_URL_API = environment.baseUrl;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ TemplateService ],
      imports: [ HttpClientTestingModule ]});

    service = TestBed.inject(TemplateService);
    httpTestingController = TestBed.inject(HttpTestingController);

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/?template=true');
    expect(req.request.method).toEqual('GET');
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('US18_A1 - should be created', () => {
    expect(service).toBeTruthy();
  });

  it('US18_A2 - should add a template to database ', () => {
    const mockTemplate = new Template(1, 'myTemplate');
    service.createTemplate(mockTemplate).subscribe(
        (template) => {
            expect(template.id).toBe(1);
            expect(template.name).toBe('myTemplate');
        }
    );

    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/');
    expect(req.request.method).toBe('POST');
    req.flush(mockTemplate);
  });

  it('US18_A3 - should retrieve templates from database ', () => {
    service.getTemplates();
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/?template=true');
    expect(req.request.method).toEqual('GET');
  });

  it('US18_A4 - should delete a template from database ', () => {
    service.deleteTemplate(1).subscribe();
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/maintenancemanagement/tasks/1/');
    expect(req.request.method).toEqual('DELETE');
  });
});
