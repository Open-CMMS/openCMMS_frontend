import { TestBed } from '@angular/core/testing';

import { TeamTypeService } from './team-type.service';

describe('TeamTypeService', () => {
  let service: TeamTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
