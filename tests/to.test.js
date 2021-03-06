/* globals test, expect */
const { toBinary, toHex } = require('../to');

const one8 = '11111111';
const hex8 = 'FF';

test('-1 binary', () => {
  expect(toBinary(-1, 8)).toBe(one8);
  expect(toBinary(-1, 16)).toBe(one8.repeat(2));
  expect(toBinary(-1, 32)).toBe(one8.repeat(4));
});

test('-123', () => {
  expect(toBinary(-128, 8)).toBe('10000000');
  expect(toHex(-128, 8)).toBe('80');
});

test('limits', () => {
  expect(toHex(0xfffff, 8)).toBe('FFFF');
});

test('-1 hex', () => {
  expect(toHex(-1, 8)).toBe(hex8);
  expect(toHex(-1, 16)).toBe(hex8.repeat(2));
  expect(toHex(-1, 32)).toBe(hex8.repeat(4));
});

test('max + min binary', () => {
  expect(toHex(Number.MAX_SAFE_INTEGER, 8)).toBe(hex8);
  expect(toHex(-1, 16)).toBe(hex8.repeat(2));
  expect(toHex(-1, 32)).toBe(hex8.repeat(4));
});
