import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import InputAutocompleteParticipantEnd from './InputAutocompleteParticipantEnd';

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
        this.state = {
            inputValue: ""
        };
        this.btnEndClicked = this.btnEndClicked.bind(this);
        this.inputChanged = this.inputChanged.bind(this);
    }

    inputChanged(value) {
        this.setState({ inputValue : value });
    }

    btnEndClicked() {
        this.props.onClick(this.state.inputValue);
    }

    render() {
        const { classes } = this.props;
        return (
            <Box className={classes.root}>
                <Box>
                    <InputAutocompleteParticipantEnd onChange={this.inputChanged}/>
                </Box>
                <Box>
                    <Button className={classes.btnEnd} variant="contained" color="primary" onClick={this.btnEndClicked}>Fin</Button>
                </Box>
            </Box>
        )
    };
}

export default withStyles(styles)(FormEndRace);
