import { TestBed } from '@angular/core/testing';

import { GroupTypeService } from './group-type.service';

describe('GroupTypeService', () => {
  let service: GroupTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
