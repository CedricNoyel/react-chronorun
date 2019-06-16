import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withUser} from "./store/AppProvider";

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    }
});

class TableHistoStart extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { classes } = this.props;
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Dossard</TableCell>
                        <TableCell align="center">Heure de départ</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.histoParticipantStart.participant.map( (i, index) => (
                        <TableRow key={index}>
                            <TableCell align="center">{this.props.histoParticipantStart.participant[index]}</TableCell>
                            <TableCell align="center">{this.props.histoParticipantStart.time[index]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

export default withUser(withStyles(styles)(TableHistoStart));
