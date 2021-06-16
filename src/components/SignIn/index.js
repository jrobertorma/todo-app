import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';

import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const ERROR_CODE_ACCOUNT_EXISTS = 
    'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
    An account with an E-Mail address to
    this social account already exists. Try to login from
    this account instead and associate your social accounts on
    your personal account page.
  `;

const SingInPage = () => {
    return(
        <Box mt={8}>
            <Grid 
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-end"
            >
                <Grid item xs={12}>
                    <Box my={1}>
                        <Typography variant="h4" gutterBottom>
                            Sign In
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box my={1}>
                        <SignInForm />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box my={1}>
                        <SignInGoogle />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box my={1}>
                        <SignInFacebook />
                    </Box>
                    
                </Grid>
                <Grid item xs={12}>
                    <Box my={1}>
                        <PasswordForgetLink />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box my={1}>
                        <SignUpLink />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props){
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then( () => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch( (error) => {
                this.setState({ error });
            });
        
        event.preventDefault();
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const { email, password, error } = this.state;
        const isInvalid = password === '' || email === '';

        return(
            <form onSubmit={this.onSubmit}>
                <Grid 
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-end"
                >
                    <Grid item xs={2}>
                    {/* <input 
                            name="email"
                            value={email}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Email Address"
                        /> */}
                        <TextField  
                            id="email"
                            name="email"
                            value={email}
                            onChange={this.onChange}
                            type="text"
                            label="Email Address"
                        />
                    </Grid>
                    
                    <Grid item xs={2}>
                    {/* <input
                            name="password"
                            value={password}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Password"
                        /> */}

                        <TextField  
                            id="password"
                            name="password"
                            value={password}
                            onChange={this.onChange}
                            type="password"
                            label="Password"
                        />
                    </Grid>
                    
                    <Grid item xs={2}>
                        {/* <button disabled={isInvalid} type="submit">
                            Sign In
                        </button> */}

                        <Button
                            disabled={isInvalid}
                            color="primary" 
                            variant="contained" 
                            type="submit"
                        >
                            Sign In
                        </Button>
                    </Grid>
                    
                    <Grid item xs={12}>
                        {error && 
                            <Typography variant="body1" gutterBottom>
                                {error.message}
                            </Typography>}
                    </Grid>
                    
                </Grid>
            </form>
        );
    }
}

class SignInGoogleBase extends Component {
    constructor(props){
        super(props);

        this.state = { error: null };
    }

    //calling the doSignInWithGoogle() function defined at firebase.js
    onSubmit = (event) => {
        this.props.firebase
            .doSignInWithGoogle()
            .then( socialAuthUser => {
                //add user to the db too
                this.props.firebase
                    .user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.user.displayName,
                        email: socialAuthUser.user.email,
                        roles: [],
                    })
                    .then(() => {
                        this.setState({ error: null });
                        this.props.history.push(ROUTES.HOME);
                    })
                    //if there are any error with the realtime db
                    .catch(error => {
                        this.setState({ error });
                    })
            })
            //if there are any error with the doSignInWithGoogle method
            .catch(
                (error) => {
                    if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                        error.message = ERROR_MSG_ACCOUNT_EXISTS;
                    }

                    this.setState({ error });
                }
            );
            
        event.preventDefault();
    };

    render() {
        const { error } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
                {/* <button type="submit">Sign In with Google</button> */}
                <Button
                    color="primary" 
                    variant="contained" 
                    type="submit"
                >
                    Sign In with Google
                </Button>

                {error && 
                    <Typography variant="body1" gutterBottom>
                        {error.message}
                    </Typography>}
            </form>
        );
    }
}

class SignInFacebookBase extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null }
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithFacebook()
            .then( socialAuthUser => {
                this.props.firebase
                    .user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.additionalUserInfo.profile.name,
                        email: socialAuthUser.additionalUserInfo.profile.email,
                        roles: [],
                    })
                    .then(
                        () => {
                            this.setState({ error: null });
                            this.props.history.push(ROUTES.HOME);
                        }
                    )
                    .catch(
                        error => {
                            this.setState(error);
                        }
                    )
            })
            .catch(
                (error) => {
                    if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                        error.message = ERROR_MSG_ACCOUNT_EXISTS;
                    }

                    this.setState({error});
                }
            );

        event.preventDefault();
    }

    render() { 
        const { error } = this.state;
        return ( 
            <form onSubmit={this.onSubmit}>
                {/* <button type="submit" >
                    Sign In with Facebook
                </button> */}

                <Button
                    color="primary" 
                    variant="contained" 
                    type="submit"
                >
                    Sign In with Facebook
                </Button>

                { error && 
                    <Typography variant="body1" gutterBottom>
                        {error.message}
                    </Typography>}
            </form>
         );
    }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));
const SignInGoogle = withRouter(withFirebase(SignInGoogleBase));
const SignInFacebook = withRouter(withFirebase(SignInFacebookBase));

export default SingInPage;

export { SignInForm, SignInGoogle, SignInFacebook };

/**
 * The SignIn form and its components.
 * 
 * It displays a form to sign-in to the app (see SingInPage component),
 *  we can access to the app with an email address and a password (<SignInForm />)
 *  A social sign in with a Google (<SignInGoogle />) or Facebook (<SignInFacebook />) accounts
 *  We also link to a form to reset the password of the account (<PasswordForgetLink />)
 *  Finally the component displays a link to create an account (<SignUpLink />)
 * 
 * The <SignInForm /> component 
 * Displays a form to create an account with an email address and a password, it uses the
 * doSignInWithEmailAndPassword() firebase method, we can use it because we call it as a HOC argument (see line 206)
 * const SignInForm = withRouter(withFirebase(SignInFormBase)); 
 * 
 * The <SignInGoogle /> component
 * Follows the same pattern, calls <SignInGoogleBase/> as an argument of withFirebase and withRouter HOCs
 * it uses the doSignInWithGoogle() method of the firebase.js file (class)
 * 
 *      //social login
 *      doSignInWithGoogle = () =>
 *          this.auth.signInWithPopup(this.googleProvider);
 * 
 * This method creates a pop up to allow the app to sign in with the google credentials of the authenticated user, it also creates a user's copy in
 * the realtime database. Notice how the component catch an specific kind of error, previously defined with the const ERROR_CODE_ACCOUNT_EXISTS, 
 * and if it is the error returned, it changes the error.message prop using 'template strings' (the ` ` stuff 
 * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). 
 * 
 * So when you try to sign in with an already registered account you can know there is a linked account already in the app.
 * 
 * The <SignInFacebook /> component, besides the fact it uses the doSignInWithFacebook() method of the firebase class, works similarly,.
 * 
 * "If a user signs in with one of the social logins, but there is already an account in the system with this email address, 
 * the custom error message shows up. The user has to log in with the correct sign-in method and link all other desired social 
 * accounts to this account on the account page."
 */