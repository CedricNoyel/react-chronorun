import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import {withStyles} from "@material-ui/core";
import { withUser } from "./store/AppProvider";
import Button from '@material-ui/core/Button';

const ipcRenderer = window.require('electron').ipcRenderer;

const styles = theme => ({
    container: {
        margin: theme.spacing(3),
        display: 'flex',
        flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
});
const initialState = {
    inputParticipant: "",
    inputName: "",
    inputForname: "",
    inputTeam: "",
};

class FormAddParticipant extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    onInputParticipantChange(e) {
        let newValue = e.target.value;
        if (newValue >= 0 && newValue <= 9999) {
            this.setState({ inputParticipant: newValue});
        }
    }
    onInputNameChange(e) {
        let newValue = e.target.value;
        this.setState({ inputName: newValue});
    }
    onInputFornameChange(e) {
        let newValue = e.target.value;
        this.setState({ inputForname: newValue});
    }
    onInputTeamChange(e) {
        let newValue = e.target.value;
        this.setState({ inputTeam: newValue});
    }
    onFormSubmitted() {
        if (this.state.inputParticipant.length !== 0) {
            if (this.state.inputName.length !== 0) {
                if (this.state.inputForname.length !== 0) {
                    this.setState(initialState);
                    this.props.addParticipant(this.state.inputParticipant, this.state.inputName, this.state.inputForname, this.state.inputTeam);
                    ipcRenderer.send('add-participant', {
                        dossard: this.state.inputParticipant,
                        lastname: this.state.inputName,
                        firstname: this.state.inputForname,
                        team: this.state.inputTeam,
                        time: new Date().getTime(),
                    });
                    this.props.onSubmit();
                } else {
                    console.log("inputForname empty");
                }
            } else {
                console.log("inputName empty");
            }
        } else {
            console.log("inputParticipant empty")
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <form className={classes.container} noValidate autoComplete="off" fullWidth>
                <TextField
                    id="standard-with-placeholder"
                    label="N° Dossard"
                    className={classes.textField}
                    margin="normal"
                    value={this.state.inputParticipant}
                    onChange={this.onInputParticipantChange.bind(this)}
                />
                <br/>
                <TextField
                    id="standard-with-placeholder"
                    label="Nom"
                    className={classes.textField}
                    margin="normal"
                    value={this.state.inputName}
                    onChange={this.onInputNameChange.bind(this)}
                />
                <TextField
                    id="standard-with-placeholder"
                    label="Prénom"
                    className={classes.textField}
                    margin="normal"
                    value={this.state.inputForname}
                    onChange={this.onInputFornameChange.bind(this)}
                />
                <TextField
                    id="standard-with-placeholder"
                    label="Equipe"
                    className={classes.textField}
                    margin="normal"
                    value={this.state.inputTeam}
                    onChange={this.onInputTeamChange.bind(this)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={this.onFormSubmitted.bind(this)} >
                    Ajouter
                </Button>
            </form>
        );
    }
}

export default withUser(withStyles(styles)(FormAddParticipant));
