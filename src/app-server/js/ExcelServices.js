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

const pathCsvEnd = 'src/app-server/excels/end.csv';
const csvWriterEnd = createCsvWriter({
    path : pathCsvEnd,
    fieldDelimiter: ';',
    append: true,
    header : [
        {id: 'dossard', title: 'Dossard'},
        {id: 'time', title: 'Temps'}
    ]
});

const pathCsvResult = "src/app-server/excels/result.csv";
const csvWriterResult = createCsvWriter({
    path : pathCsvResult,
    fieldDelimiter: ";",
    append: true,
    header : [
        {id: 'dossard', title: 'Dossard'},
        {id: 'lastname', title: 'Nom'},
        {id: 'firstname', title: 'Prénom'},
        {id: 'timedepart', title: 'Temps de départ'},
        {id: 'timearrivee', title: 'Temps d\'arrivée '},
        {id: 'timetotal', title: 'Temps total'},
        {id: 'team', title: 'Equipe'},
        {id: 'timeteam', title: 'Temps équipe'}
    ]
})

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

const pathXlsxParticipants = "src/app-server/excels/template_chrono_run.xlsx";




class ExcelServices {

    static mergeCsv(callback){
        var mapErrorParticipants = new Map();
        var self = this;
        this.createCsv();
        self.getEquipeFromStart(function(dataEquipe){
            self.getParticipants(function(dataParticipants){
                self.getParticipantsEnd(function(dataEnd){
                    self.getParticipantsStart(function(dataStart){
                        var dossards = new Set();
                        for(var i = 0; i<dataParticipants.length; i++){
                            dossards.add(dataParticipants[i].dossard);
                        }
                        for(var i = 0; i<dataStart.length; i++){
                            dossards.add(dataStart[i].dossard);
                        }
                        for(var i = 0; i<dataEnd.length; i++){
                            dossards.add(dataEnd[i].dossard);
                        }
                        var mapTempsEquipe = new Map();
                        var keys = Object.keys(dataEquipe);
                        for(var i = 0; i<keys.length; i++){
                            var time = 0;
                            for(var j = 0 ; j<dataEquipe[keys[i].toString()].length; j++){
                                var tempsArrivee = dataEnd.filter(function(data){
                                    return data.dossard == dataEquipe[keys[i].toString()][j].dossard;
                                })
                                for(var k = 0; k<tempsArrivee.length; k++){
                                    if(time<tempsArrivee[k].time){
                                        time = tempsArrivee[k].time;
                                    }
                                    if(k==tempsArrivee.length-1){
                                        mapTempsEquipe.set(keys[i].toString(), time);
                                    }
                                }
                            }
                        }
                        dossards.forEach(function(dossard){
                            var infoParticipant = dataParticipants.filter(function(data){
                                return data.dossard == dossard;
                            });

                            var infoArrivee = dataEnd.filter(function(data){
                                return data.dossard == dossard;
                            });

                            var infoDepart = dataStart.filter(function(data){
                                return data.dossard == dossard;
                            });

                            var foundStart = false;
                            var foundStop = false;
                            var dossardParticipant = dossard; //On récupère les info qui nous intéresse
                            var lastNameParticipant = null;
                            var firstNameParticipant = null;
                            var teamParticipant = '';
                            var startTimeParticipant = null;
                            var endTimeParticipant = null;

                            if(infoParticipant.length != 0){
                                lastNameParticipant = infoParticipant[0].lastname;
                                firstNameParticipant = infoParticipant[0].firstname;
                                teamParticipant = infoParticipant[0].team;
                            }

                            if(infoDepart.length != 0){
                                var dateDepart = new Date(infoDepart[0].time*1000);
                                startTimeParticipant = dateDepart.getHours()+"h"+dateDepart.getMinutes()+"min"+dateDepart.getSeconds()+"sec";
                                foundStart = true;
                            }

                            if(infoArrivee.length != 0){
                                var dateArrivee = new Date(infoArrivee[0].time*1000);
                                endTimeParticipant = dateArrivee.getHours()+"h"+dateArrivee.getMinutes()+"min"+dateArrivee.getSeconds()+"sec";
                                foundStop = true;
                            }

                            var tempsTeam = null;
                            var endTimeTeam = null;
                            if(foundStart && foundStop && teamParticipant.length != 0){
                                var dateTotal = new Date((infoArrivee[0].time-infoDepart[0].time)*1000)
                                var timeTotalParticipant = dateTotal.getHours()+"h"+dateTotal.getMinutes()+"min"+dateTotal.getSeconds()+"sec";
                                if(teamParticipant.length != 0){
                                    for(var j = 0; j<keys.length; j++){
                                        if(keys[j].toString() == infoDepart[0].time){
                                            tempsTeam = new Date(mapTempsEquipe.get(infoDepart[0].time)*1000);
                                            endTimeTeam = tempsTeam.getHours()+"h"+tempsTeam.getMinutes()+"min"+tempsTeam.getSeconds()+"sec";
                                        }
                                    }
                                }
                                self.addResult(dossardParticipant, lastNameParticipant, firstNameParticipant, startTimeParticipant, endTimeParticipant, timeTotalParticipant, teamParticipant, endTimeTeam);
                                dossardParticipant = null;
                                lastNameParticipant = null;
                                firstNameParticipant = null;
                                startTimeParticipant = null;
                                endTimeParticipant = null;
                                timeTotalParticipant = null;
                                teamParticipant = null;
                                endTimeTeam = null;
                                dateArrivee = null;
                            } else {
                                self.addResult(dossardParticipant, lastNameParticipant, firstNameParticipant, startTimeParticipant, endTimeParticipant, timeTotalParticipant, teamParticipant, endTimeTeam);
                                if(foundStart && !foundStop){
                                    if(!mapErrorParticipants.get(dossard)){
                                        mapErrorParticipants.set(dossard, lastNameParticipant);
                                    }
                                }
                                dossardParticipant = null;
                                lastNameParticipant = null;
                                firstNameParticipant = null;
                                startTimeParticipant = null;
                                endTimeParticipant = null;
                                timeTotalParticipant = null;
                                teamParticipant = null;
                                endTimeTeam = null;
                                dateArrivee = null;
                            }
                        });
                        callback(mapErrorParticipants);
                    });
                });
            });
        });
    }

