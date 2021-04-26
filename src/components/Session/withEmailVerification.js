import React from "react";

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

/**
 * Gets a user and if exist (first authUser && string) 
 * the function checks if the user has not verified the email address (!authUser.emailVerified, 
 * if the method returns true the ! negates it and the && conditional gets a false, passing
 * that value to the function summoner).
 * 
 * Then the functions gets the signIn methods associated to the user,
 * if there are no methods with the prop 'password' the user is not using 
 * the email and password method and therefore we don't need to validate 
 * the email verification, the function returns false on that case.
 * 
 * But if there is a 'password' value, the function returns true, this means
 * the user needs to do the emailVerification
 */
const needsEmailVerification = (authUser) => {
    authUser && 
        !authUser.emailVerified && 
            authUser.providerData
            .map (provider => provider.providerId)
            .includes('password');
}

const withEmailVerification = Component => {
    class WithEmailVerification extends React.Component {
        onSendEmailVerification = () => {
            this.props.firebase.doSendEmailVerification();
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    { authUser => 
                        needsEmailVerification(authUser) ? (
                            <div>
                                <p>
                                    Verify your E-Mail: Check you E-Mails (Spam folder
                                    included) for a confirmation E-Mail or send
                                    another confirmation E-Mail.
                                </p>

                                <button
                                    type="button"
                                    onClick={this.onSendEmailVerification}
                                >
                                    Send confirmation E-mail
                                </button>
                            </div>
                        ) : (
                            <Component {...this.props} /> 
                        )
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return withFirebase(WithEmailVerification);
}

export default withEmailVerification;

/**
 * withEmailVerification HOC returns the WithEmailVerification class component.
 * 
 * The component has a handler that calls the doSendEmailVerification() function (defined at the firebase.js file)
 * in the render() function gets the authUser object and call needsEmailVerification() with the object as argument.
 * 
 * That function returns 'true' if the user has the mail and password sign in method activated and has not verified the
 * provided email address, if the user doesn't need the email verification or has already done it the function returns
 * 'false'
 * 
 * The render() function catches the returned value of needsEmailVerification() and uses a ternary operator to decide what
 * to do next.
 * 
 * If the value is 'true' it displays a message and a button to resend the email verification link (the same we used at
 * src\components\SignUp\index.js).
 * 
 * If the value is 'false' the component returns the original component with all its props.
 */