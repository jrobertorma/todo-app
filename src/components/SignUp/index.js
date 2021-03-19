import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const SignUpPage = () => {
    return ( 
        <div>
            <h1>SignUp</h1>
            <SignUpForm />
        </div>
    );
}

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE } //note the 'spread operator'
    }

    onSubmit = event => {
        const { username, email, passwordOne } = this.state; //destructuring asignement

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                //Create the user in the db too
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                    });
            })
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME); /*redirect using history props 
                (we can do this because we added withRouter to the SignUpForm component (line 122))*/
            
            })
            .catch(error => {
                this.setState({ error });
            });
    
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
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
                <input
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name"
                />
                
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                />
                
                <button disabled={isInvalid} type="submit">
                    Sign Up
                </button>

                {error && <p>{error.message}</p> /*conditional rendering*/}
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
 * Also see how the event calls the firebase functions at line 38 and calls the user() method to create a new user with the same id as
 * the authAPI user created three lines before, then the set() method can be used to add information to the user on the db.
 */