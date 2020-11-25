import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  it('should create an instance', () => {
    expect(new UserProfile(1, 'test', 'test', 'test', 'test', 'test', 0, false))
    .toBeTruthy();
  });
});
