import { EquipmentType } from './equipment-type';

describe('EquipmentType', () => {
  it('US4_A26 - should create an instance', () => {
    expect(new EquipmentType(0, 'Test', [1, 2])).toBeTruthy();
  });
});
