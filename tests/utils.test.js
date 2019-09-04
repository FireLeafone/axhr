import { isArray, isObject, setData, DEFAULT_VALUE } from '../src/utils';

describe('utils', () => {
  it('is array', () => {
    expect(isArray([])).toBeTruthy();
  });
  it('is object', () => {
    expect(isObject({})).toBeTruthy();
  });
  it('params format', () => {
    const params = {
      id: 1,
      name: 'one',
      obj: {age: 10},
      arr: [1]
    };
    const result = 'id=1&name=one&obj=%7B%22age%22%3A10%7D&arr=%5B1%5D';
    expect(setData(params)).toBe(result);
  });
  it('param not object', () => {
    const expected = DEFAULT_VALUE;
    expect(setData('')).toBe(expected);
  });
});
