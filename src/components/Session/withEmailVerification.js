import React from "react";

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

/**
 * Gets a user and if exist (first authUser && string) 
 * the function checks if the user has not verified the email address (!authUser.emailVerified, 
 * if the method returns true the ! negates it and the && conditional gets a false, passing
 * that value to the function invoquer).
 * 
 * Then the functions gets the signIn methods associated to the user
 * if there are no methods with the prop 'password' that means that 
 * the user is not using the email and password method and therefore
 * we don't need to validate the email verification, the function returns
 * false on that case
 */
const needsEmailVerification = (authUser) => {
    authUser && 
        !authUser.emailVerified && 
            authUser.providerData
            .map (provider => provider.providerId)
            .includes('password')
}

const withEmailVerification = Component => {
    class WithEmailVerification extends React.Component {
        render() {
            return (
                <AuthUserContext.Consumer>
                    { authUser => <Component {...this.props} /> }
                </AuthUserContext.Consumer>
            );
        }
    }

    return withFirebase(WithEmailVerification);
}

export default withEmailVerification;

/**
 * withEmailVerification HOC returns the WithEmailVerification class component. That component renders the context from AuthUserContext
 * and returns the passed component with all the props of its parent, i.e. the withFirebase and the context.
 * 
 * 
 */