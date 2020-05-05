import { TaskType } from './task-type';

describe('TaskType', () => {
  it('should create an instance', () => {
    expect(new TaskType(0, 'Test', [1, 2], [1, 2])).toBeTruthy();
  });
});
