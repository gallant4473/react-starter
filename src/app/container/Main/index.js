import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'

const HomePage = Loadable({
  loader: () => import('../Home'),
  loading() {
    return <div>Loading...</div>
  }
})

const AboutPage = Loadable({
  loader: () => import('../About'),
  loading() {
    return <div>Loading...</div>
  }
})

const ContactPage = Loadable({
  loader: () => import('../Contact'),
  loading() {
    return <div>Loading...</div>
  }
})

class Main extends Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/about/1' component={AboutPage} />
          <Route exact path='/contact' component={ContactPage} />
        </Switch>
      </Router>
    )
  }
}

export default Main
