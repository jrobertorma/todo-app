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

import HomeIcon from '@material-ui/icons/Home';
import BuildIcon from '@material-ui/icons/Build';
import CallToActionIcon from '@material-ui/icons/CallToAction';
import PersonIcon from '@material-ui/icons/Person';

const Navigation = ({toolbarHandler}) => {
  return (
    <div>
      <AuthUserContext.Consumer>
        { 
          (authUser) =>  authUser ? 
            <NavigationAuth authUser={authUser} toolbarHandler={toolbarHandler}/> : 
            <NavigationNonAuth toolbarHandler={toolbarHandler}/> 
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
const NavigationAuth = ({ authUser, toolbarHandler }) => {
  return ( 
    <List>
      <ListItem button component={Link} to={ROUTES.LANDING} onClick={toolbarHandler("Landing")}>
        <ListItemIcon> <CallToActionIcon /> </ListItemIcon>
        <ListItemText primary="Landing" />
      </ListItem>

      <ListItem button component={Link} to={ROUTES.HOME} onClick={toolbarHandler("Home")}>
        <ListItemIcon> <HomeIcon /> </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      
      <ListItem button component={Link} to={ROUTES.ACCOUNT} onClick={toolbarHandler("Account")}>
        <ListItemIcon> <PersonIcon /> </ListItemIcon>
        <ListItemText primary="Account" />
      </ListItem>
        
      {!!authUser.roles[ROLES.ADMIN] && (
        <ListItem button component={Link} to={ROUTES.ADMIN} onClick={toolbarHandler("Admin")}>
          <ListItemIcon> <BuildIcon /> </ListItemIcon>
          <ListItemText primary="Admin" />
        </ListItem>
      )}
        
      <li>
        <SignOutButton />
      </li>
    </List>
  );
}

/**
 * If there is no user logged in, the component returns this set of links 
 */
const NavigationNonAuth = ({ toolbarHandler }) => {
  return ( 
    <List>
      <ListItem button component={Link} to={ROUTES.SIGN_IN} onClick={toolbarHandler("Sign In")}>
        <ListItemIcon> <PersonIcon /> </ListItemIcon>
        <ListItemText primary="Sign In" />
      </ListItem>
      <ListItem button component={Link} to={ROUTES.LANDING} onClick={toolbarHandler("Landing")}>
        <ListItemIcon> <CallToActionIcon /> </ListItemIcon>
        <ListItemText primary="Landing" />
      </ListItem>
    </List>
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