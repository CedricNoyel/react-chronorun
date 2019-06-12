import React, { Component } from 'react';
import './App.css';
import 'typeface-roboto';

import AppProvider from './store/AppProvider';
import MenuBar from "./MenuBar";

class App extends Component {
    render() {
    return (
        <AppProvider>
            <div className="App">
                <MenuBar/>
            </div>
        </AppProvider>
    );
  }
}

export default App;
