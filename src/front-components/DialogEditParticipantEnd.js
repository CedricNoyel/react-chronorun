import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Notifier, {openSnackbar} from './Notifier';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Input from "@material-ui/core/Input";
import Button from '@material-ui/core/Button';
import {withUser} from "./store/AppProvider";

const ipcRenderer = window.require('electron').ipcRenderer;

const styles = theme => ({
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
    input: {
        margin: theme.spacing(1),
    },
});

let openDialogFn;

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

class DialogEditParticipantEnd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            dossard: 0,
            timestamp: 0,
        };
    }

    componentDidMount() {
        openDialogFn = this.openDialog;
    }

    openDialog = (dossard, timestamp) => {
        this.setState({open:true});
        this.setState({dossard: dossard});
        this.setState({timestamp: timestamp});
    };

    closeDialog = () => {
        this.setState({open:false});
    };

    onInputChange(e){
        let newValue = e.target.value;
        if (newValue >= 0 && newValue <= 9999) {
            this.setState({ dossard: newValue });
        }
    }

    onClickEdit(){
        let histoEnd = this.props.histoParticipantEnd;
        let participant = histoEnd.find(row => row.time === this.state.timestamp);
        let index = histoEnd.indexOf(participant);
        histoEnd[index].dossard = this.state.dossard;
        this.props.setListeHistoEnd(histoEnd);
        ipcRenderer.send('end-edit-participant', histoEnd[index].dossard, histoEnd[index].time);
        this.closeDialog()
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.onClickEdit();
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    onKeyDown={this.handleKeyDown}
                    onClose={() => this.closeDialog()}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                >
                    <DialogTitle id="customized-dialog-title" onClose={() => this.closeDialog()}>
                        Modifier le participant
                    </DialogTitle>
                    <DialogContent dividers>
                        <div>
                            <Input
                                value={this.state.dossard}
                                className={classes.input}
                                inputProps={{
                                    'aria-label': '',
                                }}
                                onChange={this.onInputChange.bind(this)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.onClickEdit.bind(this)}>
                                Modifier
                            </Button>
                        </div>
                    </DialogContent>
                    <Notifier />
                </Dialog>
            </div>
        );
    }
}

export function openEditParticipantEnd(dossard, timestamp) {
    openDialogFn(dossard, timestamp);
}

export default withUser(withStyles(styles)(DialogEditParticipantEnd));

