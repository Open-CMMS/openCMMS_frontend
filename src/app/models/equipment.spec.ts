import { Equipment } from './equipment';

describe('Equipment', () => {
  it('US4_A9 - should create an instance', () => {
    expect(new Equipment(1, 'test', 1, [], [])).toBeTruthy();
  });
});
