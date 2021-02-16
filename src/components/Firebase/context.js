import React from 'react';

const FirebaseContext = React.createContext(null);

export default FirebaseContext;

/**
 * Create the Firebase context so we don't have to create multiple firebase instances, this file is called by Firebase/index.js 
 */