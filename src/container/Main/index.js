import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const HomePage = lazy(() => import('../Home'));

const AboutPage = lazy(() => import('../About'));

const ContactPage = lazy(() => import('../Contact'));

const Main = () => (
  <Router>
    <Suspense fallback={<h1>Still Loading…</h1>}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/contact" component={ContactPage} />
      </Switch>
    </Suspense>
  </Router>
);

export default Main;