    static getEquipeFromStart(callback){
        var self = this;

        self.getParticipantsStart(function(dataStart){
            var result = dataStart.reduce(function (r, a){
                r[a.time] = r[a.time] || [];
                r[a.time].push(a);
                return r;
            }, Object.create(null));
            callback(result);
        })
    }
    

    static editNumberParticipantAtTheEnd(timestamp, numberFinal){
        //On essaye de lire le fichier 'end.csv'
        fs.readFile(pathCsvEnd, 'utf8', function(err, data){
            if(err){ //Si erreur, on l'envoit dans la console
                return console.log(err);
            }
            ExcelServices.getEndParticipants(function(res){
                var participant = res.filter(function(data){
                    return data.time === timestamp;
                });
                var stringToReplace = participant[0].dossard+";"+participant[0].time; //String que l'on souhaite remplacer
                var stringReplace = numberFinal+";"+participant[0].time; //String que l'on va mettre à la place
                var regex = new RegExp(stringToReplace);
                var result = data.replace(regex, stringReplace);
                fs.writeFile(pathCsvEnd, result, 'utf8', function(err){
                    if (err) return console.log(err);
                });
            });
        });
    }

    //Lis le fichier .xlsx, et add une ligne dans participants.csv pour chaque participant
    static convertXlsxToCsv(path, callback){
        var converted = false; 
        convert.convert(path).then(result => { //On lit le fichier xlsx grâce à xlsx-converter
            var index = 2; //On lit à partir de la ligne 2 pour éviter les headers
            while(result[index.toString()]!=undefined){ //On récupère les infos souhaitées
                var numeroDossard = result[index.toString()][0];
                var nom = result[index.toString()][1];
                var prenom = result[index.toString()][2];
                var nomEquipe = result[index.toString()][3];

                ExcelServices.addParticipant(numeroDossard, nom, prenom, nomEquipe); //On ajoute un le participant au fichier particicpants.csv
                index++;
            }
            converted = true;
            callback(converted);
        });
    }

