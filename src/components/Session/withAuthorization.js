import React from 'react';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

import AuthUserContext from './context';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            //onAuthUserListener is defined at src\components\Firebase\firebase.js
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    if(!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGN_IN);
                    }
                },
                () => this.props.history.push(ROUTES.SIGN_IN),
            );
        }

        //The app breaks if uncommented, check in later stages
        // componentWillUnmount(){
        //     this.listener();
        // }

        render() {
            return (
              <AuthUserContext.Consumer>
                  {
                      authUser => condition(authUser) ? <Component {...this.props} /> : null
                  }
              </AuthUserContext.Consumer>  
            )
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
 * This HOC handles redirections, withAuthentication handles the local state of the user.
 * 
 * This case is a little different because withAuthorization gets a function with a component as a parameter as the function parameter.
 * 
 * e.g withAuthorization( someFunction ) ( someComponent )
 * 
 * The componentDidMount is the part of the component that implements the route protection.
 * It creates an 'observer' (see the comments in src\components\Session\withAuthentication.js), and checks if a user is logged in or not.
 * 
 * Then uses the logged user uid to fetch its aditional data from the db (line 22), if there isn't any role data it will create an empty 
 * object to store it later (line 26) and will merge the authUser data with the db data (line 31). 
 * 
 * Then it calls the function that we previously passed as a paramenter and executes it with the authUser state as an argument 
 * (someFunction in our example). If the function throws an error (for instance, because the authUser state is null), componentDidMount 
 * will redirect to ROUTES.SIGN_IN (remember we use withRouter, so we can call the navigation history prop, see line 39).
 * 
 * If authUser passes the function, the componentDidMount will do nothing and the render function will be called. Where we call the 
 * AuthUserContext defined at src\components\Session\context.js.
 * 
 * Now the return function is able to know the user state and return the Component (received as a parameter) or 'null' (line 58), notice
 * how we also pass every prop to the wrapped component with {...this.props}, wich means it will be capable of use the 'authUser' object.
 * 
 * This protect the component of being exposed if the redirection takes too much time or something else happens.
 * 
 * All of this basically means: 'If the user is not logged in, I'm going to return 'null' instead of the component someone passed me 
 * (and will merge the authUser state with the db data for that user, remember firebase manages its users but we added more data for our 
 * evil purposes lol, see src\components\SignUp\index.js at line 44)'. 
 */