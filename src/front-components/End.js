import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import FormEndRace from './FormEndRace';
import './App.css';
import 'typeface-roboto';

import { withUser } from "./store/AppProvider";

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(2),
        marginTop: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class Start extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formEndRaces: Array(5).fill( <FormEndRace onClick={this.formSubmitted.bind(this)}/>),
        };
    }

    formSubmitted(inputValue) {
        console.log("FORM SUBMITTED: " + inputValue);
        let date = new Date();
        let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var newArray = this.props.participantEnd.slice();
        newArray.unshift(this.renderHistoLog(this.props.participantEnd.length +1, inputValue, time));
        this.props.setParticipantEnd(newArray);
    }

    renderHistoLog(id, inputValue, timeEnd) {
        return (
            <p value={id}>Dossard: {inputValue} - Temps: {timeEnd}</p>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.root}>
                    <h1>Hello {this.props.name}!</h1>
                    <input type="text" value={this.props.name} onChange={e => this.props.setName(e.target.value)} />
                    <Grid container spacing={3}>
                        <Grid item xs={8}>
                            <Typography variant="h5">Arrivée des participants</Typography>
                            <Paper className={classes.paper}>
                                { this.state.formEndRaces }
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                        <Typography variant="h5">Historique</Typography>
                        <Paper className={classes.paper}>
                            { this.props.participantEnd }
                        </Paper>
                        </Grid>
                    </Grid>
                </div>

            </div>
        );
    }
}

export default withUser(withStyles(styles)(Start));

