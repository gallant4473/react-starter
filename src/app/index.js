import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-hot-loader/patch';

import Root from './root';
import '../../public/styles/main.scss';

const render = (Component) => {
  ReactDOM.render(<AppContainer><Component /></AppContainer>, document.getElementById('app'));
};

render(Root);

if (module.hot) {
  module
    .hot
    .accept('./root', () => {
      render(Root);
    });
}
