import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Notifier, {openSnackbar} from './Notifier';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

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

class DialogEditParticipant extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    componentDidMount() {
        openDialogFn = this.openDialog;
    }

    openDialog = () => {
        this.setState({open:true});
    };

    closeDialog = () => {
        this.setState({open:false});
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    onClose={() => this.closeDialog()}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                >
                    <DialogTitle id="customized-dialog-title" onClose={() => this.closeDialog()}>
                        Modifier le participant
                    </DialogTitle>
                    <DialogContent dividers>
                        <div>
                            <TextField
                                id="standard-bare"
                                className={classes.textField}
                                defaultValue={this.props.dossard}
                                margin="normal"
                                inputProps={{ 'aria-label': 'bare' }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}>
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

export function openEditParticipant() {
    openDialogFn();
}

export default withStyles(styles)(DialogEditParticipant);

