import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Edit from '@material-ui/icons/Edit';
import {withUser} from "./store/AppProvider";
import DialogEditParticipantEnd, {openEditParticipantEnd} from './DialogEditParticipantEnd';

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
        this.state = {},
        this.onEditRow = this.onEditRow.bind(this);
    }

    onEditRow(dossard, timestamp) {
        openEditParticipantEnd(dossard, timestamp)
    }

    render() {
        const { classes } = this.props;
        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Dossard</TableCell>
                        <TableCell align="center">Heure d'arrivée</TableCell>
                        <TableCell align="center">Editer</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { this.props.histoParticipantEnd.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell align="center">{row.dossard}</TableCell>
                            <TableCell align="center">{new Date(row.time).getHours() + ":" + new Date(row.time).getMinutes() + ":" + new Date(row.time).getSeconds()}</TableCell>
                            <TableCell align="center">
                                <Button onClick={this.onEditRow.bind(this, row.dossard, row.time)}>
                                    <Edit/>
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                </TableBody>
                <DialogEditParticipantEnd/>
            </Table>
        );
    }
}

export default withUser(withStyles(styles)(TableHistoEnd));
