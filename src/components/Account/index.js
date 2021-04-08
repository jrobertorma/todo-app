import React, { Component } from 'react';

import { AuthUserContext, withAuthorization } from '../Session';

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

class LoginManagement extends Component {
    constructor(props) {
        super(props);
        // this.state = {  }
    }
    render() { 
        return ( 
            <div>
                Sign In Methods:
                <ul>
                    {SIGN_IN_METHODS.map( (signInMethod) => {
                        return( <li key={signInMethod.id}>
                                    <button type="button" onClick={ () => {} }>
                                        {signInMethod.id}
                                    </button>
                                </li> );
                    } )}
                </ul>
            </div>
        );
    }
}

const condition = authUser => !!authUser; // '!!expression', returns the 'truthiness' of expression

export default withAuthorization (condition)(AccountPage);

/**
 * Displayed on the '/account' route.
 * 
 * This component displays the user's mail and two forms to reset his/her's password, via mail reset or by typing the new password.
 * 
 * See how it is exported: using the withAuthorization HOC created at src\components\Session\withAuthorization.js (line 28).
 * 
 * That component checks if the user is logged in (using the 'condition' function, line 26), and depending on that calls the second
 * parameter (AccountPage in this case, line 28).
 * 
 * Note how the component uses the 'authUser' object. That is possible because the withAuthorization HOC, passes it as a prop at some
 * point (see the HOC's notes).
 */