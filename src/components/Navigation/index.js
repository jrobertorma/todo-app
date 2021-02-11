import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import * as ROUTES from '../../constants/routes';

import SignIn from '../SignIn';

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
                <SignIn/>
            </Route>
            <Route exact path={ROUTES.HOME}>
                <SignIn/>
            </Route>
            <Route exact path={ROUTES.ACCOUNT}>
                <SignIn/>
            </Route>
            <Route exact path={ROUTES.ADMIN}>
                <SignIn/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
}

export default Navigation;