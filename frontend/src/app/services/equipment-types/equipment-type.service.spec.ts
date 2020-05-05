import { TestBed } from '@angular/core/testing';

import { EquipmentTypeService } from './equipment-type.service';

describe('EquipmentTypeService', () => {
  let service: EquipmentTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
