import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';

class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            loading: false,
            users: {},
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        //Calling firebase database and passing it to the state
        this.props.firebase.users().on('value', snapshot => {
            this.setState({
                users: snapshot.val(), //the response of database API, a collection of 'user' objects
                loading: false,
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off(); //closing the connection
    }
    
    render() { 
        const { users, loading } = this.state; //'Destructuring assignment' syntax

        return ( 
            <div>
                <h1>Admin</h1>
                <p>
                    The Admin Page is accessible by every signed in admin user.
                </p>

                {loading && <div>Loading ...</div> /*conditional rendering: 'logicExpression && TODO if logicExpression returns true'*/}

                <UserList users={users} />

            </div>
        );
    }
}

const UserList = ({ users }) => {
    
    //Converting the users object stored in the state to an array
    const usersListArray = Object.keys(users).map( ( key ) => ({
        ...users[key],
        uid:key,
    }));

    return ( 
        <ul>
            {   //Mapping the users array to create one list item for each user and its data 
                usersListArray.map( ( user ) => {
                    return(
                        <li key={user.uid}>
                            <span>
                                <strong>ID: </strong> {user.uid}
                            </span>
                            <span>
                                <strong>E-Mail: </strong> {user.email}
                            </span>
                            <span>
                                <strong>Username: </strong> {user.username}
                            </span>
                        </li>
                    );
                })
            }
        </ul>
    );
}

//if there is an authUser value we check for the truthiness of the value in the provided authUser.roles[ROLES.ADMIN]
const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

/* 
* withAuthorization gets two functions as parameters, the first must return a logical value (true or false),
* the second one is the component to render in case the condition is passed, in this case is a HOC call with AdminPage 
* as param
*/
export default withEmailVerification ( withAuthorization ( condition )( withFirebase( AdminPage ) ) );

/**
 * The administrators component
 * 
 * They will be able to see all the registered users. We are calling it at line 18, where we call the 'users' reference
 * and attatch a listener. That is the on() method wich triggers every time something changes. It receives a type value and
 * a callback ('value' in this case, and the setState call with snapshot as a parameter to update the users state).
 * 
 * see the docs at: https://firebase.google.com/docs/database/web/read-and-write
 * 
 * Since the users are objects when they are retrieved from the Firebase database, we have to restructure them 
 * as lists (arrays), which makes it easier to display them later.
 * 
 * This was a little bit different from the book. Instead of converting the users object to an array and store it in the state at 
 * the componentDidMount() function, we are storing the raw object returned by firebase directly (line 24).
 * 
 * Then we catch it as a param in the UserList component (line 46), and parse it at lines 55-59 to be able to run a map()
 * over the parsed array and create every list item through the loop.
 */