const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const convert = require('xlsx-converter');

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
    
    static refreshCsv(data){
        const csvWriter = createCsvWriter({
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
        for(var i = 0; i< data.length; i++){
            console.log(data[i]["Row"]); //TODO : Trouver un moyen de parser les ROWS
        }
    }

    static editNumberParticipantByNumber(numberInit, numberFinal){
        var data = [];
        ExcelServices.getParticipants(function(res){
            for(var i  = 0; i<res.length; i++){
                // console.log("RES :", res);
                // console.log("Row numéro : ", i , res[i]);
                if(res[i].dossard == numberInit){
                    // console.log("ON REMPLACE", numberInit, "PAR", numberFinal);
                    var edited = { Row : {dossard:numberFinal, lastname:res[i].lastname, firstname:res[i].firstName, team:res[i].team}}
                    data.push(edited);
                } else {
                    data.push(res[i]);
                }
            }
            // console.log("DATA : " , data);
            ExcelServices.refreshCsv(data);
        });
        console.log("excelservices");
        console.log(data);
    }

    //Lis le fichier .xlsx, et add une ligne dans participants.csv pour chaque participant
    static convertXlsxToCsv(path, callback){
        var converted = false;
        console.log("path : ", path);
        convert.convert(path).then(result => {

            var index = 2;
            // console.log("result : ", result);
            while(result[index.toString()]!== undefined){
                var numeroDossard = result[index.toString()][0];
                var nom = result[index.toString()][1];
                var prenom = result[index.toString()][2];
                var nomEquipe = result[index.toString()][3];

                // console.log("numero : ", result[index.toString()][0]);
                // console.log("nom : ", result[index.toString()][1]);
                // console.log("prenom : ", result[index.toString()][2]);
                // console.log("equipe : ", result[index.toString()][3]);

                ExcelServices.addParticipant(numeroDossard, nom, prenom, nomEquipe);
                index++;
            }
            converted = true;
            console.log("converted : ", converted);
            callback(converted);
        });
    }

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
        const participants = [];
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
