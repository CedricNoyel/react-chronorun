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

const pathCsvResult = "src/app-server/excels/result.csv";
const csvWriterResult = createCsvWriter({
    path : pathCsvResult,
    fieldDelimiter: ";",
    append: true,
    header : [
        {id: 'dossard', title: 'Dossard'},
        {id: 'lastname', title: 'Nom'},
        {id: 'firstname', title: 'Prénom'},
        {id: 'team', title: 'Equipe'},
        {id: 'timedepart', title: 'Temps de départ'},
        {id: 'timearrivee', title: 'Temps d\'arrivée '},
        {id: 'timetotal', title: 'Temps total'}
    ]
})

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

const pathXlsxParticipants = "src/app-server/excels/template_chrono_run.xlsx";




class ExcelServices {

    static testSvp(){
        this.mergeCsv(function(res){
            console.log("le res est bon? ", res);
        })
    }

    static mergeCsv(callback){
        var mapErrorParticipants = new Map();
        var self = this;
        this.getParticipants(function(dataParticipants) {
            self.getParticipantsStart(function(dataStart){
                self.getParticipantsEnd(function(dataEnd){ //On lit le csv des fichiers "participants.csv", "start.csv", "end.csv" et on récupère les données
                    for(var i = 0; i<dataParticipants.length;i++){ //On boucle sur les données de "participants.csv"
                        var infoDepart = dataStart.filter(function(data){ //On cherche les infos associés au numéro de dossard dans le fichier start
                            return data.dossard == dataParticipants[i].dossard;
                        });
                        var infoArrivee = dataEnd.filter(function(data){ //Idem pour le fichier end
                            return data.dossard == dataParticipants[i].dossard;
                        });
                        var foundDepart = false;
                        var foundStop = false;
                        var dossardParticipant = dataParticipants[i].dossard; //On récupère les info qui nous intéresse
                        var lastNameParticipant = dataParticipants[i].lastname;
                        var firstNameParticipant = dataParticipants[i].firstname;
                        var teamParticipant = dataParticipants[i].team;
                        if(infoDepart.length != 0){
                            var dateDepart = new Date(infoDepart[0].time*1000);
                            var startTimeParticipant = dateDepart.getHours()+"h"+dateDepart.getMinutes()+"min"+dateDepart.getSeconds()+"sec";
                            foundDepart = true;
                        }
                        if(infoArrivee.length != 0){ //Gestion du cas ou un participant est parti mais n'est jamais arrivé
                            var dateArrivee = new Date(infoArrivee[0].time*1000);
                            var endTimeParticipant = dateArrivee.getHours()+"h"+dateArrivee.getMinutes()+"min"+dateDepart.getSeconds()+"sec";
                            foundStop = true;
                        }
                        if(foundDepart && foundStop){ //Si on a les infos au départ et à l'arrivée, on l'ajoute au fichier result
                            var dateTotal = new Date((infoArrivee[0].time-infoDepart[0].time)*1000)
                            var timeTotalParticipant = dateTotal.getHours()+"h"+dateTotal.getMinutes()+"min"+dateTotal.getSeconds()+"sec";
                            self.addResult(dossardParticipant, lastNameParticipant, firstNameParticipant, teamParticipant, startTimeParticipant, endTimeParticipant, timeTotalParticipant);
                        } else { // Si il y a eu un problème, on l'ajoute à un map que l'on retourne dans la callback
                            if(!mapErrorParticipants.get(dataParticipants[i].dossard)){
                                mapErrorParticipants.set(dataParticipants[i].dossard, dataParticipants[i].lastname);
                            }
                        }
                    }
                    callback(mapErrorParticipants);
                })
            });
        });
    }
    

    static editNumberParticipantAtTheEnd(numberInit, numberFinal){
        //On essaye de lire le fichier 'end.csv'
        fs.readFile(pathCsvStop, 'utf8', function(err, data){
            if(err){ //Si erreur, on l'envoit dans la console
                return console.log(err);
            }
            ExcelServices.getEndParticipants(function(res){
                for(var i = 0; i<res.length; i++){ //On boucle sur chaque participant arrivé
                    if(res[i].dossard == numberInit){ 
                        var stringToReplace = numberInit+";"+res[i].time; //On créée une string conforme à ce qui est présent dans le fichier "end.csv" et qui correspond à la ligne du participant
                        var stringReplace = numberFinal+";"+res[i].time; // On créée la string qu'on souhaite mettre à la place de la ligne déjà existante
                        var regex = new RegExp(stringToReplace); //On créée une regex qui permet de chercher dans le fichier la ligne qu'on cherche
                        var result = data.replace(regex, stringReplace);
                        fs.writeFile(pathCsvStop, result, 'utf8', function(err){ //On réécrit le fichier avec la ligne modifiée
                            if (err) return console.log(err);
                        });
                    }
                }
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
        //Check if result.csv exists, if not create it
        try {
            console.log("Passe ici");
            fs.statSync(pathCsvResult);
        } catch (error) {
            console.log("Passe dans error");
            if(error.code === 'ENOENT') {
                console.log("Passe dans enoent");
                ExcelServices.addResult('dossard', 'lastname', 'firstname', 'team', 'temps depart', 'temps arrivée', 'temps total');
            }
        }
    }

    /**
     * Return the list of the participants at the end
     * @param callback - functio,
     */

    static getEndParticipants(callback){
        var participants = [];
        fs.createReadStream(pathCsvStop)
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
        fs.createReadStream(pathCsvStop)
        .pipe(csvParser({separator: ';'}))
        .on('data', (row) => {
            participants.push(row);
        })
        .on('finish', function() {
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

        csvWriterStop
            .writeRecords(data);
    }

    static addResult(dossard, lastname, firstname, team, timeDepart, timeArrivee, timeTotal){
        let data = [{
            dossard: dossard,
            lastname: lastname,
            firstname : firstname, 
            team : team, 
            timedepart: timeDepart,
            timearrivee : timeArrivee,
            timetotal : timeTotal
        }];

        csvWriterResult.writeRecords(data);
    }
}

module.exports = ExcelServices;
