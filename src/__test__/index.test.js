/* eslint-disable global-require */
/* eslint-disable no-undef */
import 'jest-dom/extend-expect';

jest.mock('react-dom', () => ({ render: jest.fn() }));

it('test', () => {
  require('../index');
});
