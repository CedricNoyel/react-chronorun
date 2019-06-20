import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import './App.css';
import 'typeface-roboto';

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(0, 2, 2, 2),
    },
    container: {
        backgroundColor: '#ecf0f1',
    },
    paper: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class PageDocumentation extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.root}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Paper fullWidth className={classes.paper}>
                                <Typography variant="h5">Guide d'utilisation</Typography>
                                <p>REMPLIR AVEC PLEINS DE BONNES CHOSES</p>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(PageDocumentation);

