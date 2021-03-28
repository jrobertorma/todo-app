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
            //onAuthUserListener is defined at src\components\Firebase\firebase.js
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    this.setState({ authUser });
                },
                () => {
                    this.setState({ authUser: null });
                },
            )
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
 * state of the App component. This HOC handles the local state of the user, withAuthorization handles redirection.
 * 
 * We set the authUser state in the componentDidMount function (lines 17 -25).
 * 
 * Notice how we call firebase.onAuthUserListener(), it takes two callback functions as parameters, the first one is used when the user is
 * logged in, and the second one when it isn't.
 * 
 * onAuthUserListener() uses a listner. "Firebase offers a listener function to get the authenticated user from Firebase" (onAuthStateChanged).
 * 
 * "onAuthStateChanged() receives a function as parameter that has access to the authenticated user. Also, the passed function is called every 
 * time something changes for the authenticated user."
 * 
 * "If a user signs out, the authUser object becomes null, so the authUser property in the local state is set to null and all components 
 * depending on it adjust their behavior (e.g. display different options like the Navigation component)."
 * 
 * Note how we added 'AuthUserContext' and set the authUser state as it's provider (lines 34 and 36).
 * 
 * Now we can call the 'AuthUserContext' context and use it to know the authUser state without needing to pass it through the component tree
 * (see src\components\Navigation\index.js to see how do you call the context). 
 * 
 * This pattern is called 'higher order component', wich basically means: 'a function that takes a component and returns a new component' 
 * see https://reactjs.org/docs/higher-order-components.html for more about this.
 */