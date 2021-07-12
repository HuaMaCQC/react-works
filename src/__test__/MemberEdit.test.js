/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  render,
} from '@testing-library/react';
import 'jest-dom/extend-expect';
import MemberEdit from '../components/member/memberEdit/MemberEdit';

describe('search UI', () => {
  it('test', () => {
    render(<MemberEdit />);
  });
});
