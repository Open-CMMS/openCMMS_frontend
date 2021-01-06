import { Task } from './task';

describe('Task', () => {
  it('US5_A1 - should create an instance', () => {
    expect(new Task(0,
                    'Task',
                    'desc',
                    '2020-09-12',
                    '5m',
                    true,
                    0,
                    [0, 1],
                    [1, 6],
                    true,
                    [1, 4],
                    [2, 3])).toBeTruthy();
  });
});
