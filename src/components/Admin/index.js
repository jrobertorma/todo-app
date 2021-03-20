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
        this.setState({ loading:true });

        //Calling firebase database and passing it to the state
        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val(); //the response of database API, a collection of 'user' objects

            /*we create a new array to store the 'users' object items, remember that map((key) => //todo)
            creates a new array using the callback that takes as parameter where key is the item of the object we will be maping*/
            const usersList = Object.keys(usersObject)
                .map( (key) => ({
                    ...usersObject[key],
                    uid:key
                }))

            this.setState({
                users: usersList,
                loading: false
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }
    
    render() { 
        const { users, loading } = this.state;

        return ( 
            <div>
                <h1>Admin</h1>

                {loading && <div>Loading ...</div>}

                <UserList users={users} />

            </div>
        );
    }
}

const UserList = ({ users }) => {
    return ( 
        <ul>
            {users.map( ( user ) => (
                <li key={user.uid}>
                    <span>
                        <strong>ID:</strong> {user.uid}
                    </span>
                    <span>
                        <stron>E-Mail:</stron> {user.email}
                    </span>
                    <span>
                        <stron>Username:</stron> {user.username}
                    </span>
                </li>
            ))}
        </ul>
    );
}
 
export default withFirebase(AdminPage);

/**
 * The administrators component
 * 
 * Thew will be able to see all the registered users. We are calling it at line 18, where we call the 'users' reference
 * and attatch a listener. That is the on() method that triggers every time something has changed. It receives a type value and
 * a callback ('value' in this case and the setState call with snapshot as a parameter to update the users state).
 * 
 * see the docs at: https://firebase.google.com/docs/database/web/read-and-write
 * 
 * Since the users are objects rather than lists when they are retrieved from the Firebase database, you have to restructure them 
 * as lists (arrays), which makes it easier to display them later:
 */