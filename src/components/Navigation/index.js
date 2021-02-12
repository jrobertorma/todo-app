import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import * as ROUTES from '../../constants/routes';

import SignIn from '../SignIn';
import Landing from '../Landing';
import Home from '../Home';
import Account from '../Account';
import Admin from '../Admin';

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
          </ul>
  
          <hr />
  
          <Switch>
            <Route exact path={ROUTES.SIGN_IN}>
                <SignIn/>
            </Route>
            <Route exact path={ROUTES.LANDING}>
                <Landing/>
            </Route>
            <Route exact path={ROUTES.HOME}>
                <Home/>
            </Route>
            <Route exact path={ROUTES.ACCOUNT}>
                <Account/>
            </Route>
            <Route exact path={ROUTES.ADMIN}>
                <Admin/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
}

export default Navigation;