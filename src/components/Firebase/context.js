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
 * note the withFirebase component, it recieves a component as a prop and then re-renders it wrapped between the FirebaseContext
 * this allow any component to use the firebase context, without needing any parent component to pass it before by simply calling it
 * with the 'withFirebase' function like this:
 * 
 * withFirebase(SignUpFormBase)
 * 
 * SignUpFormBase, now can access firebase functions like:
 * 
 * this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
              })
              .catch(error => {
                  this.setState({ error });
              });
 *
 * This pattern is called 'higher order component', wich basically means: 'a function that takes a component and returns a new component' 
 * see https://reactjs.org/docs/higher-order-components.html form more info.
 */