import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import logo from '../assets/img/logo.svg';

const {ipcRenderer} = window.require('electron')

const styles = theme => ({
    "myCustomClass": {
        backgroundColor: "#000000"
    },
    "leftIcon": {
        margin: 10,
    },
    hiddenInput: {
        display: 'none',
    },
});

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.onUploadParticipants = this.onUploadParticipants.bind(this);
    }
    onUploadParticipants(e) {
        console.log(e.target.files[0])
        this.setState({
            selectedFile: e.target.files[0]
        })
        ipcRenderer.send('import-participants', e.target.files[0].path);
        
        ipcRenderer.on('reply-import-participants', (event, args) => {
            alert(args);
        })
    }

    

    onEditParticipants(){
        var numbers = []; //En 0 on met le numéro que l'on veut modifier, en 1 le numéro que l'on souhaite mettre
        //TODO : Aller chercher les numéros dans les input une fois qu'ils seront implémentés
        ipcRenderer.send('edit-participant', numbers);
    }
 
    handleClick() {
        alert('TELECHARGER FICHIER TEMPLATE');
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2 className={classes.myCustomClass}>Bienvenue sur chromiorun</h2>
                </div>
                <div>
                    <p>
                        Pour commencer veuillez importer la liste des participants :
                    </p>
                    <input
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        className={classes.hiddenInput}
                        id="input-file"
                        type="file"
                        onChange={this.onUploadParticipants}
                    />
                    <label htmlFor="input-file">
                        <Button variant="contained" component="span">
                            <CloudUploadIcon className={classes.leftIcon}/>
                            Charger le fichier des participants
                        </Button>
                    </label>
                    <p>Pour obtenir le template du fichier, <a href="#" onClick={this.handleClick}>cliquez ici</a>
                    </p>
                </div>
            </div>
    );
    }
}

export default withStyles(styles)(Home);

export function onEditParticipants(){
    var numbers = [1559070011559, 20]; //En 0 on met le numéro que l'on veut modifier, en 1 le numéro que l'on souhaite mettre
    //TODO : Aller chercher les numéros dans les input une fois qu'ils seront implémentés
    ipcRenderer.send('edit-participant', numbers);
}

export function exportResult(){
    ipcRenderer.send('export-csv');

    ipcRenderer.on('reply-export-csv-ok', (event, args) => {
        alert(args);
    });

    ipcRenderer.on('reply-export-csv-fail', (event, args) => {
        alert(args);
    })
}