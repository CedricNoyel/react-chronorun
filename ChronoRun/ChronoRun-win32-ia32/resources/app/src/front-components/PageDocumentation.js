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
                            </Paper>
                            <Paper fullWidth className={classes.paper}>
                                <Typography variant="h5">Avant la course</Typography>
                                <Typography variant="body1">
                                    <b>Créer une nouvelle course :</b> Dans le menu, cliquez sur "Nouvelle course" (la course précédente sera effacée)
                                    <br/><b>2. Télécharger le template :</b> un lien est disponible sous le bouton d'import
                                    <br/><b>3. Remplir le template</b>
                                    <br/><b>4. Uploader les participants :</b> Cliquez sur le bouton "Charger le fichier des participants"
                                </Typography>
                            </Paper>
                            <Paper fullWidth className={classes.paper}>
                                <Typography variant="h5">Pendant la course</Typography>
                                <Typography variant="body1">
                                    <b>1. Départ d'un participant :</b> recherchez le participant via le champs de saisie et cliquez sur "GO"
                                    <br/><b>2. Départ d'une équipe :</b> même principe que précédement, entrez plusieurs participants dans le champ de saisie
                                    <br/><b>Ajout de participant :</b> l'ajout d'un participant en course se fait via le menu "Ajout participant"
                                    <br/><b>Arrivé de participant :</b> Ouvrez l'onglet "Arrivée", entrez le numéro de dossard et cliquer sur le boutton "FIN" lorsque le participant arrive
                                </Typography>
                            </Paper>
                            <Paper fullWidth className={classes.paper}>
                                <Typography variant="h5">Après la course</Typography>
                                <Typography variant="body1">
                                    <b>1. Un ordinateur :</b> Cliquez sur "EXPORTER LES RESULTATS", le fichier est telechargé dans le répertoire téléchargement de votre ordinateur
                                    <br /><b>2. Deux ordinateurs :</b> Vous devez importer les données manquantes. Si vous etiez au départ, vous devez importer le fichier d'arrivées et vice-versa.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(PageDocumentation);

