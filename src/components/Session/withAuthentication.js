import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props){
            super(props);

            this.state = {
                authUser: null,
            }
        }

        componentDidMount() {
            //firebase observer
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                (authUser) => {
                    if(authUser) {
                        this.props.firebase
                            .user(authUser.uid)
                            .once('value')
                            .then(snapshot => {
                                const dbUser = snapshot.val();

                                //if the user (in the db) doesn't have roles, set empty roles
                                if(!dbUser.roles){
                                    dbUser.roles = {};
                                }

                                //merge auth and db user
                                authUser = {
                                    uid: authUser.uid,
                                    email: authUser.email,
                                    ...dbUser
                                }

                                //set the state to pass to children components
                                this.setState({ authUser });
                            })
                    } else {
                        this.setState({ authUser: null });
                    }
                }
            );
        }
        
        componentWillUnmount() {
            this.listener();
        }

        render() {
            return(
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }

    return withFirebase(WithAuthentication);
};

export default withAuthentication;

/**
 * Since we are not going to use a state management library (on the first version at least), the user's sessions will be stored in the react
 * state of the App component.
 * 
 * We pass it as a prop to the <Navigation> component, and then we can add some conditional rendering depending on
 * the authUser state (line 32)
 * 
 * We set the authUser state in the componentDidMount function (line 18). 
 * 
 * "Firebase offers a listener function to get the authenticated user from Firebase" (onAuthStateChanged), and we use it as a prop because we
 * added withFirebase(App) at the return statement.
 * 
 * "onAuthStateChanged() receives a function as parameter that has access to the authenticated user. Also, the passed function is called every 
 * time something changes for the authenticated user."
 * 
 * "If a user signs out, the authUser object becomes null, so the authUser property in the local state is set to null and all components 
 * depending on it adjust their behavior (e.g. display different options like the Navigation component)."
 * 
 * Note how we added 'AuthUserContext' and set the authUser state as it's provider (lines 33 and 35).
 * 
 * Now we can call the 'AuthUserContext' context and use it to know the authUser state without needing to pass it trhough the component tree
 * (see src\components\Navigation\index.js to see how do you call the context). 
 * 
 * This pattern is called 'higher order component', wich basically means: 'a function that takes a component and returns a new component' 
 * see https://reactjs.org/docs/higher-order-components.html for more about this.
 */