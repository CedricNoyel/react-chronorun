import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import './App.css';
import 'typeface-roboto';
import { withUser } from "./store/AppProvider";
import TableVisualiseParticipants from "./TableVisualiseParticipants";

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
});

class PageVisualiseParticipants extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Paper fullWidth className={classes.paper}>
                            <Typography variant="h5">Visualiser les participants</Typography>
                            <TableVisualiseParticipants/>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withUser(withStyles(styles)(PageVisualiseParticipants));

