import { Field } from './field';

describe('Field', () => {
  it('should create an instance', () => {
    expect(new Field(1,"a field",["value1", "value2"],"a description")).toBeTruthy();
  });
});
