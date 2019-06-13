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
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={8}>
                            <Typography variant="h5">Arrivée des participants</Typography>
                            <Paper className={classes.paper}>
                                {this.props.inputsFormEnd.map((row, index) => {
                                    return <FormEndRace inputid={row.id}/>
                                })}
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                        <Typography variant="h5">Historique</Typography>
                            <Paper className={classes.paper}>
                                { this.props.histoParticipantEnd.map((row, index) => {
                                    return <p key={"histo-"+index} >Dossard: {row.participant} - Temps: {row.time}</p>
                                })}
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default withUser(withStyles(styles)(Start));

