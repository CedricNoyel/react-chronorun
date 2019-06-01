import React, { Component } from 'react';
import './App.css';
import Titlebar from 'react-electron-titlebar';
import 'typeface-roboto';
import Routeur from "./Routeur";

class App extends Component {
  render() {
    return (
      <div className="App">
          <Titlebar text="App Title" backgroundColor="#000000"/>
          <Routeur/>
      </div>
    );
  }
}

export default App;
