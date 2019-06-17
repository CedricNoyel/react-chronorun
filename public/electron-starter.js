const electron = require('electron');
const ipcMain = electron.ipcMain; // get html events
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('file-system');
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
        titleBarStyle: 'hidden'
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
            console.log('request-liste-participants');
            event.sender.send('reply-liste-participants', data);
        });
    })
    .on('end-add-participant', (event, arg1, arg2) => {
        ExcelServices.addStopTime(arg1, arg2);
    })
    .on('add-team', (event, arg) => {
        console.log("TODO add participant to a team");
    })
    .on('add-participant', (event, arg) => {
        console.log(arg);
        ExcelServices.addParticipant(arg.dossard, arg.lastname, arg.firstname, arg.team);
    })
    .on('start-add-participants', (event, dossard, timestamp) => {
        ExcelServices.addStartTime(dossard, timestamp);
    })
    .on('import-participants', (event, arg) => {
        console.log("argument : ", arg);
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
        console.log(source);
        console.log(destination);
        fs.copyFile(source, destination, {
            done: (err) => {
                event.sender.send('dl-template-reply');
            }
        });
    })
    .on('import-participants-request', (event, arg) => {
        ExcelServices.convertXlsxToCsv(arg, (data) => {
            console.log(data);
            event.sender.send('import-participants-reply');
        });
    });
