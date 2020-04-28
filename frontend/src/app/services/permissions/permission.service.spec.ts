import { TestBed } from '@angular/core/testing';
import { PermissionService } from './permission.service';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PermissionService', () => {
  let permissionService: PermissionService;
  const BASE_URL_API = environment.baseUrl;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PermissionService ],
      imports: [ HttpClientTestingModule ]
    });
    permissionService = TestBed.inject(PermissionService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(permissionService).toBeTruthy();
  });

  it('should verify the parameters and content of the permission call', () => {
    const mockPerms = [
      {
        "name": "Can add log entry",
        "content_type": {
            "app_label": "admin",
            "model": "logentry",
            "name": "log entry"
        },
        "codename": "add_logentry"
      },
      {  
        "name": "Can change log entry",
        "content_type": {
            "app_label": "admin",
            "model": "logentry",
            "name": "log entry"
        },
        "codename": "change_logentry"
      }
      ]
    permissionService.getPermissions()
      .subscribe(perms => {
         expect(perms[0].name).toBe("Can add log entry");
         expect(perms[1].name).toBe("Can change log entry");
         expect(perms[0].content_type.model).toBe("logentry");
         expect(perms[0].codename).toBe("add_logentry");
      });
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/perms/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockPerms);



  });
  it('should verify the parameters and content of the permission id call', () => {
    const mockPerm = 
      {
        "id": 1,
        "name": "Can add log entry",
        "content_type": {
            "app_label": "admin",
            "model": "logentry",
            "name": "log entry"
        },
        "codename": "add_logentry"
      };
      
    permissionService.getPermission(1)
      .subscribe(perm => {
         expect(perm.name).toBe("Can add log entry");
         expect(perm.content_type.model).toBe("logentry");
         expect(perm.codename).toBe("add_logentry");
      });
    const req = httpTestingController.expectOne(BASE_URL_API + '/api/usersmanagement/perms/'+'1'+'/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockPerm);



  });
});
