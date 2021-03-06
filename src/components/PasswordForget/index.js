import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const PasswordForgetPage = () => {
    return ( 
        <Box mt={8}>
            <h1>Password Forget</h1>
                <PasswordForgetForm />
        </Box>
    );
};

const INITIAL_STATE = {
    email: '',
    error: null
};

class PasswordForgetFormBase extends Component {
    constructor(props){
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
            this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
            this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const { email, error } = this.state;
        const isInvalid = email === '';

        return(
            <form onSubmit={this.onSubmit}>
                <Grid 
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-end"
                >
                    <Grid item xs={2}>
                        <TextField  
                            id="email"
                            name="email"
                            label="Email Address"
                            value={this.state.email}
                            onChange={this.onChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <Button 
                            disabled={isInvalid} 
                            color="primary" 
                            variant="contained" 
                            type="submit"
                        >
                            Reset my password
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        {error && <p>{error.message}</p>}
                    </Grid>
                </Grid>
            </form>
        );
    }
}

const PasswordForgetLink = () => {
    return(
        <p>
            <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password</Link>
        </p>
    );
}

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };

/**
 * The passwordForget form.
 * 
 * We will be callin this components when we need to reset a password.
 * 
 * We export the base form with 'withFirebase(PasswordForgetFormBase);', so we cn call the firebase API.
 * 
 * And we do it at the PasswordForgetFormBase onSubmit event. We get the email from the state (this is a controlled component)
 * , then use it as a parameter of the .doPasswordReset() firebase's function.
 * 
 * Then we reset the form ();
 * 
 * We also have a PasswordForgetLink component, we can call later from another component (see src/components/SignIn/index.js)
 */