import React, { Component } from 'react';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
import {withUser} from "./store/AppProvider";

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
            inputFilter: '',
            table: this.initTableJson(),
            tableVisu: this.initTableJson(),
        };
        this.initTableJson = this.initTableJson.bind(this);
        this.filterTable = this.filterTable.bind(this);
    }

    filterTable(filterValue){
        let table = this.state.table;
        let newTable;
        if (filterValue.length === 0) {
            this.setState({ tableVisu: table });
        } else {
            if (isNaN(filterValue)) {
                newTable = table.find(row => row.lastname === filterValue || row.firstname === filterValue);
            } else {
                newTable = table.find(row => row.dossard === filterValue);
            }

            if (newTable === undefined){
                this.setState({ tableVisu: [] });
            } else {
                console.log(newTable)
                this.setState({ tableVisu: [newTable] });
            }
        }
    }

    initTableJson() {
        let listeDossards = [];
        let listeParticipants = this.props.listeParticipants;
        let histoStart = this.props.histoParticipantStart;
        let histoEnd = this.props.histoParticipantEnd;
        let newTable = [];

        histoStart.forEach(function(row) {
            listeDossards.push(row.dossard);
        });
        histoEnd.forEach(function(row) {
            if (!listeDossards.includes(row.dossard)) listeDossards.push(row.dossard)
        });

        listeDossards.forEach(function(dossard) {
            let participantEnd, participantStart, participant;
            participant = listeParticipants.find(row => row.dossard === dossard);
            participantStart = histoStart.find(row => row.dossard === dossard);
            participantEnd = histoEnd.find(row => row.dossard === dossard);

            let nom, prenom, startTime, endTime = '-';
            if (participant !== undefined) {
                nom = participant.nom;
                prenom = participant.prenom;
            }
            if (participantStart !== undefined) startTime = participantStart.time;
            if (participantEnd !== undefined) endTime = participantEnd.time;

            newTable.push({
                dossard: dossard,
                lastname: nom,
                firstname: prenom,
                startTime: startTime,
                endTime: endTime,
            });
        });
        return newTable;
    }

    handleInputChange(e){
        let newValue = e.target.value;
        this.setState({inputFilter: newValue});
        this.filterTable(newValue);
    }

    displayTimestamp(time){
        if (isNaN(time)){
            return "-";
        }
        let date = new Date(time);
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
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
                        value={this.state.inputFilter}
                        onChange={this.handleInputChange.bind(this)}
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
                                <TableCell align="center">{this.displayTimestamp(row.startTime)}</TableCell>
                                <TableCell align="center">{this.displayTimestamp(row.endTime)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default withUser(withStyles(styles)(TableVisualiseParticipants));
