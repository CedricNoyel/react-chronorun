const electron = require('electron');
const ipcMain = electron.ipcMain; // get html events
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const file = require('file-system');
const fs = require('fs');
const isDev = require('electron-is-dev');

const ExcelServices = require('../src/app-server/js/ExcelServices');


let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 728,
        webPreferences: { nodeIntegration: true },
        frame: false,
        titleBarStyle: 'hidden',
        icon: __dirname + '/stopwatch.ico'
    });
    mainWindow.setMenuBarVisibility(false);

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '../build/index.html'),
            protocol: 'file:',
            slashes: true
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : startUrl);
    mainWindow.maximize();

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    });
}

app.on('ready', () => {
    createWindow();
    ExcelServices.createCsv();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// CONTROLLER
ipcMain
    .on('request-liste-participants', (event, arg) => {
        ExcelServices.getParticipants(function(data){
            event.sender.send('reply-liste-participants', data);
        });
    })
    .on('start-results-request', (event, arg) => {
        ExcelServices.getStartResult(function(data){
            event.sender.send('start-results-reply', data);
        });
    })
    .on('end-results-request', (event, arg) => {
        ExcelServices.getEndResult(function(data){
            event.sender.send('end-results-reply', data);
        });
    })
    .on('end-add-participant', (event, arg1, arg2) => {
        ExcelServices.addStopTime(arg1, arg2);
    })
    .on('add-participant', (event, arg) => {
        ExcelServices.addParticipant(arg.dossard, arg.lastname, arg.firstname, arg.team);
    })
    .on('start-add-participants', (event, dossard, timestamp) => {
        ExcelServices.addStartTime(dossard, timestamp);
    })
    .on('request-export-csv', (event, arg) => {
        ExcelServices.mergeCsv(function(res){
            if(res.size != 0){
                event.sender.send('reply-export-csv', {status: false, arg: arg});
            } else {
                event.sender.send('reply-export-csv', {status: true, arg: arg});
            }

            let source = path.join(__dirname, '/../src/app-server/excels/result.csv');
            let destination = path.join(app.getPath('downloads'), 'resultats_finaux_chrono_run.csv');
            console.log(source);
            file.copyFile(source, destination, {
                done: (err) => {
                    console.log("Téléchargement terminé : ", err);
                }
            });
        });
    })
    .on('end-edit-participant', (event, participant, timestamp) => {
        ExcelServices.editNumberParticipantAtTheEnd(timestamp, participant)
    })
    // .on('edit-participant', (event, arg) => {
    //     ExcelServices.editNumberParticipantAtTheEnd(args[0], args[1]);

    // })
    .on('import-participants', (event, arg) => {
        ExcelServices.convertXlsxToCsv(arg, function(res) {
            if(res){
                event.sender.send('reply-import-participants', 'Participants importés avec succès');
            }
        });
    })
    .on('start-add-team', (event, arg) => {
        let currentTimestamp = new Date().getTime();
        ExcelServices.findTeamParticipants(arg, function (res) {
            res.forEach(function (participant) {
                ExcelServices.addStartTime(participant.dossard, currentTimestamp);
            })
        });
    })
    .on('dl-template-request', (event, arg) => {
        let source = path.join(__dirname, 'template_chrono_run.xlsx');
        let destination = path.join(app.getPath('downloads'), 'template_chrono_run.xlsx');
        let index = 1;
        while(fs.existsSync(destination)) {
            destination = path.join(app.getPath('downloads'), 'template_chrono_run('+index+').xlsx');
            index++;
        }
        file.copyFile(source, destination, {
            done: (err) => {
                event.sender.send('dl-template-reply');
            }
        });
    })
    .on('dl-start-results-request', (event, arg) => {
        let source = path.join(__dirname, '/../src/app-server/excels/start.csv');
        let destination = path.join(app.getPath('downloads'), 'resultats_depart_chrono_run.csv');
        let index = 1;
        while(fs.existsSync(destination)) {
            destination = path.join(app.getPath('downloads'), 'resultats_depart_chrono_run('+index+').csv');
            index++;
        }
        file.copyFile(source, destination, {
            done: (err) => {
                event.sender.send('dl-start-results-reply');
            }
        });
    })
    .on('dl-end-results-request', (event, arg) => {
        let source = path.join(__dirname, '/../src/app-server/excels/end.csv');
        let destination = path.join(app.getPath('downloads'), 'resultats_arrivees_chrono_run.csv');
        let index = 1;
        while(fs.existsSync(destination)) {
            destination = path.join(app.getPath('downloads'), 'resultats_arrivees_chrono_run('+index+').csv');
            index++;
        }
        file.copyFile(source, destination, {
            done: (err) => {
                event.sender.send('dl-end-results-reply');
            }
        });
    })
    .on('refresh-clock', (event, arg) => {
        ExcelServices.refreshClock(function(res){
            console.log("res : ", res);
            event.sender.send('on-refresh-clock', res);
        })
    })
    .on('import-start-results-request', (event, filePath) => {
        let source = filePath;
        let destination = path.join(__dirname, '/../src/app-server/excels/start_results.csv');
        file.copyFile(source, destination, {
            done: (err) => {
                console.log(err);
                event.sender.send('import-start-results-reply');
            }
        });
    })
    .on('import-end-results-request', (event, filePath) => {
        let source = filePath;
        let destination = path.join(__dirname, '/../src/app-server/excels/end_results.csv');
        file.copyFile(source, destination, {
            done: (err) => {
                event.sender.send('import-end-results-reply');
            }
        });
    })
    .on('import-participants-request', (event, arg) => {
        ExcelServices.deleteCsv();
        ExcelServices.createCsv();
        ExcelServices.convertXlsxToCsv(arg, (success) => {
            ExcelServices.getParticipants(function (participants) {
                event.sender.send('import-participants-reply', success, participants);
            });
        });
    });
