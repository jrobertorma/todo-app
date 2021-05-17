import React, { Component } from 'react';
import { compose } from 'recompose';

import { 
    AuthUserContext,
    withAuthorization, 
    withEmailVerification, 
} from '../Session';

import { withFirebase } from '../Firebase';

const HomePage = () => {
    return ( 
        <div>
            <h1>Home Page</h1>
            <p>The Home Page is accessible by every signed in user.</p>
            
            <TodoList />
        </div>
     );
}

class TodoListBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            loading: false,
            todoListItems: [],
        }
    }
    
    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.todoItems().on('value', snapshot => {
            const todoItemsObject = snapshot.val();

            //convert notes list from snapshot (is a set of objects) to an array
            if ( todoItemsObject ) {
                const todoItemsArray = Object.keys(todoItemsObject).map(key => ({
                    ...todoItemsObject[key],
                    uid: key,
                }));

                this.setState({
                    todoListItems: todoItemsArray,
                    loading: false,
                });
            } else {
                this.setState({ todoListItems: null, loading: false });
            }
        });
    }

    componentWillUnmount() {
        this.props.firebase.todoItems().off();
    }

    onChangeText = event => {
        this.setState({ text: event.target.value });
    }

    onCreateItem = (event, authUser) => {
        this.props.firebase.todoItems().push({
            text: this.state.text,
            userId: authUser.uid,
        });

        this.setState({ text: '' });

        event.preventDefault();
    }

    onRemoveItem = uid => {
        this.props.firebase.todoItems(uid).remove();
    }

    render() {
        const { text, todoListItems, loading } = this.state;
        
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        { loading && <div>Loading ...</div> }

                        { 
                            todoListItems ? (
                                <ItemList
                                    todoListsItems={todoListItems}
                                    onRemoveItem={this.onRemoveItem}
                                /> 
                            ) : (
                                <div>There are no To-do list items...</div>
                            )
                        }

                        <form onSubmit={ event => this.onCreateItem(event, authUser) }>
                            <input 
                                type="text"
                                value={text}
                                onChange={this.onChangeText}
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const ItemList = ({ todoListsItems, onRemoveItem }) => {
    return(
        <ul>
            {   
                todoListsItems.map( todoListItem => { 
                    <TodoListItem
                        key={todoListItem.uid} 
                        todoListItem={todoListItem}
                        onRemoveItem={onRemoveItem}
                    /> 
                })
            }
        </ul>
    );
}

const TodoListItem = ({ todoListItem, onRemoveItem }) => {
    return ( 
        <li>
            <strong>{todoListItem.uid}</strong> {todoListItem.text}
            <button
                type="button"
                onClick={ () => onRemoveItem(todoListItem.uid) }
            >
                Delete
            </button>
        </li>
    );
}

const TodoList = withFirebase(TodoListBase);

const condition = (authUser) => !!authUser; //'!!expression', returns the 'truthiness' of expression
 
export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(HomePage);

/**
 * The HomePage component (really? lol)
 * 
 * The most atypical thing about this component is the way we create the 'condition' function.
 * It receives an authUser state and returns !!authUser (false false state).
 * 
 * This is a kind of obscure way to do a type conversion.
 * 
 * The 'false false' thing (it is not an operator per se) returns true or false depending on the 'truthiness' of the expression
 * without needing to convert it to a logically evaluable var type.
 * 
 * e.g.
 * 
 * !!"" === false // empty string is falsy
 * !!"foo" === true  // non-empty string is truthy
 * !!"false" === true  // ...even if it contains a falsy value
 * 
 * see the thread on https://stackoverflow.com/questions/784929/what-is-the-not-not-operator-in-javascript to know more.
 * 
 * HomePage also renders a list of notes for the user
 * 
 * Notice the componentDidMount() event in the NotesBase component.
 * 
 * It adds a firebase 'listener' to the 'notes' entity that will call the fallback function every time the db changes.
 * 
 *      this.props.firebase.notes().on( value => //to do )
 * 
 * And because it has a setState function it will re-render the changed components 
 * (https://firebase.google.com/docs/database/web/read-and-write#web_value_events).
 * 
 * It is important to note that .notes() is an API function defined at src\components\Firebase\firebase.js
 * 
 *      // *** Notes API ***
 *      note = uid => this.db.ref(`notes/${uid}`);
 *      notes = () => this.db.ref('notes');
 * 
 * So the listener will be the same as:
 *      
 *      firebase.db.ref('notes').on( snapshot => //todo )
 * 
 * Just like the docs suggest.
 * 
 * The same component also displays a form to save new notes, the onSubmit handler, calls the onCreateNote function,
 * it calls the firebase's .push() method (https://firebase.google.com/docs/database/admin/save-data) and cleans the input
 * state (a controlled form), that method returns an id for the new record in the db. The <NotesBase> component also uses
 * the authUser context to get the uid of the logged in user (see its render function), and be able to pass it to the 
 * onCreateNote function, a random fact is that when you have several parameters to pass in a function, as a form handler, 
 * you must pass the event first:
 * 
 *      event => this.onCreateNote(event, authUser)
 * 
 */