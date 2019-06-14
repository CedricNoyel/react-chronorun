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
    },
    table: {
        minWidth: 150,
    },
});

class TableHistoEnd extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { classes } = this.props;
        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Dossard</TableCell>
                        <TableCell align="center">Heure de d'arrivée</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { this.props.histoParticipantEnd.map((row, index) => (
                        <TableRow key={"histo-"+index}>
                            <TableCell align="center">{row.participant}</TableCell>
                            <TableCell align="center">{row.time}</TableCell>
                        </TableRow>
                        ))}
                </TableBody>
            </Table>
        );
    }
}

export default withUser(withStyles(styles)(TableHistoEnd));
