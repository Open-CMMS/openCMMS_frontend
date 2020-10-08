import { Equipment } from './equipment';

describe('Equipment', () => {
  it('should create an instance', () => {
    expect(new Equipment(1, 'test', 1, [],[])).toBeTruthy();
  });
});
