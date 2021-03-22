import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode> 
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/**
 * The entry point of the app.
 * 
 * We wrap the App component on the FirebaseContext component (see src/components/Firebase/index.js)
 * so we can use the firebase functions througout the app.
 * 
 * Note how we set the FirebaseContext.Provider as a new instance of the Firebase() class, i.e. the firebase
 * object defined at src\components\Firebase\firebase.js, it contains the config object and the methods we are
 * going to use trhough the app to interact with the firebase backend.
 */