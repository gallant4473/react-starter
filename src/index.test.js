import { shallow } from 'enzyme';
import React from 'react';
import RootComponent from './root';

let setup;
beforeEach(() => {
  setup = shallow(<RootComponent />);
});
test('shallow render', () => {
  expect(setup.length).toBeGreaterThan(0);
});
