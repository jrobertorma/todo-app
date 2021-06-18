import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { withFirebase } from '../Firebase';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false, //role management
    error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign-in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const SignUpPage = () => {
    return ( 
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
                            Sign Up
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box my={1}>
                        <SignUpForm />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE } //note the 'spread operator'
    }

    onSubmit = event => {
        const { username, email, passwordOne, isAdmin } = this.state; //destructuring asignement
        const roles = {}; //initializing role object

        if (isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN; //adding the admin role value to the 'roles' object
        }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                //Create the user in the db too
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                        roles,
                    });
            })
            .then(
                () => {
                    return this.props.firebase.doSendEmailVerification();
                }
            )
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME); /*redirect using history props 
                (we can do this because we added withRouter to the SignUpForm component (line 122))*/
            
            })
            .catch(error => {
                if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }
                
                this.setState({ error });
            });
    
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeCheckbox = event => {
        this.setState(
            {[event.target.name]: event.target.checked}
        );
    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            isAdmin,
            error,
        } = this.state; 
        /*
        * we are using the 'Destructuring assignment' syntax, it works like this:
        * const [a, b] = [1, 2, 3, 4, 5, 6];
        * console.log(a, b); // 1, 2
        */

        const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        email === '' ||
        username === '';

        return(
            <form onSubmit={this.onSubmit}>
                <Grid 
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-end"
                >
                    <Grid item xs={12}>
                        {/* <input
                            name="username"
                            value={username}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Full Name"
                        /> */}
                        <TextField  
                            id="username"
                            name="username"
                            value={username}
                            onChange={this.onChange}
                            type="text"
                            label="Full Name"
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
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
                    
                    <Grid item xs={12}>
                        {/* <input
                            name="passwordOne"
                            value={passwordOne}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Password"
                        /> */}
                        <TextField  
                            id="passwordOne"
                            name="passwordOne"
                            value={passwordOne}
                            onChange={this.onChange}
                            type="password"
                            label="Password"
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        {/* <input
                            name="passwordTwo"
                            value={passwordTwo}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Confirm Password"
                        /> */}
                        <TextField  
                            id="passwordTwo"
                            name="passwordTwo"
                            value={passwordTwo}
                            onChange={this.onChange}
                            type="password"
                            label="Confirm Password"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        {/* <label>
                            Admin:
                            <input
                                name="isAdmin"
                                type="checkbox"
                                checked={isAdmin}
                                onChange={this.onChangeCheckbox}
                            />
                        </label> */}
                        <Box my={1}>
                            <FormControlLabel
                                label="Admin"
                                control={
                                    <Checkbox
                                        checked={isAdmin}
                                        onChange={this.onChangeCheckbox}
                                        name="isAdmin"
                                        color="primary"
                                    />
                                }
                            />
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                        {/* <button disabled={isInvalid} type="submit">
                            Sign Up
                        </button> */}
                        <Box my={1}>
                            <Button
                                disabled={isInvalid}
                                color="primary" 
                                variant="contained" 
                                type="submit"
                            >
                                Sign Up
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box my={1}>
                            {error && 
                                    <Typography variant="body1" gutterBottom>
                                        {error.message}
                                    </Typography> /*conditional rendering*/}
                        </Box>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

const SignUpLink = () => {
    return ( 
        <p>
            Don't have an account? <Link to={ROUTES.SIGN_UP}>SignUp</Link>
        </p>
    );
}

const SignUpForm = withRouter(withFirebase(SignUpFormBase)); //adding router history, to the component wrapped by firebase context

export default SignUpPage;

export { SignUpForm, SignUpLink };

/**
 * Page, Form, and Links for the user to SignUp, on the first version we are going to use just the react's core state management
 * maybe we will change to react-final-form and material-ui later.
 * 
 * Any component that goes in the withRouter() higher-order component gains access to all the properties of the router, so when 
 * passing the enhanced SignUpFormBase component to the withRouter() higher-order component, it has access to the props of the router. 
 * The relevant property from the router props is the history object, because it allows us to redirect a user to another page 
 * by pushing a route to it.
 * 
 * Also see how the event calls the firebase functions at line 55 and calls the user() method to create a new user with the same id as
 * the authAPI user created three lines before, then the set() method can be used to add information to the user in the db.
 * 
 * The doCreateUserWithEmailAndPassword() method can return an error if the email address is already asociated with othe user, maybe because 
 * they signed in before with a social account (google, fb, etc), that is when we set the custom error message for the user to see and link 
 * his accounts after sign in with the social account. 
 */