import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import './App.css';
import 'typeface-roboto';
import TableVisualiseParticipants from './TableVisualiseParticipants';

import {withUser} from "./store/AppProvider";
const ipcRenderer = window.require('electron').ipcRenderer;

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(0, 2, 2, 2),
    },
    paper: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    container: {
        backgroundColor: '#ecf0f1',
    }
});

class PageVisualiseParticipants extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.root}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="h5">Visualiser les participants</Typography>
                                <TableVisualiseParticipants/>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default withUser(withStyles(styles)(PageVisualiseParticipants));


