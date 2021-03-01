import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import * as ROUTES from '../../constants/routes';

import Navigation from '../Navigation';

import SignInPage from '../SignIn';
import LandingPage from '../Landing';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import SignUpPage from '../SignUp';
import PasswordForgetPage from '../PasswordForget';

import { withAuthentication } from "../Session";

const App = () => {
  return ( 
    <Router>
          <div>
            <Navigation />
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

export default withAuthentication(App);

/**
 * The entry point of the app, note how we export it as argument of withAuthentication(), that component, class catches a component
 * and adds a context component as a wrapper, so you can use the authUser state everywhere, see src\components\Session\withAuthentication.js.  
 */