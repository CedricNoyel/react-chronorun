import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import InputAutocompleteParticipantEnd from './InputAutocompleteParticipantEnd';
import { withUser } from "./store/AppProvider";
import Notifier, {openSnackbar} from "./Notifier";

const ipcRenderer = window.require('electron').ipcRenderer;

const styles = theme => ({
    root: {
        margin: theme.spacing(3),
        justifyContent: 'center',
        display: 'flex',
    },
    btnEnd: {
        marginLeft: theme.spacing(3),
    },
});

class FormEndRace extends Component {

    btnEndClicked() {
        let inputid = this.props.inputid;
        let inputValue = this.props.inputsFormEnd[inputid].inputValue;
        if (inputValue.length !== 0) {
            let timestamp = new Date().getTime();
            this.props.addHistoParticipantEnd(inputValue, timestamp);
            ipcRenderer.send('end-add-participant', inputValue, timestamp);
            this.props.setInputFormEnd(inputid, "");
        }
        // CHECK IF PARTICIPAND ALREADY FINISHED AND DISPLAY MSG
        if (this.props.histoParticipantEnd.find( elem => elem.dossard === inputValue) !== undefined) {
            openSnackbar({message: "Le dossard n°" + inputValue + " est déjà arrivé !"}, {type: "warning"});
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.btnEndClicked();
        }
    }

    render() {
        const { classes, inputid } = this.props;
        return (
            <Box
                className={classes.root}
                onKeyDown={this.handleKeyDown}
            >
                <Box>
                    <InputAutocompleteParticipantEnd inputid={inputid}/>
                </Box>
                <Box>
                    <Button className={classes.btnEnd} variant="contained" color="primary" onClick={this.btnEndClicked.bind(this)}>Fin</Button>
                </Box>
                <Notifier/>
            </Box>
        )
    };
}

export default withUser(withStyles(styles)(FormEndRace));
