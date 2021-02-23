import React from "react";

import { withFirebase } from "../Firebase";

const SignOutButton = ( firebase ) => {
    return ( 
        <button type="button" onClick={firebase.doSignOut}>
            SignOut
        </button>
    );
}
 
export default withFirebase(SignOutButton);

/**
 * This button will appear in the nav component, as you can see, it's onClick handler is the firebase function, doSignOut
 * wich is defined at src\components\Firebase\firebase.js (untracked by git, see the developer notes)
 * 
 * See how we export the component after we wrap it with the withFirebase context (see src\components\Firebase\index.js)
 */