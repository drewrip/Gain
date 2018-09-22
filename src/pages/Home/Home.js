import React, { Component } from "react";
import { Route, Link, BrowserRouter, Router } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link exact to="/studio">Create</Link></li>
          <li><Link exact to="/member">Join</Link></li>
        </ul>
      </div>
    );
  }
}

export default Home;
