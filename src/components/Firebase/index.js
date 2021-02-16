import FirebaseContext from './context';
import Firebase from './firebase';

export default Firebase;

export { FirebaseContext };

/**
 * This file is called on src/index.js, here we call the Firebase class (it has the firebase auth methods) and the FirebaseContext,
 * when you import this file you can add the context to any component (it is going to be App)
 */