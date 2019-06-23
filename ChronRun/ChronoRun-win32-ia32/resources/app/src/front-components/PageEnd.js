import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import FormEndRace from './FormEndRace';
import './App.css';
import 'typeface-roboto';
import { withUser } from "./store/AppProvider";
import TableHistoEnd from "./TableHistoEnd";
import Clock from "./Clock";

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

class Start extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.root}>
                    <Grid container>
                        <Grid item xs={8}>
                            <Paper className={classes.paper}>
                                <Typography variant="h5">Arrivée des participants</Typography>
                                {this.props.inputsFormEnd.map((row, index) => {
                                    return <FormEndRace key={index} inputid={row.id}/>
                                })}
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper className={classes.paper}>
                                <Clock/>
                            </Paper>
                            <Paper className={classes.paper}>
                                <Typography variant="h5">Historique</Typography>
                                <TableHistoEnd/>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default withUser(withStyles(styles)(Start));

