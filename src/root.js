import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './container/reducers';
import Main from './container/Main';

const store = createStore(rootReducer || {}, applyMiddleware());

const RootComponent = () => (
  <Provider store={store}>
    <Main />
  </Provider>
);

export default RootComponent;
