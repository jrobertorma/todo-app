import React, {Component} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import * as ROUTES from '../../constants/routes';

import { withFirebase } from '../Firebase';

import Navigation from '../Navigation';

import SignInPage from '../SignIn';
import LandingPage from '../Landing';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import SignUpPage from '../SignUp';
import PasswordForgetPage from '../PasswordForget';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      authUser: null,
    }
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      (authUser) => {
        authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null })
      }
    );
  }

  componentWillUnmount() {
    this.listener();
  }

  render() { 
    return ( 
      <Router>
        <div>
          <Navigation authUser={this.state.authUser} />
          <hr />
          <Switch>
            <Route exact path={ROUTES.LANDING}>
                <LandingPage/>
            </Route>
            <Route exact path={ROUTES.SIGN_UP}>
                <SignUpPage/>
            </Route>
            <Route exact path={ROUTES.SIGN_IN}>
                <SignInPage/>
            </Route>
            <Route exact path={ROUTES.PASSWORD_FORGET}>
                <PasswordForgetPage/>
            </Route>
            <Route exact path={ROUTES.HOME}>
                <HomePage/>
            </Route>
            <Route exact path={ROUTES.ACCOUNT}>
                <AccountPage/>
            </Route>
            <Route exact path={ROUTES.ADMIN}>
                <AdminPage/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withFirebase(App);

/**
 * Since we are not going to use a state management library (on the first version at least), the user's sessions will be stored in the react
 * state of the App component (see the line 25).
 * 
 * We pass it as a prop to the <Navigation> component, and then we can add some conditional rendering depending on
 * the authUser state (line 32)
 * 
 * We set the authUser state in the componentDidMount function. 
 * 
 * "Firebase offers a listener function to get the authenticated user from Firebase" (onAuthStateChanged), and we use it as a prop because we
 * added withFirebase(App) at the export statement.
 * 
 * "onAuthStateChanged() receives a function as parameter that has access to the authenticated user. Also, the passed function is called every 
 * time something changes for the authenticated user."
 * 
 * "If a user signs out, the authUser object becomes null, so the authUser property in the local state is set to null and all components 
 * depending on it adjust their behavior (e.g. display different options like the Navigation component)."
 * 
 */