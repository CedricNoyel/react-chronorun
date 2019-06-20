import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Notifier, {openSnackbar} from './Notifier';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import FormAddParticipant from "./FormAddParticipant";

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

class DialogAddParticipant extends Component {

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

    onParticipantAdd(){
        openSnackbar({message: "Participant ajouté avec succès !"}, {type: "success"});
    }

    render() {
        return (
            <div>
                <Dialog
                    onClose={() => this.closeDialog()}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                    maxWidth={false}
                >
                    <DialogTitle id="customized-dialog-title" onClose={() => this.closeDialog()}>
                        Ajouter un participant
                    </DialogTitle>
                    <DialogContent dividers>
                        <FormAddParticipant onSubmit={this.onParticipantAdd.bind(this)}/>
                    </DialogContent>
                <Notifier />
                </Dialog>
            </div>
        );
    }
}

export function openDialogAddParticipant() {
    openDialogFn();
}

export default withStyles(styles)(DialogAddParticipant);

