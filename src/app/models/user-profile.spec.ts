import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  it('US2_A4 - should create an instance', () => {
    expect(new UserProfile(1, 'test', 'test', 'test', 'test', 'test', 0, false))
    .toBeTruthy();
  });
});
