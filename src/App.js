import React, { Component } from 'react';
import { Route, Link, BrowserRouter, Switch } from "react-router-dom";
import Studio from "./pages/Studio/Studio.js";
import Member from "./pages/Member/Member.js";
import Home from "./pages/Home/Home.js";
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
          <Route exact={true} path='/' render={() => (
            <div className="App">
              <Home />
            </div>
          )}/>
          <Route exact={true} path='/studio' render={() => (
            <div className="App">
              <Studio />
            </div>
          )}/>
          <Route exact={true} path='/member' render={() => (
            <div className="App">
              <Member />
            </div>
          )}/>
        </div>
    );
  }
}

export default App;
