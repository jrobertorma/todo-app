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

/**
 * This set of links is returned if there is a logged in user
 * notice how we use mui 'composition' at the <ListItem/> component.
 * We pass a react-router-dom <Link> component as the 'component' prop so 
 * when clicked it works as a normal router link while looking cute ;).
 */
const NavigationAuth = ({ authUser }) => {
  return ( 
    <List>
      <ListItem button component={Link} to={ROUTES.LANDING}>
        <ListItemIcon> <InboxIcon /> </ListItemIcon>
        <ListItemText primary="Landing" />
      </ListItem>

      <ListItem button component={Link} to={ROUTES.HOME}>
        <ListItemIcon> <InboxIcon /> </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      
      <ListItem button component={Link} to={ROUTES.ACCOUNT}>
        <ListItemIcon> <InboxIcon /> </ListItemIcon>
        <ListItemText primary="Account" />
      </ListItem>
        
      {!!authUser.roles[ROLES.ADMIN] && (
        <ListItem button component={Link} to={ROUTES.ADMIN}>
          <ListItemIcon> <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Admin" />
        </ListItem>
      )}
        
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