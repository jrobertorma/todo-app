import app from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey:             "your-firebase-credentials",
    authDomain:         "your-firebase-credentials",
    databaseURL:        "your-firebase-credentials",
    projectId:          "your-firebase-credentials",
    storageBucket:      "your-firebase-credentials",
    messagingSenderId:  "your-firebase-credentials",
    appId:              "your-firebase-credentials",
    measurementId:      "your-firebase-credentials"
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        /* Helper */

        this.serverValue = app.database.ServerValue;
        this.emailAuthProvider = app.auth.EmailAuthProvider;
        
        this.auth = app.auth();
        this.db = app.database();

        //adding google social login provider
        this.googleProvider = new app.auth.GoogleAuthProvider();

        //adding fb social login provider
        this.facebookProvider = new app.auth.FacebookAuthProvider();
        
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSendEmailVerification = () =>
        this.auth.currentUser.sendEmailVerification({
            url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
        });

    //social login
    doSignInWithGoogle = () =>
        this.auth.signInWithPopup(this.googleProvider);

    doSignInWithFacebook = () => 
        this.auth.signInWithPopup(this.facebookProvider);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    // *** Merge Auth and DB User API ***

    onAuthUserListener = (next, fallback) => {
        //listener (onAuthStateChanged) to know if the user is logged in
        this.auth.onAuthStateChanged( (authUser) => {
            //the user is logged in
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(
                        //we call the db once() function to fetch the user data and then()
                        snapshot => {
                            //user db data (it is an object)
                            const dbUser = snapshot.val();

                            // if there are no roles, we add the default empty roles
                            if (!dbUser.roles) {
                                dbUser.roles = {};
                            }

                            // merge auth and db user, we called authUser from the listener, and now we are adding the db data
                            //to that state
                            authUser = {
                                uid: authUser.uid,
                                email: authUser.email,
                                emailVerified: authUser.emailVerified,
                                providerData: authUser.providerData,
                                ...dbUser,
                            };

                            //call the provided function, we pass the merged authUser object 
                            next(authUser);
                        });
            } else {
                fallback();
            }
        });
    }

    // *** User API ***

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    // *** To-do list API ***

    todoItem = uid => this.db.ref(`todoItems/${uid}`);

    todoItems = () => this.db.ref('todoItems');
}

export default Firebase;

/**
 * The Firebase class calls the npm firebase module (previously installed with yarn) and creates a reference to the firebase connection
 * so we can use it's functions througout the app.
 * 
 * The first set of functions are the auth functions, we declare them on the constructor so we can call them wherever we need as long as
 * we import this class.
 * 
 * Then we create the onAuthUserListener function, notice how it expects two functions as parameters: next() and fallback(), they are 
 * both callbacks (in form of arrow functions).
 * 
 * It creates an observer to know if the user is logged in or not (see the notes at withAuthentication.js) , and if it is logged in, 
 * we ask the db for the user data and merge it with the authUser object on the state and pass it to the next() function.
 * 
 * If the user is not logged in it calls fallback() instead.
 * 
 * Then we have the user api for the database.
 * 
 * And lastly the todo-list item api for the database.
 */