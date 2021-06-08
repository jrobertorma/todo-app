import React, { Component } from 'react';

import { AuthUserContext, withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

//List of all the sign in methods available to create an account
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
                        <Box mt={8}>
                            <Grid 
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-end"
                            >   
                                <Grid item xs={12}> <h1>Account: {authUser.email}</h1> </Grid>
                                
                                <Grid item xs={12}> 
                                    <Box my={1}> 
                                        <PasswordForgetForm /> 
                                    </Box> 
                                </Grid>

                                <Grid item xs={12}> 
                                    <Box my={1}> 
                                        <PasswordChangeForm /> 
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12}> 
                                    <Box my={1}> 
                                        <LoginManagement authUser={authUser} />
                                    </Box> 
                                </Grid>
                            </Grid>
                        </Box>
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

    /**
     * Gets a providerId and calls a popUp for the user to approve the social account
     * linking, then calls fetchSignInMethods() that uses this.setState() so every linked component
     * will be re-rendered.
     */
    onSocialLoginLink = (provider) => {
        this.props.firebase.auth.currentUser
            .linkWithPopup(this.props.firebase[provider])
            .then(this.fetchSignInMethods)
            .catch(error => this.setState({ error }))
    }

    /**
     * This function unlinks the sign in method asigned of the provided id (see unlink() method).
     * 
     * And then calls fetchSignInMethods() that uses this.setState() so every linked component
     * will be re-rendered.
     */
    onUnlink = (providerId) => {
        this.props.firebase.auth.currentUser
            .unlink(providerId)
            .then(this.fetchSignInMethods)
            .catch(error => this.setState({ error }))
    }

    /**
    * Gets a password and attaches it to the user (see linkAndRetrieveDataWithCredential method)
    * then calls fetchSignInMethods() that uses this.setState() so every linked component
    * will be re-rendered.
    */
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
            <Grid 
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-end"
            >
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Sign In Methods:
                    </Typography>
                </Grid>
                
                <Grid item xs={12}>
                    {SIGN_IN_METHODS.map( (signInMethod) => {
                        //this returns true if there is only one sign in method in the state
                        const onlyOneLeft = activeSignInMethods.length === 1; 

                        /*we have two set of signInMethods, the 'activeSignInMethods' state which stores the returned sign in methods from
                        * the fetchSignInMethodsForEmail() firebase method, and the SIGN_IN_METHODS constant, we are going through each item
                        * of the constant.
                        * 
                        * Well, in each of the SIGN_IN_METHODS we check if it is included in the 'activeSignInMethods' state, so we know
                        * if it is active or not (if it isn't in the state then it is disabled)
                        * */ 
                        const isEnabled = activeSignInMethods.includes(
                            signInMethod.id,
                        );

                        return(
                            /**
                             * We create a list item. If the signInMethod is the traditional 'password/email' we return the
                             * <DefaultLoginToggle /> component, if is of any other type (i.e.social login) we display the
                             * <SocialLoginToggle /> instead, we pass the handlers of each kind of signIn method to those
                             * components.
                             */
                                <Box my={1} key={signInMethod.id}>
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
                                </Box>
                        );
                    } )}
                
                </Grid> {/* grid item closing tag */}
                {error && error.message}

            </Grid> /* grid container closing tag */
        );
    }
}

/**
 * This component is called by a loop on the SIGN_IN_METHODS const. 
 * It is displayed if the signInMethod is not the traditional 'password/email'
 * 
 * onlyOneLeft is a constant wich value is 'true' if there is only one active
 * signIn method (see line 119).
 * 
 * isEnabled stores a 'true' value if the signIn method is included in the activeSignInMethods
 * state, which means is an active method for the user
 * 
 * signInMethod is the 'row' in the SIGN_IN_METHODS we are currently on, during the 'map loop'.
 * 
 * onLink passes onSocialLoginLink() function as a handler
 * onUnlink does the same with onUnlink(). (see the LoginManagementBase component)
 * 
 * SocialLoginToggle returns a button. If the isEnabled var returns 'true' it displays a button with
 * the onUnlink() function as the onClick handler, but is disabled if the onlyOneLeft var returns 'true'
 * so the user can't use it if there is no more active signInMethods for them.
 * 
 * If isEnabled returns 'false' the button has the onLink() function as the onClick handler so we can 
 * link the signIn method to the user.
 */
