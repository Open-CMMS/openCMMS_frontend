import { TestBed } from '@angular/core/testing';

import { TeamTypeService } from './team-type.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('TeamTypeService', () => {
  let service: TeamTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeamTypeService]
    });
    service = TestBed.inject(TeamTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
