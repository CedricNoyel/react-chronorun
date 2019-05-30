import React, { Component } from 'react';
import { HashRouter, Route } from "react-router-dom";
import Home from './Home';
import Start from './Start'

class Routeur extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <Route path="/" exact component={ Home } />
                    <Route path="/start" exact component={ Start } />
                </div>
            </HashRouter>
        );
    }
}

export default Routeur;
