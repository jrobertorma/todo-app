import React, {Component} from 'react';
import { withFirebase } from '../Firebase';

import { 
    withAuthorization, 
    withEmailVerification, 
    AuthUserContext,
} from '../Session';

const HomePage = () => {
    return ( 
        <div>
            <h1>Home Page</h1>
            <p>The Home Page is accessible by every signed in user.</p>
            
            <TodoLists />
        </div>
     );
}

class TodoListsBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            loading: false,
            todoLists: [],
        }
    }
    
    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.todoLists().on('value', snapshot => {
            const todoListObject = snapshot.val();

            //convert notes list from snapshot (is a set of objects) to an array
            if ( todoListObject ) {
                const todoListArray = Object.keys(todoListObject).map(key => ({
                    ...todoListObject[key],
                    userId: key,
                }));

                this.setState({
                    todoLists: todoListArray,
                    loading: false,
                });
            } else {
                this.setState({ todoLists: null, loading: false });
            }
        });
    }

    onChangeText = event => {
        this.setState({ text: event.target.value });
    }

    onCreateList = (event, authUser) => {
        this.props.firebase.todoLists().push({
            text: this.state.text,
            userId: authUser.uid,
        });

        this.setState({ text: '' });

        event.preventDefault();
    }

    onRemoveList = uid => {
        this.props.firebase.todoLists(uid).remove();
    }

    componentWillUnmount() {
        this.props.firebase.todoLists().off();
    }

    render() {
        const { text, todoLists, loading } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        { loading && <div>Loading ...</div> }

                        { 
                            todoLists ? (
                                <TodoListsContainer 
                                    todoLists={todoLists}
                                    onRemoveTodoList={this.onRemoveList}
                                /> 
                            ) : (
                                <div>There are no To-do lists...</div>
                            )
                        }

                        <form onSubmit={ event => this.onCreateList(event, authUser) }>
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

const TodoListsContainer = ({ todoLists, onRemoveTodoList }) => {
    return(
        <ul>
            {   
                todoLists.map( todoList => { 
                    <TodoListComponent
                        key={todoList.uid} 
                        todoList={todoList}
                        onRemoveTodoList={onRemoveTodoList}
                    /> 
                })
            }
        </ul>
    );
}

const TodoListComponent = ({ todoList, onRemoveTodoList }) => {
    return ( 
        <li>
            <strong>{todoList.uid}</strong> {todoList.text}
            <button
                type="button"
                onClick={ () => onRemoveTodoList(todoList.uid) }
            >
                Delete
            </button>
        </li>
    );
}

const TodoLists = withFirebase(TodoListsBase);

const condition = (authUser) => !!authUser; //'!!expression', returns the 'truthiness' of expression
 
export default withEmailVerification(withAuthorization(condition)(HomePage));

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