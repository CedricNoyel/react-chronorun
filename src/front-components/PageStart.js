import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import NoSsr from '@material-ui/core/NoSsr';
import './App.css';
import 'typeface-roboto';
import InputStartParticipants from './InputStartParticipants';
import TableHistoStart from './TableHistoStart';
import {withUser} from "./store/AppProvider";

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(0, 2, 2, 2),
    },
    paper: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    container: {
        backgroundColor: '#ecf0f1',
    }
});

class PageStart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
        };
        this.onParticipantStart = this.onParticipantStart.bind(this);
    }



    onParticipantStart() {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.props.inputStartRace.map( (row, index) => {
            this.props.setFirstInput(true);
            this.props.addHistoParticipantStart(row.value, time);
        });
        this.props.setInputStartRace("");
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.root}>
                    <Grid container justify="center" alignItems="center" direction="row">
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="h5">Départ des participants</Typography>
                                <div className={classes.root}>
                                    <NoSsr>
                                        <Box display="flex" flexDirection="row" justifyContent="center">
                                            <InputStartParticipants />
                                            <Button variant="contained" color="primary" onClick={this.onParticipantStart}>
                                                Go
                                            </Button>
                                        </Box>
                                    </NoSsr>
                                </div>

                                <Typography variant="caption" display="block" gutterBottom>
                                    * Plusieurs participants partants en même temps seront assignés à la même équipe
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    * Un participant seul ne sera assigné à aucune équipe
                                </Typography>
                            </Paper>
                            <Paper className={classes.paper}>
                                <Typography variant="h5">Historique des départs</Typography>
                                <TableHistoStart/>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>

            </div>
    );
    }
}

export default withUser(withStyles(styles)(PageStart));

