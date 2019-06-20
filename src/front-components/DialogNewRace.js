import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Check from '@material-ui/icons/Check';
import DialogConfirmImport, {openDialogConfirmImport} from './DialogConfirmImport';
import Notifier, {openSnackbar} from "./Notifier";
import {withUser} from "./store/AppProvider";

const ipcRenderer = window.require('electron').ipcRenderer;

const styles = theme => ({
    leftIcon: {
        margin: 10,
    },
    validateIcon: {
        margin: 10,
        padding: 15,
    },
    hiddenInput: {
        display: 'none',
    },
    container: {
        textAlign: 'center',
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    label: {
        marginBottom: theme.spacing(2),
    }
});

let openNewRaceFn;

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

class DialogNewRace extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            import: true,
            filePath: null,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.openDialogConfirmation = this.openDialogConfirmation.bind(this);
        this.onUploadParticipants = this.onUploadParticipants.bind(this);
    }

    componentDidMount() {
        openNewRaceFn = this.openNewRace;
    }

    openNewRace = () => {
        this.setState({open:true});
    };

    onUploadParticipants(e) {
        let filePath = e.target.files[0].path;
        this.setState({filePath:filePath});

        if(filePath !== null && filePath.length > 0) {
            this.setState({import: false});
        }
    }

    importParticipants = (res) => {
        if(res){
            ipcRenderer.on('import-participants-reply', (event, res, participants) => {
                if(res) {
                    let liste = JSON.stringify(participants);
                    liste = liste.replace(/\"lastname\":/g, "\"nom\":");
                    liste = liste.replace(/\"firstname\":/g, "\"prenom\":");
                    this.props.setListeParticipants(JSON.parse(liste));
                    this.props.setListeHistoStart([]);
                    this.props.setListeHistoEnd([]);
                    openSnackbar({message: 'Les participants ont étés importés avec succès !'}, {type: 'success'});
                }else {
                    openSnackbar({message: 'Certains participants n\'ont pas pu être ajouté car le fichier comporte des erreurs'}, {type: 'warning'});

                }
                this.setState({import: true});
            });
            ipcRenderer.send('import-participants-request', this.state.filePath);
        }
    };

    openDialogConfirmation() {
        openDialogConfirmImport();
    }

    handleClick() {
        ipcRenderer.on('dl-template-reply', () => {
            openSnackbar({message: 'Fichier téléchargé ! Vous pouvez le retrouver dans vos téléchargements'}, {type: 'success'});
        });
        ipcRenderer.send('dl-template-request');
    }

    handleClose() {
        this.setState({open:false, import:true});
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        Nouvelle course
                    </DialogTitle>
                    <DialogContent dividers>
                        <div className={classes.container}>
                            <div className={classes.label}>
                                Pour créer une nouvelle course importez la liste des participants :
                            </div>
                            <input
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                className={classes.hiddenInput}
                                id="input-file"
                                type="file"
                                onChange={this.onUploadParticipants}
                            />
                            <label htmlFor="input-file">
                                <Button variant="contained" component="span">
                                    <CloudUploadIcon className={classes.leftIcon}/>
                                    Charger le fichier des participants
                                </Button>
                            </label>
                            <Button variant="contained" component="span" className={classes.validateIcon} disabled={this.state.import} onClick={this.openDialogConfirmation}>
                                <Check/>
                            </Button>
                            <p>Pour obtenir le template du fichier, <a href="#" onClick={this.handleClick}>cliquez ici</a></p>
                        </div>
                    </DialogContent>
                    <DialogConfirmImport importReturn={this.importParticipants.bind(this)}/>
                    <Notifier/>
                </Dialog>
            </div>
    );
    }
}

export function openNewRace() {
    openNewRaceFn();
}

export default withUser(withStyles(styles)(DialogNewRace));

