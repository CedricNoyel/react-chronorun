import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import InputAutocompleteParticipantEnd from './InputAutocompleteParticipantEnd';

import { withUser } from "./store/AppProvider";

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
    constructor(props) {
        super(props);
    }

    btnEndClicked() {
        let inputid = this.props.inputid;
        let inputValue = this.props.inputsFormEnd[inputid].inputValue;
        if (inputValue.length != 0) {
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            this.props.addHistoParticipantEnd(inputid, inputValue, time);
            this.props.setInputFormEnd(inputid, "");
        } else {
            console.log("<!> The value you want to add is not good");
        }
    }

    render() {
        const { classes, inputid, inputsFormEnd } = this.props;
        return (
            <Box className={classes.root}>
                <Box>
                    <InputAutocompleteParticipantEnd inputid={inputid} />
                </Box>
                <Box>
                    <Button className={classes.btnEnd} variant="contained" color="primary" onClick={this.btnEndClicked.bind(this)}>Fin</Button>
                </Box>
            </Box>
        )
    };
}

export default withUser(withStyles(styles)(FormEndRace));
