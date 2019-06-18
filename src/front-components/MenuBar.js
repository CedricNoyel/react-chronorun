import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PageStart from "./PageStart";
import PageEnd from "./PageEnd";
import MenuDrawer from './MenuDrawer';
import {withUser} from "./store/AppProvider";
import PageVisualiseParticipants from "./PageVisualiseParticipants";
import PageDocumentation from "./PageDocumentation";
import PageExports from "./PageExports";
const ipcRenderer = window.require('electron').ipcRenderer;

function TabContainer(props) {
    return (
        <Typography component="div">
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={event => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    hidden: {
        display: 'none',
    }
});

class NavTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listeparticipant: this.getParticipants(),
        };
        this.handleChange = this.handleChange.bind(this);
        this.getParticipants = this.getParticipants.bind(this);
    }
    getParticipants() {
        ipcRenderer.send('request-liste-participants');
        ipcRenderer.on('reply-liste-participants', (event, arg) => {
            let liste = JSON.stringify(arg);
            liste = liste.replace(/\"lastname\":/g, "\"nom\":");
            liste = liste.replace(/\"firstname\":/g, "\"prenom\":");
            this.props.setListeParticipants(JSON.parse(liste));
        });
    }

    handleChange(event, newValue) {
        this.props.setDisplayPage(newValue);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Tabs variant="fullWidth" value={this.props.displayPage} onChange={this.handleChange}>
                        <MenuDrawer />
                        <LinkTab label="Départ" />
                        <LinkTab label="Arrivée"/>
                        <LinkTab className={classes.hidden} label="PageVisualiseParticipants"/>
                        <LinkTab className={classes.hidden} label="PageDocumentation"/>
                        <LinkTab className={classes.hidden} label="PageExports"/>
                    </Tabs>
                </AppBar>
                {(this.props.displayPage === 0 || this.props.displayPage === 1 )&& <TabContainer key="1">
                    <PageStart/>
                </TabContainer>}
                {this.props.displayPage === 2 && <TabContainer key="2">
                    <PageEnd/>
                </TabContainer>}
                {this.props.displayPage === 3 && <TabContainer key="3">
                    <PageVisualiseParticipants/>
                </TabContainer>}
                {this.props.displayPage === 4 && <TabContainer key="4">
                    <PageDocumentation/>
                </TabContainer>}
                {this.props.displayPage === 5 && <TabContainer key="5">
                    <PageExports/>
                </TabContainer>}
            </div>
        );
    }
}

export default withUser(withStyles(styles)(NavTabs));
