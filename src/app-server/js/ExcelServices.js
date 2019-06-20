const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const xlsx_converter = require('xlsx-converter');

const pathCsvResultsStart = 'src/app-server/excels/start_results.csv';
const pathCsvResultsEnd = 'src/app-server/excels/end_results.csv';
const pathCsvResultFinal = 'src/app-server/excels/resultats_finaux.xlsx';

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

    static exportFinalResults(callback) {
        var self = this;
        this.getParticipants(function (participants) {
            self.getExportStartResult(function (startResults) {
                self.getExportEndResult(function (endResults) {
                    let dossardList = [];
                    participants.forEach((values) => {
                        dossardList.push(values.dossard);
                    });
                    startResults.forEach((values) => {
                        if(!dossardList.includes(values.dossard)){
                            dossardList.push(values.dossard);
                        }
                    });
                    endResults.forEach((values) => {
                        if(!dossardList.includes(values.dossard)){
                            dossardList.push(values.dossard);
                        }
                    });

                    let results = [];
                    let errors = [];
                    dossardList.forEach((dossard) => {
                        let participant = participants.filter(p => p.dossard === dossard);
                        let start = startResults.filter(s => s.dossard === dossard);
                        let end = endResults.filter(e => e.dossard === dossard);

                        if(participant.length === 1 && start.length <= 1 && end.length <= 1 ) {

                            let startTime = "";
                            if(start.length === 1) {
                                startTime = self.getTimeFromTimestamp(start[0].time);
                            }

                            let endTime = "";
                            if(end.length === 1) {
                                endTime = self.getTimeFromTimestamp(end[0].time);
                            }

                            let totalTime = "";
                            if(start.length === 1 && end.length === 1) {
                                totalTime = self.getTimeDifference(start[0].time, end[0].time);
                            }

                            let resultRow = {
                                dossard: dossard,
                                lastname: participant[0].lastname,
                                firstname: participant[0].firstname,
                                startTime: startTime,
                                endTime: endTime,
                                totalTime: totalTime,
                                teamTime: '',
                            };
                            results.push(resultRow);
                        } else {
                            start.forEach((values) => {
                                let resultRow = {
                                    dossard: dossard,
                                    lastname: '',
                                    firstname: '',
                                    startTime: self.getTimeFromTimestamp(values.time),
                                    endTime: '',
                                    totalTime: '',
                                };
                                errors.push(resultRow);
                            });

                            end.forEach((values) => {
                                let resultRow = {
                                    dossard: dossard,
                                    lastname: '',
                                    firstname: '',
                                    startTime: '',
                                    endTime: self.getTimeFromTimestamp(values.time),
                                    totalTime: '',
                                };
                                errors.push(resultRow);
                            });
                        }
                    });

                    let teams = results.reduce(function (r, a){
                        r[a.startTime] = r[a.startTime] || [];
                        r[a.startTime].push(a);
                        return r;
                    }, Object.create(null));

                    Object.keys(teams).forEach(key => {
                        let worstTime = '00:00:00';
                        if(teams[key].length > 1) {
                            teams[key].forEach((values) => {
                                let date = values.totalTime;
                                if(date > worstTime) {
                                    worstTime = date;
                                }
                            });

                            let teamParticipants = results.filter(p => p.startTime === teams[key][0].startTime);
                            teamParticipants.forEach((participant) => {
                                participant.teamTime = worstTime;
                            });
                        }
                    });

                    let finalResults = results.concat(errors);
                    callback(finalResults);
                });
            });
        });
    }

    static getTimeFromTimestamp(timestamp) {
        let time = new Date(timestamp);
        let hours = time.getHours().toString().length === 1 ? "0" + time.getHours() : time.getHours();
        let minutes = time.getMinutes().toString().length === 1 ? "0" + time.getMinutes() : time.getMinutes();
        let seconds = time.getSeconds().toString().length === 1 ? "0" + time.getSeconds() : time.getSeconds();
        return hours + ":" + minutes + ":" + seconds;
    }

    static getTimeDifference(timeStart, timeEnd) {
        let difference = timeEnd - timeStart;
        let diffHours = Math.floor(difference/1000/60/60);
        diffHours = diffHours.toString().length === 1 ? "0" + diffHours : diffHours;
        difference -= diffHours*1000*60*60;
        let diffMinutes = Math.floor(difference/1000/60);
        diffMinutes = diffMinutes.toString().length === 1 ? "0" + diffMinutes : diffMinutes;
        difference -= diffMinutes*1000*60;
        let diffSeconds = Math.floor(difference/1000);
        diffSeconds = diffSeconds.toString().length === 1 ? "0" + diffSeconds : diffSeconds;
        return diffHours + ':' + diffMinutes + ':' + diffSeconds;
    }
    

    static editNumberParticipantAtTheEnd(timestamp, numberFinal){
        //On essaye de lire le fichier 'end.csv'
        fs.readFile(pathCsvEnd, 'utf8', function(err, data){
            if(err){ //Si erreur, on l'envoit dans la console
                return console.log(err);
            }
            ExcelServices.getEndResult(function(res){
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

    static convertXlsxToCsv(path, callback) {
        let converted = false;
        xlsx_converter.convert(path).then(result => {
            let index = 2;
            let participants = [];
            while(result[index] !== undefined) {
                let row = {
                    dossard: result[index][0],
                    lastname: result[index][1],
                    firstname: result[index][2],
                    team: result[index][3]
                };
                participants.push(row);
                index++;
            }
            console.log(index);
            if(participants.length === index - 2) {
                converted = true;
            }
            this.addListParticipant(participants);
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
        if(fs.existsSync(pathCsvResult)) {
            fs.unlinkSync(pathCsvResult);
        }
        if(fs.existsSync(pathCsvResultsStart)) {
            fs.unlinkSync(pathCsvResultsStart);
        }
        if(fs.existsSync(pathCsvResultsEnd)) {
            fs.unlinkSync(pathCsvResultsEnd);
        }
        if(fs.existsSync(pathCsvResultFinal)) {
            fs.unlinkSync(pathCsvResultFinal);
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
    }

    static isExportValid(callback) {
        if(fs.existsSync(pathCsvResultsStart) && fs.existsSync(pathCsvResultsEnd)) {
            callback(true);
        } else {
            callback(false);
        }
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
    static getExportStartResult(callback) {
        const results = [];
        fs.createReadStream(pathCsvResultsStart)
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
     *  Return the list of the participants
     * @param callback - function
     */
    static getExportEndResult(callback) {
        const results = [];
        fs.createReadStream(pathCsvResultsEnd)
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

    static addListParticipant(list) {
        csvWriterParticipants.writeRecords(list);
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
