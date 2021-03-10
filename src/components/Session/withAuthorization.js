import React from 'React';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

const withAuthorization = (condition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount(){
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                (authUser) => {
                    if(!condition(authUser)){
                        this.props.history.push(ROUTES.SIGN_IN);
                    }
                },
            );
        }

        componentWillUnmount(){
            this.listener();
        }

        render() {
            return <Component {...this.props} />
        }
    }

    return withRouter( withFirebase( WithAuthorization ) );
};

export default withAuthorization;

/**
 * The withAuthorization HOC (higher order component).
 * 
 * It'll allow us to add the authorization bussiness logic to the other components.
 * 
 * This case is a little different because withAuthorization gets a function with a component as a parameter as the function parameter.
 * 
 * e.g withAuthorization( someFunction( someComponent ) )
 * 
 * The componentDidMount is the part of the component that implements the route protection.
 * It creates an 'observer' (see the comments in src\components\Session\withAuthentication.js), and checks if a user is logged in or not.
 * Then it calls the function that we previously passed as a paramenter and executes it with the authUser state as an argument (someFunction
 * in our example).
 * 
 * If the function throws an error (for instance, because the authUser state is null), componentDidMount will redirect to ROUTES.SIGN_IN
 * (remember we use withRouter, so we can call the navigation history prop, see line 29).
 * 
 * If authUser passes the function, the componentDidMount will do nothing and the render function will be called, wich means the component
 * we passed early, will be rendered (someComponent in the example).
 */