    /**
     * Delete the CSV files (start, end, participants)
     */
    static deleteCsv() {
        if(fs.existsSync(pathCsvStart)) {
            fs.unlinkSync(pathCsvStart);
        }
        if(fs.existsSync(pathCsvEnd)) {
            fs.unlinkSync(pathCsvEnd);
        }
        if(fs.existsSync(pathCsvParticipants)) {
            fs.unlinkSync(pathCsvParticipants);
        }
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
            fs.statSync(pathCsvEnd);
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
        //Deletes result.csv exists, if not create it
        try {
            fs.unlinkSync(pathCsvResult)
            ExcelServices.addResult('dossard', 'lastname', 'firstname', 'timedepart', 'timearrivee', 'timetotal', 'team', 'timeteam');
        } catch (error) {
            if(error.code === 'ENOENT') {
                ExcelServices.addResult('dossard', 'lastname', 'firstname', 'timedepart', 'timearrivee', 'timetotal', 'team', 'timeteam');
            }
        }
    }
    /**
     * Return the list of the participants at the end
     * @param callback - functio,
     */

    static getEndParticipants(callback){
        var participants = [];
        fs.createReadStream(pathCsvEnd)
            .pipe(csvParser({separator: ';'}))
            .on('data', (row) => {
                participants.push(row);
            })
            .on('finish', function () {
                callback(participants);
            });
    }

    /**
     *  Return the list of the participants
     * @param callback - function
     */
    static getParticipants(callback) {
        var participants = [];
        var readStream = fs.createReadStream(pathCsvParticipants)
            .pipe(csvParser({separator: ';'}))
            .on('data', (row) => {
                participants.push(row);
                
            })
            .on('finish', function () {
                readStream.destroy();
                callback(participants);
                
            });
    }
    
    /**
     * Return the list of the participant at start
     * @param callback  - function
     */
    static getParticipantsStart(callback){
        var participants = [];
        fs.createReadStream(pathCsvStart)
        .pipe(csvParser({separator: ';'}))
        .on('data', (row) => {
            participants.push(row);
        })
        .on('finish', function() {
            callback(participants);
        }).unpipe();
    }

        /**
     * Return the list of the participant at the end
     * @param callback  - function
     */
    static getParticipantsEnd(callback){
        var participants = [];
        fs.createReadStream(pathCsvEnd)
        .pipe(csvParser({separator: ';'}))
        .on('data', (row) => {
            participants.push(row);
        })
        .on('finish', function() {
            callback(participants);
        });
    }

    static getParticipantsResult(callback){
        var particicpants = [];
        fs.createReadStream(pathCsvResult)
        .pipe(csvParser({separator : ';'}))
        .on('data', (row) => {
            particicpants.push(row);
        })
        .on('finish', function() {
            callback(particicpants);
        });
    }

    /**
     *  Return the list of the participants
     * @param callback - function
     */
    static getStartResult(callback) {
        const results = [];
        fs.createReadStream(pathCsvStart)
            .pipe(csvParser({separator: ';'}))
            .on('data', (row) => {
                row.time = Number(row.time);
                results.push(row);
            })
            .on('finish', function () {
                callback(results);
            });
    }

    /**
     *  Return the list of the participants
     * @param callback - function
     */
    static getEndResult(callback) {
        const results = [];
        fs.createReadStream(pathCsvEnd)
            .pipe(csvParser({separator: ';'}))
            .on('data', (row) => {
                row.time = Number(row.time);
                results.push(row);
            })
            .on('finish', function () {
                callback(results);
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

    static findParticipantStart(searchedDossard, callback){
        this.getParticipantsStart(function (participants){
            callback(participants.filter(participant => participant.dossard == searchedDossard));
        });
    }

    static findParticipantStop(searchedDossard, callback){
        this.getParticipantsStop(function (participants){
            callback(participants.filter(participant => participant.dossard == searchedDossard));
        });
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

        csvWriterEnd
            .writeRecords(data);
    }

    static addResult(dossard, lastname, firstname, timeDepart, timeArrivee, timeTotal, team, timeTeam){
        let data = [{
            dossard: dossard,
            lastname: lastname,
            firstname : firstname, 
            team : team, 
            timedepart: timeDepart,
            timearrivee : timeArrivee,
            timetotal : timeTotal,
            timeteam : timeTeam
        }];

        csvWriterResult.writeRecords(data);
    }

}

module.exports = ExcelServices;
