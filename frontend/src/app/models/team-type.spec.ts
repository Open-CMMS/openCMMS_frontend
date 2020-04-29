import { TeamType } from './team-type';

describe('TeamType', () => {
  it('should create an instance', () => {
    expect(new TeamType(0, 'Test', [1, 2], [1, 2])).toBeTruthy();
  });
});
