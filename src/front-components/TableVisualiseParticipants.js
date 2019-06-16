import React, { Component } from 'react';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withUser} from "./store/AppProvider";
import TextField from '@material-ui/core/TextField';
import { ThemeProvider } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';

const styles = theme => ({
    table: {
        minWidth: '300px',
    },
    margin: {
        margin: theme.spacing(3),
    },
    palette: {
        primary: green,
    },
});

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

class TableVisualiseParticipants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputSearch: "",
            tableVisu: this.getTableContent(),
        };
    }

    getTableContent() {
        let newTable = [];
        let histoStart = this.props.histoParticipantStart;
        let histoEnd = this.props.histoParticipantEnd;

        if (histoStart.participant !== null) {
            histoStart.participant.forEach(function(elem, index) {
                newTable.push({type: "Départ", dossard: histoStart.participant[index], time: histoStart.time[index]});
            });
        }
        if (histoEnd.participant !== null) {
            histoEnd.forEach(function(elem, index) {
                newTable.push({type: "Arrivée", dossard: elem.participant, time: elem.time});
            });
        }
        return newTable;
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <ThemeProvider theme={theme}>
                    <TextField
                        className={classes.margin}
                        label="Recherche"
                        variant="outlined"
                        id="mui-theme-provider-outlined-input"
                        value={this.state.inputSearch}
                    />
                </ThemeProvider>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Dossard</TableCell>
                            <TableCell align="center">Nom</TableCell>
                            <TableCell align="center">Prénom</TableCell>
                            <TableCell align="center">Heure de départ</TableCell>
                            <TableCell align="center">Heure d'arrivée</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.tableVisu.map( (row, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{row.dossard}</TableCell>
                                <TableCell align="center">{row.lastname}</TableCell>
                                <TableCell align="center">{row.firstname}</TableCell>
                                <TableCell align="center">{row.timeStart}</TableCell>
                                <TableCell align="center">{row.timeEnd}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default withUser(withStyles(styles)(TableVisualiseParticipants));
