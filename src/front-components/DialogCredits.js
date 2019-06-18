import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';

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

class DialogCredits extends Component {

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
        return (
            <div>
                <Dialog
                    onClose={() => this.closeDialog()}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                >
                    <DialogTitle id="customized-dialog-title" onClose={() => this.closeDialog()}>
                        Crédits
                    </DialogTitle>
                    <DialogContent dividers>
                        <div>
                            <p>Développeurs: Cédric N, Jordan G, Samy LG</p>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export function openDialogCredits() {
    openDialogFn();
}

export default withStyles(styles)(DialogCredits);

