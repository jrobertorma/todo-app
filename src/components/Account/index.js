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

    //start of the component's lifecycle
    componentDidMount() {
        this.fetchSignInMethods();
    }

    //gets the signIn methods associated to the logged user and stores them in the 'activeSignInMethods' state
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

    onDefaultLoginLink = (password) => {
        const credential = this.props.firebase.emailAuthProvider.credential(
            this.props.authUser.email,
            password,
        );

        this.props.firebase.auth.currentUser
            .linkAndRetrieveDataWithCredential(credential)
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
                        //this returns true if there is only one sign in method in the state
                        const onlyOneLeft = activeSignInMethods.length === 1; 

                        /*we have two set of signInMethods, the 'activeSignInMethods' state which stores the returned sign in methods from
                        * the fetchSignInMethodsForEmail() firebase method, and the SIGN_IN_METHODS constant, we are going through each item
                        * of the constant (it is better to use the foreach() method, map() was designed to create a new array based on an 
                        * existent array see https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
                        * 
                        * Well, in each of the SIGN_IN_METHODS we check if it is included in the 'activeSignInMethods' state, so we know
                        * if it is active or not (if it isn't in the state then it is disabled)
                        * 
                        * And after that we create a list with the components that allow the user to enable it or disable it (the current 
                        * sign in method, remember we are inside a map, similar to a for loop)
                        * */ 
                        const isEnabled = activeSignInMethods.includes(
                            signInMethod.id,
                        );

                        return( 
                            <li key={signInMethod.id}>
                                {
                                    signInMethod.id === 'password' ? (
                                    <DefaultLoginToggle 
                                        onlyOneLeft={onlyOneLeft}
                                        isEnabled={isEnabled}
                                        signInMethod={signInMethod}
                                        onLink={this.onDefaultLoginLink}
                                        onUnlink={this.onUnlink}
                                    /> ): (
                                    <SocialLoginToggle 
                                        onlyOneLeft={onlyOneLeft}
                                        isEnabled={isEnabled}
                                        signInMethod={signInMethod}
                                        onLink={this.onSocialLoginLink}
                                        onUnlink={this.onUnlink}
                                    />    
                                    )
                                }
                            </li> 
                        );
                    } )}
                </ul>
                
                {error && error.message}

            </div>
        );
    }
}

const SocialLoginToggle = ({
    onlyOneLeft,
    isEnabled,
    signInMethod,
    onLink,
    onUnlink,
}) => {
    isEnabled ? (
        <button 
            type="button"
            onClick={() => onUnlink(signInMethod.id)}
            disabled={onlyOneLeft}
        >
            Deactivate {signInMethod.id}
        </button>
    ) : (
        <button
            type="button"
            onClick={() => onLink(signInMethod.provider)}
        >
            Link {signInMethod.id}
        </button>
    )
}

class DefaultLoginToggle extends Component {
    constructor(props) {
        super(props);
        this.state = { passwordOne: '', passwordTwo: '' }
    }

    onSubmit = (event) => {
        event.preventDefault();

        this.props.onLink(this.state.passwordOne);
        this.setState({ passwordOne: '', passwordTwo: '' });
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() { 
        const {
            onlyOneLeft,
            isEnabled,
            signInMethod,
            onUnlink,
        } = this.props;

        const { passwordOne, passwordTwo } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo || passwordOne === '';

        return ( 
            isEnabled ? (
                <button
                    type="button"
                    onClick={ () => onUnlink(signInMethod.id) }
                    disabled={onlyOneLeft}
                >
                    Deactivate {signInMethod.id}
                </button>
            ) : (
                <form onSubmit={this.onSubmit}>
                    <input
                        name="passwordOne"
                        value={passwordOne}
                        onChange={this.onChange}
                        type="password"
                        placeholder="New Password"
                    />
                    <input
                        name="passwordTwo"
                        value={passwordTwo}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Confirm New Password"
                    />

                    <button disabled={isInvalid} type="submit">
                        Link {signInMethod.id}
                    </button>
                </form>
            )
        )
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
 * See how it is exported: using the withAuthorization HOC created at src\components\Session\withAuthorization.js (line 230).
 * 
 * That component checks if the user is logged in (using the 'condition' function, line 228), and depending on that calls the second
 * parameter (AccountPage in this case, line 65).
 * 
 * Notice how the component uses the 'authUser' object. That is possible because the withAuthorization HOC, passes it as a prop at some
 * point (see the HOC's notes).
 * 
 * The <AccountPage /> component displays thse forms (<PasswordForgetForm />, <PasswordChangeForm />) and a component to handle the login 
 * management of the social accounts. i.e. <LoginManagement authUser={authUser} />
 * 
 * That component fetch the sign in methods for the logged user (we passed it as authUser), see the componentDidMount() event and the 
 * fetchSignInMethods() method. Which calls the firebase.auth method 'fetchSignInMethodsForEmail()' that in change returns a set of signIn 
 * methods and we store them in the activeSignInMethods state.
 * 
 * 
 * 
 * 
 * 
 *                   
 * 
 */