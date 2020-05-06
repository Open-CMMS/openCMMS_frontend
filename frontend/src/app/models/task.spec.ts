import { Task } from './task';

describe('Task', () => {
  it('should create an instance', () => {
    expect(new Task(0,
                    'Task',
                    'desc',
                    'une date',
                    'une duree',
                    true,
                    0,
                    [0, 1],
                    0,
                    [1, 6],
                    true)).toBeTruthy();
  });
});
