import React from 'react';
import ReactDOM from 'react-dom';
import { Route, NavLink } from "react-router";
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Studio from './pages/Studio/Studio.js';
import Member from './pages/Member/Member.js'
import routes from './routes.js';

ReactDOM.render(
  <div>
    <BrowserRouter routes={routes}>
      <App />
    </BrowserRouter>
  </div>,
  document.getElementById('root')
);
registerServiceWorker();
