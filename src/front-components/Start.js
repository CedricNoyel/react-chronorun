import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import logo from '../assets/img/logo.svg';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import StartParticipant from './StartParticipant';
import './App.css';
import 'typeface-roboto';

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
    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <form noValidate autoComplete="off">
                                    <p>Participant seul</p>
                                    <StartParticipant/>
                                    <Button variant="contained" color="primary">
                                        Go
                                    </Button>
                                </form>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <p>Equipe</p>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>

            </div>
    );
    }
}

export default withStyles(styles)(Start);

