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

function NavTabs(props) {
    const { classes } = props;

    function handleChange(event, newValue) {
        props.setDisplayPage(newValue);
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs variant="fullWidth" value={props.displayPage} onChange={handleChange}>
                    <MenuDrawer />
                    <LinkTab label="Départ" />
                    <LinkTab label="Arrivée"/>
                    <LinkTab className={classes.hidden} label="PageVisualiseParticipants"/>
                    <LinkTab className={classes.hidden} label="PageDocumentation"/>
                    <LinkTab className={classes.hidden} label="PageExports"/>
                </Tabs>
            </AppBar>
            {(props.displayPage === 0 || props.displayPage === 1 )&& <TabContainer key="1">
                <PageStart/>
            </TabContainer>}
            {props.displayPage === 2 && <TabContainer key="2">
                <PageEnd/>
            </TabContainer>}
            {props.displayPage === 3 && <TabContainer key="3">
                <PageVisualiseParticipants/>
            </TabContainer>}
            {props.displayPage === 4 && <TabContainer key="4">
                <PageDocumentation/>
            </TabContainer>}
            {props.displayPage === 5 && <TabContainer key="5">
                <PageExports/>
            </TabContainer>}
        </div>
    );
}

export default withUser(withStyles(styles)(NavTabs));
