import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import logo from '../logo.svg';
import './App.css';
import 'typeface-roboto';
import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div>
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React/Electron</h2>
                </div>

                <p className="App-intro">Home page electron!
                    <Link to="/start">Start</Link>
                    <Button variant="contained" color="primary">
                        Home sweet home !
                    </Button>
                </p>
            </div>
    );
    }
}

export default Home;

