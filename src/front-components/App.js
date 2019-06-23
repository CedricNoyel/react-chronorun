import React, { Component } from 'react';
import './App.css';
import AppProvider from './store/AppProvider';
import MenuBar from "./MenuBar";
import Titlebar from 'react-electron-titlebar';

class App extends Component {

    render() {
        return (
            <AppProvider>
                <div className="App">
                    <Titlebar text="App Title" backgroundColor="#FF0000"/>
                        <MenuBar/>
                </div>
            </AppProvider>
        );
  }
}

export default App;
