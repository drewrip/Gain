import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Home from './src/pages/Home';
import Studio from './src/pages/Studio';
import Member from './src/pages/Member'

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

ReactDOM.render(
  <Router history={appHistory} onUpdate={() => window.scrollTo(0, 0)}>
    <Route path="/" component={ Home } />
    <Route path="/studio" component={ Studio } />
    <Route path="/member" component={ Member } />
  </Router>,
  document.getElementById('root'));
registerServiceWorker();
