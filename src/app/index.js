import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import 'react-hot-loader/patch'

import Main from './container/Main'
import '../assets/styles/index.scss'

const render = (Component) => {
  ReactDOM.render(<AppContainer><Component /></AppContainer>, document.getElementById('app'))
}

render(Main)

if (module.hot) {
  module
    .hot
    .accept('./container/Main', () => {
      render(Main)
    })
}
