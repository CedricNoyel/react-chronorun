const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const pathCsvStart = 'src/app-server/excels/start.csv';
const csvWriterStart = createCsvWriter({
    path : pathCsvStart,
    fieldDelimiter: ';',
    append: true,
    header : [
        {id: 'dossard', title: 'Dossard'},
        {id: 'time', title: 'Temps'}
    ]
});

const pathCsvStop = 'src/app-server/excels/end.csv';
const csvWriterStop = createCsvWriter({
    path : pathCsvStop,
    fieldDelimiter: ';',
    append: true,
    header : [
        {id: 'dossard', title: 'Dossard'},
        {id: 'time', title: 'Temps'}
    ]
});

const pathCsvParticipants = 'src/app-server/excels/participants.csv';
const csvWriterParticipants = createCsvWriter({
    path : pathCsvParticipants,
    fieldDelimiter: ';',
    append: true,
    header : [
        {id: 'dossard', title: 'Dossard'},
        {id: 'lastname', title: 'Nom'},
        {id: 'firstname', title: 'Prénom'},
        {id: 'team', title: 'Equipe'}
    ]
});

class ExcelServices {

    /**
     * Create the different CSV if they do not exist
     */
    static createCsv() {
        //Check if start.csv exist, if not create it
        try {
            fs.statSync(pathCsvStart);
        } catch (error) {
            if(error.code === 'ENOENT') {
                ExcelServices.addStartTime('dossard', 'time');
            }
        }
        //Check if start.csv exist, if not create it
        try {
            fs.statSync(pathCsvStop);
        } catch (error) {
            if(error.code === 'ENOENT') {
                ExcelServices.addStopTime('dossard', 'time');
            }
        }
        //Check if participants.csv exist, if not create it
        try {
            fs.statSync(pathCsvParticipants);
        } catch (error) {
            if(error.code === 'ENOENT') {
                ExcelServices.addParticipant('dossard', 'lastname', 'firstname', 'team');
            }
        }
    }

    /**
     *  Return the list of the participants
     * @param callback - function
     */
    static getParticipants(callback) {
        var participants = [];
        fs.createReadStream(pathCsvParticipants)
            .pipe(csvParser({separator: ';'}))
            .on('data', (row) => {
                participants.push(row);
            })
            .on('finish', function () {
                callback(participants);
            });
    }

    /**
     * Add a participant in the csv file of participants
     * @param dossard - dossard number
     * @param lastname - lastname of the participant
     * @param firstname - firstname of the participant
     * @param team - team name of the participant
     */
    static addParticipant(dossard, lastname, firstname, team) {
        let data = [{
            dossard: dossard,
            lastname: lastname,
            firstname: firstname,
            team: team
        }];

        csvWriterParticipants
            .writeRecords(data);
    }

    /**
     * Find the participant by his dossard number
     * @param searchedDossard - dossard number
     * @param callback - callback function
     */
    static findParticipant(searchedDossard, callback) {
        this.getParticipants(function (participants) {
            callback(participants.filter(participant => participant.dossard == searchedDossard));
        });
    }

    /**
     * Find the participants in a specific team
     * @param teamName
     * @param callback
     */
    static findTeamParticipants(teamName, callback) {
        this.getParticipants(function (participants) {
            callback(participants.filter(participant => participant.team === teamName));
        })
    }

    static addStartTime(dossard, time) {
        let data = [{
            dossard: dossard,
            time: time
        }];

        csvWriterStart
            .writeRecords(data);
    }

    static addStopTime(dossard, time) {
        let data = [{
            dossard: dossard,
            time: time
        }];

        csvWriterStop
            .writeRecords(data);
    }
}

module.exports = ExcelServices;
