// store/AppProviderjs
import React, { createContext, Component } from "react"; // on importe createContext qui servira à la création d'un ou plusieurs contextes

/**
 * `createContext` contient 2 propriétés :
 * `Provider` et `Consumer`. Nous les rendons accessibles
 * via la constante `UserContext`, et on initialise une
 * propriété par défaut : "name" qui sera une chaine vide.
 * On exporte ce contexte afin qu'il soit exploitable par
 * d'autres composants par la suite via le `Consumer`
 */
export const UserContext = createContext({
    listeParticipants: [],
    inputStartRace: "",
    setInputStartRace: () => {},
    inputsFormEnd: {},
    setInputFormEnd: () => {},
    histoParticipantEnd: [],
    addHistoParticipantEnd: () => {},
    histoParticipantStart: {},
    addHistoParticipantStart: () => {},
});

/**
 * la classe AppProvider fera office de... Provider (!)
 * en wrappant son enfant direct
 * dans le composant éponyme. De cette façon, ses values
 * seront accessible de manière globale via le `Consumer`
 */
class AppProvider extends Component {
    state = {
        listeParticipants: [
            { dossard: '1', nom: 'NOYEL', prenom: 'Cédric', team: 1 },
            { dossard: '2', nom: 'GENEVE', prenom: 'Jordan', team: 2 },
            { dossard: '3', nom: 'LE GALLOUDEC', prenom: 'Samy', team: 2 },
            { dossard: '4', nom: 'MAURICE', prenom: 'Poisson', team: 2 },
            { dossard: '5', nom: 'LE MENN', prenom: 'Florian', team: null },
        ],
        inputStartRace: "",
        setInputStartRace: (inputValue) => this.setState((state, props) => {
            return {inputStartRace: inputValue}
        }),
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
            newItems[idInput].inputValue = value
            return { inputsFormEnd: newItems}
        }),
        histoParticipantEnd: [],
        addHistoParticipantEnd: (idParticipant, dossart, temps) => this.setState((state, props) => {
            const newItems = state.histoParticipantEnd;
            newItems.unshift({id: idParticipant, participant: dossart, time: temps});
            console.log(newItems)
            return { histoParticipantEnd: newItems}
        }),
        histoParticipantStart: {
            participant: [],
            time: []
        },
        addHistoParticipantStart: (participant, time) => this.setState((state, props) => {
            const newItems = state.histoParticipantStart;
            newItems.participant.unshift(participant);
            newItems.time.unshift(time);
            return { histoParticipantStart: newItems}
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
