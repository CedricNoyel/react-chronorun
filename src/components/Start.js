import React, { Component } from 'react';
import Link from "react-router-dom";

import Button from '@material-ui/core/Button';
import logo from '../logo.svg';
import './App.css';
import 'typeface-roboto';

class Start extends Component {
    render() {
        return (
            <div>
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React/Electron</h2>
                </div>

                <p className="App-intro">Ligne de départ !!!
                    <Button variant="contained" color="primary">
                        C'est parti !
                    </Button>
                </p>
            </div>
    );
    }
}

export default Start;

