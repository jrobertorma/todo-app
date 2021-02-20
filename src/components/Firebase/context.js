import React from 'react';

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
      {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);

export default FirebaseContext;

/**
 * Create the Firebase context so we don't have to create multiple firebase instances, this file is called by Firebase/index.js
 * note the withFirebase component, it recieves a component as a prop and then re-render it wrapped between the FirebaseContext
 * this allow any component to use the firebase context, without needing any parent component to pass it before
 */