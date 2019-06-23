import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

let openDialogConfirmExportFn;

class DialogConfirmImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    componentDidMount() {
        openDialogConfirmExportFn = this.handleClickOpen;
    }

    handleClickOpen = () => {
        this.setState({open:true});
    };

    handleClose = (accepted) => {
        this.props.importReturn(accepted);
        this.setState({open:false});
    };

    render() {
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    onClose={() => this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Etes-vous sur de vouloir commencer une nouvelle course ?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Commencer une nouvelle course supprimera les résultats de l'ancienne course. Attention cette action est irréversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose(false)} color="primary">
                            Non
                        </Button>
                        <Button onClick={() => this.handleClose(true)} color="primary" autoFocus>
                            Oui
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export function openDialogConfirmImport() {
    openDialogConfirmExportFn();
}

export default DialogConfirmImport;


