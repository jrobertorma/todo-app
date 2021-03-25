import React from 'react';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

import AuthUserContext from './context';

const withAuthorization = (condition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            //firebase observer, keeps the authUser state on check
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                (authUser) => {
                    if(authUser) {
                        this.props.firebase
                            .user(authUser.uid)
                            .once('value')
                            .then(snapshot => {
                                const dbUser = snapshot.val();

                                //default empty roles
                                if (!dbUser.roles) {
                                    dbUser.roles = {};
                                }

                                //merge auth and db user
                                authUser = {
                                    uid: authUser.uid,
                                    email: authUser.email,
                                    ...dbUser,
                                };

                                if (!condition(authUser)) {
                                    this.props.history.push(ROUTES.SIGN_IN)
                                }
                            });
                    } else {
                        this.props.history.push(ROUTES.SIGN_IN)
                    }
                },
            );
        }

        componentWillUnmount(){
            this.listener();
        }

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
 * This case is a little different because withAuthorization gets a function with a component as a parameter as the function parameter.
 * 
 * e.g withAuthorization( someFunction ) ( someComponent )
 * 
 * The componentDidMount is the part of the component that implements the route protection.
 * It creates an 'observer' (see the comments in src\components\Session\withAuthentication.js), and checks if a user is logged in or not.
 * Then it calls the function that we previously passed as a paramenter and executes it with the authUser state as an argument 
 * (someFunction in our example).
 * 
 * If the function throws an error (for instance, because the authUser state is null), componentDidMount will redirect to ROUTES.SIGN_IN
 * (remember we use withRouter, so we can call the navigation history prop, see line 38).
 * 
 * If authUser passes the function, the componentDidMount will do nothing and the render function will be called. Where we call the 
 * AuthUserContext defined at src\components\Session\context.js.
 * 
 * Now the return function is able to know the user state and return the Component (received as a parameter) or 'null' (line 31), notice
 * how we also pass every prop to the wrapped component with {...this.props}, wich means it will be capable of use the 'authUser' object.
 * 
 * This protect the component of being exposed if the redirection takes too much time or something else happens.
 * 
 * All of this basically means: 'If the user is not logged in, I'm going to return 'null' instead of the component someone passed me'. 
 */