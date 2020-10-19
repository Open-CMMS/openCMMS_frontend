import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if a user has a permission', () => {
    const mockUserPerms = [
      'add_userprofile',
      'view_team',
      'change_teamtype'
    ];

    expect(service.isAUserPermission(mockUserPerms, 'add_userprofile')).toBe(true);
    expect(service.isAUserPermission(mockUserPerms, 'add_team')).toBe(false);
  });
});