const SocialLoginToggle = ({
    onlyOneLeft,
    isEnabled,
    signInMethod,
    onLink,
    onUnlink,
}) => {
    return (
        isEnabled ? (
            <Button 
                disabled={onlyOneLeft} 
                onClick={() => onUnlink(signInMethod.id)}
                color="primary" 
                variant="contained"
            >
                Deactivate {signInMethod.id}
            </Button>

            // <button 
            //     type="button"
            //     onClick={() => onUnlink(signInMethod.id)}
            //     disabled={onlyOneLeft}
            // >
            //     Deactivate {signInMethod.id}
            // </button>
        ) : (

            <Button 
                onClick={() => onLink(signInMethod.provider)}
                color="primary" 
                variant="contained"
            >
                Link {signInMethod.id}
            </Button>

            // <button
            //     type="button"
            //     onClick={() => onLink(signInMethod.provider)}
            // >
            //     Link {signInMethod.id}
            // </button>
        )
    );
}

/**
 * This component is called by a loop on the SIGN_IN_METHODS const. 
 * It is displayed if the signInMethod is the traditional 'password/email'.
 * 
 * This component gets the same parameters of SocialLoginToggle (see its notes to know what do each of them mean).
 * 
 * If the value of isEnabled is 'true', the component displays a button with the onUnlink() function of <LoginManagementBase /> 
 * as the onClick handler. If the onlyOneLeft var is 'true' the button is disabled.
 * 
 * If the value of isEnabled is 'false', the component displays a form with two password fields (controled input, wich means 
 * they have a state and onChange handlers for the user input). The onSubmit handler of the form calls the onLink() 
 * function of <LoginManagementBase />
 */
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
                <Button 
                    disabled={onlyOneLeft} 
                    color="primary" 
                    variant="contained" 
                    type="button"
                    onClick={ () => onUnlink(signInMethod.id) }
                >
                    Deactivate {signInMethod.id}
                </Button>
                // <button
                //     type="button"
                //     onClick={ () => onUnlink(signInMethod.id) }
                //     disabled={onlyOneLeft}
                // >
                //     Deactivate {signInMethod.id}
                // </button>
            ) : (
                <form onSubmit={this.onSubmit}>
                    <Grid 
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-end"
                    >
                        <Grid item xs={2}>
                            <TextField  
                                id="passwordOne"
                                name="passwordOne"
                                label="New Password"
                                value={passwordOne}
                                onChange={this.onChange}
                                type="password"
                                required
                            />
                            {/* <input
                                name="passwordOne"
                                value={passwordOne}
                                onChange={this.onChange}
                                type="password"
                                placeholder="New Password"
                            /> */}
                        </Grid>
                        
                        <Grid item xs={2}>
                            <TextField  
                                id="passwordTwo"
                                name="passwordTwo"
                                label="Confirm New Password"
                                value={passwordTwo}
                                onChange={this.onChange}
                                type="password"
                                required
                            />

                            {/* <input
                                name="passwordTwo"
                                value={passwordTwo}
                                onChange={this.onChange}
                                type="password"
                                placeholder="Confirm New Password"
                            /> */}
                        </Grid>
                        
                        <Grid item xs={2}>
                            <Button 
                                disabled={isInvalid} 
                                color="primary" 
                                variant="contained" 
                                type="submit"
                            > 
                                Link {signInMethod.id}
                            </Button>
                        </Grid>         
                    </Grid>
                </form>
            )
        )
    }
}

const LoginManagement = withFirebase (LoginManagementBase);

const condition = authUser => !!authUser; // '!!expression', returns the 'truthiness' of expression

export default withEmailVerification ( withAuthorization (condition)(AccountPage) );

/**
 * Displayed on the '/account' route.
 * 
 * This component displays the user's mail and two forms to reset his/her's password, via mail reset or by typing the new password.
 * 
 * See how it is exported: using the withAuthorization HOC created at src\components\Session\withAuthorization.js (line 300).
 * 
 * That component checks if the user is logged in (using the 'condition' function, line 298), and depending on that calls the second
 * parameter (AccountPage in this case, line 25).
 * 
 * Notice how the component uses the 'authUser' object. This is possible because the withAuthorization HOC, passes it as a prop at some
 * point (see the HOC's notes).
 * 
 * The <AccountPage /> component displays two forms (<PasswordForgetForm />, <PasswordChangeForm />) and a component to handle the login 
 * management of the social accounts. i.e. <LoginManagement authUser={authUser} />
 * 
 * See src\components\PasswordForget\index.js and src\components\PasswordChange\index.js respectively.
 * 
 * <LoginManagement /> fetchs the sign in methods for the logged in user (we passed it as authUser), see the componentDidMount() event and the 
 * fetchSignInMethods() method. Which calls the firebase.auth method 'fetchSignInMethodsForEmail()' that in change returns a set of signIn 
 * methods and we store them in the activeSignInMethods state.
 * 
 * Then the component loop through each of the signIn methods possible to use and displays a set of buttons to link/unlink each of them 
 * depending on the users auth methods.
 */