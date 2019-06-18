// store/AppProviderjs
import React, { createContext, Component } from "react";

/**
 * `createContext` contient 2 propriétés :
 * `Provider` et `Consumer`. Nous les rendons accessibles
 * via la constante `UserContext`, et on initialise une
 * propriété par défaut : "name" qui sera une chaine vide.
 * On exporte ce contexte afin qu'il soit exploitable par
 * d'autres composants par la suite via le `Consumer`
 */
export const UserContext = createContext({
    displayPage: "",
    setDisplayPage: () => {},
    listeParticipants: [],
    setListeParticipants: () => {},
    addParticipant: () => {},
    inputStartRace: "",
    setInputStartRace: () => {},
    firstInput: true,
    setFirstInput: () => {},
    inputsFormEnd: {},
    setInputFormEnd: () => {},
    histoParticipantEnd: [],
    addHistoParticipantEnd: () => {},
    setHistoParticipantEnd: () => {},
    histoParticipantStart: [],
    addHistoParticipantStart: () => {},
    setHistoParticipantStart: () => {},
});

/**
 * la classe AppProvider fera office de... Provider (!)
 * en wrappant son enfant direct
 * dans le composant éponyme. De cette façon, ses values
 * seront accessible de manière globale via le `Consumer`
 */
class AppProvider extends Component {
    state = {
        displayPage: 1,
        setDisplayPage: (page) => this.setState((state, props) => {
            return { displayPage: page}
        }),
        listeParticipants: [],
        setListeParticipants: (liste) => this.setState((state, props) => {
            return { listeParticipants: liste };
        }),
        addParticipant: (participant, name, firstname, team) => this.setState((state, props) => {
            const myParticipants = state.listeParticipants;
            myParticipants.push({ dossard: participant, nom: name, prenom: firstname, team: team });
            return { listeParticipants: myParticipants}
        }),
        inputStartRace: "",
        setInputStartRace: (inputValue) => this.setState((state, props) => {
            if(inputValue !== null && inputValue.length === 1 && this.state.firstInput && inputValue[0].team !== '') {
                    var teamMembersNormalise = [];
                    let teamMembers = this.state.listeParticipants.filter(participant => participant.team === inputValue[0].team);
                    teamMembers.map((row, index) => {
                        teamMembersNormalise.push(
                            {
                                label: row.dossard + ' - ' + row.nom + ' ' + row.prenom,
                                value: row.dossard,
                                nom: row.nom,
                                prenom: row.prenom,
                                team: row.team
                            }
                        );
                    });
                    this.state.firstInput = false;
            } else {
                this.state.firstInput = true;
            }
            let inputs = teamMembersNormalise === undefined ? inputValue : teamMembersNormalise;
            return {inputStartRace: inputs}
        }),
        firstInput: true,
        setFirstInput: (value) => {
            this.setState({firstInput: value});
        },
        inputsFormEnd: [
            { id: 0, inputValue: ""},
            { id: 1, inputValue: ""},
            { id: 2, inputValue: ""},
            { id: 3, inputValue: ""},
            { id: 4, inputValue: ""},
            { id: 5, inputValue: ""},
        ],
        setInputFormEnd: (idInput, value) => this.setState((state, props) => {
            const newItems = state.inputsFormEnd;
            newItems[idInput].inputValue = value;
            return { inputsFormEnd: newItems}
        }),
        histoParticipantEnd: [],
        setListeHistoEnd: (liste) => this.setState((state, props) => {
            return { histoParticipantEnd: liste };
        }),
        addHistoParticipantEnd: (dossart, temps) => this.setState((state, props) => {
            const newItems = state.histoParticipantEnd;
            newItems.unshift({dossard: dossart, time: temps});
            return { histoParticipantEnd: newItems}
        }),
        setHistoParticipantEnd: (liste) => this.setState((state, props) => {
            return { histoParticipantEnd: liste };
        }),
        histoParticipantStart: [],
        setListeHistoStart: (liste) => this.setState((state, props) => {
            return { histoParticipantStart: liste };
        }),
        addHistoParticipantStart: (dossard, time) => this.setState((state, props) => {
            const newItems = state.histoParticipantStart;
            newItems.unshift({dossard: dossard, time: time});
            return { histoParticipantStart: newItems}
        }),
        setHistoParticipantStart: (liste) => this.setState((state, props) => {
            return { histoParticipantStart: liste };
        }),
    };

    render() {
        return (
            /**
             * la propriété value est très importante ici, elle rend ici
             * le contenu du state disponible aux `Consumers` de l'application
             */
            <UserContext.Provider value={this.state}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

/**
 * La fonction `withUser` sera notre HOC
 * qui se chargera d'injecter les propriétés de notre contexte
 * à n'importe quel composant qui l'appellera
 */
export const withUser = Component => props => (
    <UserContext.Consumer>
        {store => <Component {...props} {...store} />}
    </UserContext.Consumer>
);

export default AppProvider;
