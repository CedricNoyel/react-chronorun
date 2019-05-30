import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import Titlebar from 'react-electron-titlebar';


class App extends Component {
  render() {
    return (
      <div className="App">
          <Titlebar text="App Title" backgroundColor="#000000"></Titlebar>
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React/Electron</h2>
        </div>
        <p className="App-intro">
          Hello Electron!
        </p>
      </div>
    );
  }
}

export default App;
