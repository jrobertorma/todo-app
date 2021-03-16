import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';


const AccountPage = () => {
    return ( 
        <AuthUserContext.Consumer>
            {
                (authUser) => {
                    <div>
                        <h1>Account: {authUser.email}</h1>
                        <PasswordForgetForm />
                        <PasswordChangeForm />
                    </div>
                }
            }
        </AuthUserContext.Consumer>
     );
}

const condition = authUser => !!authUser; // '!!expression', returns the 'truthiness' of expression

export default withAuthorization (condition)(AccountPage);

/**
 * COMPONENTS ARE NOT RENDERED YOU ARE WORKING HERE LOL <--------------->
 */