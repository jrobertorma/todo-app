import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from '../SignUp';

import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

const SingInPage = () => {
    return(
        <div>
            <h1>SignIn</h1>
            <SignInForm />
            <SignUpLink />
        </div>
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

    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
}

export default SingInPage;