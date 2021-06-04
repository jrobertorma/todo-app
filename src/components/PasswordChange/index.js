import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import Grid from '@material-ui/core/Grid';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
}

class PasswordChangeForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            ...INITIAL_STATE
        }; 
    }

    onSubmit = (event) => {
        const { passwordOne } = this.state;

        this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(
                () => {
                    this.setState({ ...INITIAL_STATE });
                }
            )
            .catch(
                (error) => {
                    this.setState({ error });
                }
            )

        event.preventDefault();
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render(){
        const { passwordOne, passwordTwo, error } = this.state;

        const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

        return(
            <form onSubmit={this.onSubmit}>
                <Grid 
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-end"
                >
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
                        Reset My Password
                    </button>

                    {error && <p>{error.message}</p>}
                </Grid>
            </form>
        );
    }
}

export default withFirebase(PasswordChangeForm);

/**
 * This component will be called by the Account component, because it is part of the account functions (to change the user's password)
 * 
 * First we will need the firebase functions, so we export the container component as a withFirebase() argument.
 * 
 * Then we add an initial state for our form 'controlled component' (see the onChange event).
 * 
 * In the render function, we define the form and a simple validation to disable/enable the submit button.
 * 
 * We catch the onSubmit event activated by that button and call the firebase API defined at src\components\Firebase\firebase.js
 * (see the dev notes, as this file is untracked by git).
 * 
 * We call the doPasswordUpdate function BTW.
 * 
 * doPasswordUpdate = password =>
 *       this.auth.currentUser.updatePassword(password);
 */