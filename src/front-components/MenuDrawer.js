import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DirectionsRun from '@material-ui/icons/DirectionsRun';
import AddCircle from '@material-ui/icons/AddCircle';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Assignment from '@material-ui/icons/Assignment';
import Help from '@material-ui/icons/Help';
import Copyright from '@material-ui/icons/Copyright';
import Menu from '@material-ui/icons/Menu';

import NewRace, {openNewRace} from './NewRace';

const useStyles = makeStyles(theme => ({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    menu: {
        float: 'left',
    },
    menuBar: {
        backgroundColor: '#3f51b5',
    }
}));

export default function TemporaryDrawer() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const handleClick = (action) => {
        if(action == 'Nouvelle course') {
            console.log('Nouvelle course');
            openNewRace();
        }
    }

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    let listIconsFirstPart = [<DirectionsRun />,<AddCircle />, <RemoveRedEye />];
    let listIconsSecondPart = [<Assignment />];
    let listIconsThirdPart = [<Help />, <Copyright />];

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {['Nouvelle course', 'Ajout participant', 'Visualisation départs / arrivés'].map((text, index) => (
                    <ListItem button key={text} onClick={() => handleClick(text)}>
                        <ListItemIcon> {listIconsFirstPart[index]}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Export des résultats'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon> {listIconsSecondPart[index]} </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Documentation', 'Crédits'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon> {listIconsThirdPart[index]} </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <div className={classes.menuBar}>
            <Button className={classes.menu} onClick={toggleDrawer('left', true)}><Menu/></Button>
            <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                {sideList('left')}
            </Drawer>

            <NewRace/>
        </div>
    );
}