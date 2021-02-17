import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const SignUpPage = () => {
    <div>
        <h1>SignUp</h1>
        <SignUpForm />
    </div>
};

class SignUpForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE } //note the 'spread operator'
    }

    onSubmit = event => {

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
        * we are using the 'Destructuring assignment' syntax here, it works like this:
        * const [a, b] = [1, 2, 3, 4, 5, 6];
        * console.log(a, b); // 1, 2
        */

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
                
                <button type="submit">Sign Up</button>

                {error && <p>{error.message}</p> /*conditional rendering*/}
            </form>
        );
    }
}

const SignUpLink = () => {
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>SignUp</Link>
    </p>
}

export default SignUpPage;

export { SignUpForm, SignUpLink };

/**
 * Page, Form, and Links for the user to SignUp, on the first version we are going to use just the react's core state management
 * maybe we will change to react-final-form and material-ui later.
 */