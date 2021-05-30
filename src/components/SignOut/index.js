import React from "react";

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import { withFirebase } from "../Firebase";

const SignOutButton = ({ firebase }) => {
    return (
        <Box display="flex" justifyContent="center">
            <Button variant="contained" onClick={firebase.doSignOut}>SignOut</Button>
        </Box> 
    );
}
 
export default withFirebase(SignOutButton);

/**
 * This button will appear in the nav component, as you can see, it's onClick handler is the firebase function, doSignOut
 * wich is defined at src\components\Firebase\firebase.js (untracked by git, see the developer notes)
 * 
 * See how we export the component after we wrap it with the withFirebase context (see src\components\Firebase\index.js)
 * 
 * Vital fact: 'firebase' is a js var, so when you catch it as a function param, you should wrap it 
 * between curly braces ( '{ }' ) 
 */