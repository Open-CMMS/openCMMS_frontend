import { Team } from './team';

describe('Team', () => {
  it('should create an instance', () => {
    expect(new Team(1, 'Test', 2, [3, 4])).toBeTruthy();
  });
});
