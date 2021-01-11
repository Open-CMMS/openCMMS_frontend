import { Team } from './team';

describe('Team', () => {
  it('US3_A1 - should create an instance', () => {
    expect(new Team(1, 'Test', 2, [3, 4])).toBeTruthy();
  });
});
