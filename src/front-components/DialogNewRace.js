import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Notifier, {openSnackbar} from './Notifier';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

const ipcRenderer = window.require('electron').ipcRenderer;

const styles = theme => ({
    leftIcon: {
        margin: 10,
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
            selectedFile: null,
            open: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onUploadParticipants = this.onUploadParticipants.bind(this);
    }

    componentDidMount() {
        openNewRaceFn = this.openNewRace;
    }

    openNewRace = () => {
        this.setState({open:true});
    };

    onUploadParticipants(e) {
        this.setState({
            selectedFile: e.target.files[0]
        });
        ipcRenderer.on('import-participants-reply', () => {
            openSnackbar({message: 'Les participants ont étés importés avec succès !'}, {type: 'success'})
        });
        ipcRenderer.send('import-participants-request', this.state.selectedFile);
    }

    handleClick() {
        ipcRenderer.on('dl-template-reply', () => {
            openSnackbar({message: 'Fichier téléchargé ! Vous pouvez le retrouver dans vos téléchargements'}, {type: 'success'});
        });
        ipcRenderer.send('dl-template-request');
    }

    handleClose() {
        this.setState({open:false});
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
                            <label htmlFor="input-file" className={classes.btnImport}>
                                <Button variant="contained" component="span">
                                    <CloudUploadIcon className={classes.leftIcon}/>
                                    Charger le fichier des participants
                                </Button>
                            </label>
                            <p>Pour obtenir le template du fichier, <a href="#" onClick={this.handleClick}>cliquez ici</a></p>
                        </div>
                    </DialogContent>
                <Notifier />
                </Dialog>
            </div>
    );
    }
}

export function openNewRace() {
    openNewRaceFn();
}

export default withStyles(styles)(DialogNewRace);

