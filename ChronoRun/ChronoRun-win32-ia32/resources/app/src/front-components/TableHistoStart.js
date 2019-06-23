import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withUser} from "./store/AppProvider";

class TableHistoStart extends Component {
    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Dossard</TableCell>
                        <TableCell align="center">Heure de départ</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.histoParticipantStart.map( (row, index) => (
                        <TableRow key={index}>
                            <TableCell align="center">{row.dossard}</TableCell>
                            <TableCell align="center">
                                {('0' + new Date(row.time).getHours()).substr(-2) + ":" +
                                ('0' + new Date(row.time).getMinutes()).substr(-2) + ":" +
                                ('0' + new Date(row.time).getSeconds()).substr(-2)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

export default withUser(TableHistoStart);
