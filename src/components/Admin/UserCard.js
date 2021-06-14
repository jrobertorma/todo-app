import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function UserCard({user}) {
  const classes = useStyles();
  // const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          User
        </Typography>
        <Typography variant="h5" component="h2">
          {user.username}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          ID: {user.uid}
        </Typography>
        <Typography variant="body2" component="p">
          E-Mail: {user.email}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          component={Link} 
          to={{
            pathname: `${ROUTES.ADMIN}/${user.uid}`,
            state: { user },
          }}>
            Details
        </Button>
      </CardActions>
    </Card>
  );
}
/**
 * This component is called by is called in the render method of the UserListBase component in the src\components\Admin\index.js file. 
 * It gets a 'user' object and uses it to render a mui-card.
 * 
 * Note the react-router <Link /> in the mui <Button /> component. As you may see, is embedded within the Button using
 * the mui 'composition', that lets us use mui and a routing solution, in this case with the 'component' and 'to' props.
 * 
 *    <Button 
          size="small" 
          component={Link} 
          to={{
            pathname: `${ROUTES.ADMIN}/${user.uid}`,
            state: { user },
          }}>
            Details
        </Button>
 * 
 * https://material-ui.com/components/cards/
 * https://material-ui.com/guides/composition/#button
 */