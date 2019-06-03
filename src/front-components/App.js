import React, { Component } from 'react';
import './App.css';
import Titlebar from 'react-electron-titlebar';
import 'typeface-roboto';
import MenuBar from "./MenuBar";

class App extends Component {
  render() {
    return (
      <div className="App">
          <Titlebar text="App Title" backgroundColor="#000000" />
          <div>
              <MenuBar/>
          </div>
      </div>
    );
  }
}

export default App;
