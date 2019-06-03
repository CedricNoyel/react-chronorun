import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormStartParticipant from './FormStartParticipant';
import './App.css';
import 'typeface-roboto';
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(2),
        marginTop: theme.spacing(3),
    },
    paper: {
        marginTop: theme.spacing(2),
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
                    <Grid container justify="center" alignItems="center" direction="row">
                        <Grid item xs={12}>
                            <Typography variant="h5">Départ des participants</Typography>
                            <Paper className={classes.paper}>
                                <FormStartParticipant />

                            </Paper>
                            <Paper className={classes.paper}>
                                <Typography variant="caption" display="block" gutterBottom>
                                    * Plusieurs participants partants en même temps seront assignés à la même équipe
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    * Un participant seul ne sera assigné à aucune équipe
                                </Typography>
                            </Paper>
                        </Grid>
                        {/*
                        <Grid item xs={10}>
                            <Paper className={classes.paper}>
                                <FormStartTeam/>
                            </Paper>
                        </Grid>
                        */}
                    </Grid>
                </div>

            </div>
    );
    }
}

export default withStyles(styles)(Start);

