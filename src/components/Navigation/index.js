import { React } from "react";
import { Link } from "react-router-dom";

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import SignOutButton from '../SignOut'; 

import { AuthUserContext } from '../Session';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

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

{
/**
* Vas aquí, solo falta acomodar los enlaces para que se vean bonitos e integrados 
* con el drawer.
*/
}
const NavigationAuth = ({ authUser }) => {
  return ( 
    <List>
      <ListItem button>
        <ListItemIcon> <InboxIcon /> </ListItemIcon>
        <ListItemText primary="Landing" />
        <Link to={ROUTES.LANDING}>Landing</Link>
      </ListItem>

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
    </List>
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
 * See how we use the AuthUserContext as consumer to know the authUser state and then decide wich set of links to return (line 14).
 * 
 * That was defined at src\components\Session\withAuthentication.js, and added to this component on src\components\App\index.js.
 */