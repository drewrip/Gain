import React, { Component } from 'react';
import { Route, Link, BrowserRouter, Switch, browserHistory, IndexRoute } from "react-router";
import Studio from "./pages/Studio/Studio.js";
import Member from "./pages/Member/Member.js";
import App from "./App.js";
import Home from "./pages/Home/Home.js";
import './App.css';

export default (
  <div>
    <Route exact path="/" component={Home} />
    <Route exact path='/studio' component={Studio} />
    <Route exact path='/member' component={Member} />
    <Route path='*' component={App} />
  </div>
);
