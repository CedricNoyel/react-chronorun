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
import Notifier from "./Notifier";

const ipcRenderer = window.require('electron').ipcRenderer;

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
    sidePaper: {
        height: '250px',
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

        this.exportStartResults = this.exportStartResults.bind(this);
        this.exportEndResults = this.exportEndResults.bind(this);
    }

    refreshClock(){
        ipcRenderer.send('refresh-clock');
    }

    exportStartResults() {
        ipcRenderer.on('dl-start-results-reply', () => {
            openSnackbar({message: 'Fichier des départs téléchargé ! Vous pouvez le retrouver dans vos téléchargements'}, {type: 'success'});
        });
        ipcRenderer.send('dl-start-results-request');
    }

    exportEndResults() {
        ipcRenderer.on('dl-end-results-reply', () => {
            openSnackbar({message: 'Fichier des arrivées téléchargé ! Vous pouvez le retrouver dans vos téléchargements'}, {type: 'success'});
        });
        ipcRenderer.send('dl-end-results-request');
    }

    exportResult() {
        ipcRenderer.send('request-export-csv');
        ipcRenderer.on('reply-export-csv', (event, arg) => {
            if (arg.status === false) {
                openSnackbar({message: 'Le fichier a bien été exporté '}, {type: 'success'});
            }
            openSnackbar({message: 'Fichier des arrivées téléchargé ! Cependant, celui-ci contient des participants avec des données incorrectes'}, {type: 'warning'});
        });
    }

    isHistoParticipantStartEmpty(){
        return this.props.histoParticipantStart.length === 0;
    }

    isHistoParticipantEndEmpty(){
        return this.props.histoParticipantEnd.length === 0;
    }

    isFinalExportDisabled(){
        if (this.props.histoParticipantEnd.length !== 0 && this.props.histoParticipantStart.length !== 0) {
            return false;
        }
        return true;
    }

    onImportDeparts(e) {
        let filePath = e.target.files[0].path;
        ipcRenderer.on('import-start-results-reply', () => {
            openSnackbar({message: 'Fichier des départs importé avec succès !'}, {type: 'success'});
        });
        ipcRenderer.send('import-start-results-request', filePath);
    }

    onImportArrivees(e) {
        let filePath = e.target.files[0].path;
        ipcRenderer.on('import-end-results-reply', () => {
            openSnackbar({message: 'Fichier des arrivées importé avec succès !'}, {type: 'success'});
        });
        ipcRenderer.send('import-end-results-request', filePath);
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
                                    <Paper className={classes.sidePaper}>
                                        <Typography variant="h5">Exporter les temps de départ et d'arrivée vers un autre ordinateur</Typography>
                                        <Button variant="outlined" className={classes.button} disabled={this.state.btnDownloadDeparts} onClick={this.exportStartResults}>
                                            Exporter les départs
                                        </Button>
                                        <br />
                                        <Button variant="outlined" className={classes.button} disabled={this.state.btnDownloadArrivees} onClick={this.exportEndResults}>
                                            Exporter les arrivées
                                        </Button>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper className={classes.sidePaper}>
                                        <Typography variant="h5">Importer les données depuis un autre ordinateur</Typography>
                                        <br />
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
                                                <Button variant="outlined" className={classes.button} component="span" onClick={this.refreshClock}>
                                                    Importer les arrivées
                                                </Button>
                                            </label>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <Typography variant="h5">Obtenir les résultats de la course</Typography>
                                    <Button variant="outlined" className={classes.button} onClick={this.exportResult.bind(this)}>
                                        Télécharger les résultats
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Notifier/>
                </div>
            </div>
        );
    }
}

export default withUser(withStyles(styles)(PageDocumentation));

