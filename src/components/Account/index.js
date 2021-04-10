import React, { Component } from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

const SIGN_IN_METHODS = [
    {
        id: 'password',
        provider: null,
    },
    {
        id: 'google.com',
        provider: 'googleProvider',
    },
    {
        id: 'facebook.com',
        provider: 'facebookProvider'
    },
];

const AccountPage = () => {
    return ( 
        <AuthUserContext.Consumer>
            {
                (authUser) => {
                    return (
                        <div>
                            <h1>Account: {authUser.email}</h1>
                            <PasswordForgetForm />
                            <PasswordChangeForm />
                            <LoginManagement authUser={authUser} />
                        </div>
                    );
                }
            }
        </AuthUserContext.Consumer>
     );
}

class LoginManagementBase extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            activeSignInMethods: [],
            error: null,
         };
    }

    componentDidMount() {
        this.fetchSignInMethods();
    }

    fetchSignInMethods = () => {
        this.props.firebase.auth
            .fetchSignInMethodsForEmail(this.props.authUser.email)
            .then( (activeSignInMethods) => {
                this.setState({ activeSignInMethods, error: null })
            })
            .catch( (error) => this.setState({ error }) )
    }

    onSocialLoginLink = (provider) => {
        this.props.firebase.auth.currentUser
            .linkWithPopup(this.props.firebase[provider])
            .then(this.fetchSignInMethods)
            .catch(error => this.setState({ error }))
    }

    onUnlink = (providerId) => {
        this.props.firebase.auth.currentUser
            .unlink(providerId)
            .then(this.fetchSignInMethods)
            .catch(error => this.setState({ error }))
    }

    render() {
        const { activeSignInMethods, error } = this.state;

        return ( 
            <div>
                Sign In Methods:
                <ul>
                    {SIGN_IN_METHODS.map( (signInMethod) => {
                        const onlyOneLeft = activeSignInMethods.length === 1;
                        const isEnabled = activeSignInMethods.includes(
                            signInMethod.id,
                        );

                        return( 
                            <li key={signInMethod.id}>
                                {
                                    isEnabled ? (
                                    <button 
                                        type="button" 
                                        onClick={ () => this.onUnlink(signInMethod.id) }
                                        disabled={onlyOneLeft}
                                    >
                                        Deactivate {signInMethod.id}
                                    </button> ): (
                                    <button 
                                        type="button" 
                                        onClick={ () => this.onSocialLoginLink(signInMethod.provider) }
                                    >
                                        Link {signInMethod.id}
                                    </button> )
                                }
                            </li> );
                    } )}
                </ul>
                
                {error && error.message}

            </div>
        );
    }
}

const LoginManagement = withFirebase (LoginManagementBase);

const condition = authUser => !!authUser; // '!!expression', returns the 'truthiness' of expression

export default withAuthorization (condition)(AccountPage);

/**
 * Displayed on the '/account' route.
 * 
 * This component displays the user's mail and two forms to reset his/her's password, via mail reset or by typing the new password.
 * 
 * See how it is exported: using the withAuthorization HOC created at src\components\Session\withAuthorization.js (line 67).
 * 
 * That component checks if the user is logged in (using the 'condition' function, line 65), and depending on that calls the second
 * parameter (AccountPage in this case, line 65).
 * 
 * Note how the component uses the 'authUser' object. That is possible because the withAuthorization HOC, passes it as a prop at some
 * point (see the HOC's notes).
 */