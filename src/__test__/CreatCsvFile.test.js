/* eslint-disable no-undef */
import createCsvFile from '../public/CreateCsvFile';

it('test createCsvFile', () => {
  const testFn = jest.fn(createCsvFile);

  testFn([]);
  expect(testFn).toHaveReturnedWith('');

  testFn('');
  expect(testFn).toHaveReturnedWith('');

  testFn({});
  expect(testFn).toHaveReturnedWith('');

  testFn();
  expect(testFn).toHaveReturnedWith('');

  const createObjectURL = jest.fn(() => 'isBlobReturn');
  global.URL.createObjectURL = createObjectURL;


  testFn([['標題'], ['測試']]);
  expect(testFn).toHaveReturnedWith('isBlobReturn');
});
