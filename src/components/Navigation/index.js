import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import * as ROUTES from '../../constants/routes';

import SignInPage from '../SignIn';
import LandingPage from '../Landing';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import SignUpPage from '../SignUp';
import PasswordForgetPage from '../PasswordForget';

import SignOutButton from '../SignOut'; 

function Navigation() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to={ROUTES.SIGN_IN}>Sign In</Link>
            </li>
            <li>
              <Link to={ROUTES.LANDING}>Landing</Link>
            </li>
            <li>
              <Link to={ROUTES.HOME}>Home</Link>
            </li>
            <li>
              <Link to={ROUTES.ACCOUNT}>Account</Link>
            </li>
            <li>
              <Link to={ROUTES.ADMIN}>Admin</Link>
            </li>
            <li>
              <SignOutButton />
            </li>
          </ul>
  
          <hr />
  
          <Switch>
            <Route exact path={ROUTES.SIGN_IN}>
                <SignInPage/>
            </Route>
            <Route exact path={ROUTES.LANDING}>
                <LandingPage/>
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
            <Route exact path={ROUTES.SIGN_UP}>
                <SignUpPage/>
            </Route>
            <Route exact path={ROUTES.PASSWORD_FORGET}>
                <PasswordForgetPage/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
}

export default Navigation;