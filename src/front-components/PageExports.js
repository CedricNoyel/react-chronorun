import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import './App.css';
import 'typeface-roboto';
import {withUser} from "./store/AppProvider";
import {openSnackbar} from "./Notifier";
import {exportResult} from "./Home";

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
    button: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(3),
    },
    uploadBtn: {
        margin: theme.spacing(1),
    },
    hiddenInput: {
        display: 'none',
    },
});

class PageDocumentation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnDownloadDeparts: this.isHistoParticipantStartEmpty(),
            btnDownloadArrivees: this.isHistoParticipantEndEmpty(),
            btnImportDeparts: false,
            fileImportDeparts: "",
            btnImportArrivees: false,
            fileImportArrivees: "",
            btnExportResultsDisabled: this.isFinalExportDisabled(),
        };
    }

    isHistoParticipantStartEmpty(){
        if (this.props.histoParticipantStart.length !== 0) {
            return false;
        }
        return true;
    }

    isHistoParticipantEndEmpty(){
        if (this.props.histoParticipantEnd.length !== 0) {
            return false;
        }
        return true;
    }

    isFinalExportDisabled(){
        if (this.props.histoParticipantEnd.length !== 0 && this.props.histoParticipantStart.length !== 0) {
            return false;
        }
        return true;
    }

    onImportDeparts(e) {
        this.setState({fileImportDeparts: e.target.files[0]});
        console.log(e.target.files[0]);
    }

    onImportArrivees(e) {
        this.setState({fileImportArrivees: e.target.files[0]});
        console.log(e.target.files[0]);
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.root}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="h5">Export des résultats</Typography>
                            </Paper>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h5">Exporter les temps de départ</Typography>
                                        <Button variant="outlined" className={classes.button} disabled={this.state.btnDownloadDeparts}>
                                            Telecharger les départs
                                        </Button>
                                        <Button variant="outlined" className={classes.button} disabled={this.state.btnDownloadArrivees}>
                                            Telecharger les arrivées
                                        </Button>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h5">Obtenir les résultats de la course</Typography>
                                        <div className={classes.uploadBtn}>
                                            <input
                                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                className={classes.hiddenInput}
                                                id="input-file-1"
                                                type="file"
                                                onChange={this.onImportDeparts.bind(this)}
                                            />
                                            <label htmlFor="input-file-1">
                                                <Button variant="outlined" component="span" disabled={this.state.btnImportDeparts}>
                                                    Importer les départs
                                                </Button>
                                            </label>
                                        </div>
                                        <div className={classes.uploadBtn}>
                                            <input
                                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                className={classes.hiddenInput}
                                                id="input-file-2"
                                                type="file"
                                                onChange={this.onImportArrivees.bind(this)}
                                            />
                                            <label htmlFor="input-file-2">
                                                <Button variant="outlined" className={classes.button} component="span" disabled={this.state.btnImportArrivees}>
                                                    Importer les arrivées
                                                </Button>
                                            </label>
                                            <Button variant="outlined" className={classes.button} onClick={exportResult}>
                                                Exporter les résultats
                                            </Button>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default withUser(withStyles(styles)(PageDocumentation));

