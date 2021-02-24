import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      authUser: null,
    }
  }
  render() { 
    return ( 
      <Router>
        <div className="App">
          <Navigation authUser={this.state.authUser} />
        </div>
      </Router>
    );
  }
}

export default App;

/**
 * Since we are not going to use a state management library, the user's sessions will be stored in the react
 * state of the App component (see the 8th line).
 */