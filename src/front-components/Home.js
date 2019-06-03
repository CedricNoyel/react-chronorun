import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import logo from '../assets/img/logo.svg';


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

