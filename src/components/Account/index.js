import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

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
                        </div>
                    );
                }
            }
        </AuthUserContext.Consumer>
     );
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