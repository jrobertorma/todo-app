import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

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
 
export default withFirebase(AdminPage);

/**
 * The administrators component
 * 
 * They will be able to see all the registered users. We are calling it at line 18, where we call the 'users' reference
 * and attatch a listener. That is the on() method that triggers every time something has changed. It receives a type value and
 * a callback ('value' in this case and the setState call with snapshot as a parameter to update the users state).
 * 
 * see the docs at: https://firebase.google.com/docs/database/web/read-and-write
 * 
 * Since the users are objects when they are retrieved from the Firebase database, you have to restructure them 
 * as lists (arrays), which makes it easier to display them later.
 * 
 * This was a little bit different from the book. Instead of convert the users object to an array and store it in the state at 
 * the componentDidMount() function, we are storing the raw object returned by firebase directly (line 21).
 * 
 * Then we catch it as a param in the UserList component (line 40), and parse it at lines 50-53 to be able to run a map()
 * over the parsed array and create every list item through the loop.
 */