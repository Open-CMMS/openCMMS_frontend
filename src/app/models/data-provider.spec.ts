import {DataProvider} from './data-provider';
import {Field} from './field';
import {Equipment} from './equipment';

describe('DataProvider', () => {
  it('should create an instance', () => {
    const equipment_1 = new Equipment(1, 'test', 1, [], []);
    const field_1 = new Field(1, 'a field', ['value1', 'value2'], 'a description');
    expect(new DataProvider(1, 'DP_test', 'test1.py', '10d', true, equipment_1, '192.168.0.4', field_1)).toBeTruthy();
  });
});
