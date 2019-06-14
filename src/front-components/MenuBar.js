import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PageStart from "./PageStart";
import PageEnd from "./PageEnd";
import MenuDrawer from './MenuDrawer';

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

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

function NavTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(1);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs variant="fullWidth" value={value} onChange={handleChange}>
                    <MenuDrawer />
                    <LinkTab label="Départ" />
                    <LinkTab label="Arrivée"/>
                </Tabs>
            </AppBar>
            {(value === 0 || value === 1 )&& <TabContainer key="1">
                <PageStart/>
            </TabContainer>}
            {value === 2 && <TabContainer key="2">
                <PageEnd/>
            </TabContainer>}
        </div>
    );
}

export default NavTabs;
