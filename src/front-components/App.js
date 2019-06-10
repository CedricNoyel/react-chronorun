import React, { Component } from 'react';
import './App.css';
import Titlebar from 'react-electron-titlebar';
import 'typeface-roboto';
import MenuBar from "./MenuBar";

import AppProvider from './store/AppProvider';

class App extends Component {
  render() {
    return (
        <AppProvider>
              <div className="App">
                  <Titlebar text="App Title" backgroundColor="#000000" />
                  <div>
                      <MenuBar/>
                  </div>
              </div>
        </AppProvider>
    );
  }
}

export default App;
