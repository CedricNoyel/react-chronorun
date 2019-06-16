import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {

    },
});

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date().toLocaleTimeString([], {hc:'h24', hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})
        };
    }
    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    tick() {
        this.setState({
            time: new Date().toLocaleTimeString([], {hc:'h24', hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})
        });
    }
    render() {
        return (
            <p className="App-clock">
                {this.state.time}
            </p>
        );
    }
}

export default withStyles(styles)(Clock);
