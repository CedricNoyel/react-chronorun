import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import FormEndRace from './FormEndRace';
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
                        <Grid item xs={12}>
                            <Typography variant="h5">Arrivée des participants</Typography>
                            <Paper className={classes.paper}>
                                <FormEndRace />
                                <FormEndRace />
                                <FormEndRace />
                                <FormEndRace />
                                <FormEndRace />
                            </Paper>
                        </Grid>
                    </Grid>
                </div>

            </div>
        );
    }
}

export default withStyles(styles)(Start);

