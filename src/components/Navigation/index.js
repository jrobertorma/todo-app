import { React } from "react";
import { Link } from "react-router-dom";

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import SignOutButton from '../SignOut'; 

import { AuthUserContext } from '../Session';

const Navigation = () => {
  return (
    <div>
      <AuthUserContext.Consumer>
        { 
          (authUser) =>  authUser ? <NavigationAuth authUser={authUser}/> : <NavigationNonAuth /> 
        }
      </AuthUserContext.Consumer>
    </div>
  );
}

const NavigationAuth = ({ authUser }) => {
  return ( 
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
        
        { !!authUser.roles[ROLES.ADMIN] && (<li><Link to={ROUTES.ADMIN}>Admin</Link></li>) }
        
      <li>
        <SignOutButton />
      </li>
    </ul>
  );
}

const NavigationNonAuth = () => {
  return ( 
    <ul>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
    </ul>
  );
}

export default Navigation;

/**
 * This components are used as the nav bar. The react-router routes are defined at src\components\App\index.js, the App component also
 * calls this one to implement the navigation.
 * 
 * See how we use the AuthUserContext as consumer to know the authUser state and then decide wich set of links to return (line 15).
 * 
 * That was defined at src\components\Session\withAuthentication.js, and added to this component on src\components\App\index.js.
 */