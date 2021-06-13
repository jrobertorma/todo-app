import React, { Component } from 'react';
import { compose } from 'recompose';

import { 
    AuthUserContext,
    withAuthorization, 
    withEmailVerification, 
} from '../Session';

import { withFirebase } from '../Firebase';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const HomePage = () => {
    return ( 
        <Box mt={8}>
            <Typography variant="h4" gutterBottom>
                Home Page
            </Typography>
            
            <Typography variant="body1" gutterBottom>
                The Home Page is accessible by every signed in user.
            </Typography>
            
            <TodoList />
        </Box>
     );
}

class TodoListBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            todoListItems: [],
            text: '',
            limit: 5,
        };
    };

    componentDidMount() {
        this.onListenForTodoItems();
    }

    componentWillUnmount() {
        this.props.firebase.todoItems().off();
    }

    onListenForTodoItems() {
        this.setState({ loading: true });

        this.props.firebase
            .todoItems()
            .orderByChild('createdAt')
            .limitToLast(this.state.limit)
            .on( 'value', (snapshot) => {
                const listItems = snapshot.val();
                
                if( listItems ) {
                    const parsedItems = Object.keys(listItems).map( (key) => ({ 
                        ...listItems[key],
                        uid: key,
                    }));

                    this.setState({
                        loading: false,
                        todoListItems: parsedItems,
                    })
                } else {
                    this.setState({
                        loading: false,
                        todoListItems: null,
                    });
                }
            } );
    }

    onNextPage = () => {
        this.setState(
            state => ({ limit: state.limit + 5 }),
            this.onListenForTodoItems,
        );
    }

    onChangeText = event => {
        this.setState({ text: event.target.value });
    }

    onCreateItem = (event, authUser) => {
        this.props.firebase.todoItems().push({
            text: this.state.text,
            userId: authUser.uid,
            createdAt: this.props.firebase.serverValue.TIMESTAMP,
        });

        this.setState({ text: '' });

        event.preventDefault();
    }

    /**
     * Notice that todoItem(uid) !== todoItems(uid), the first one (defined at src\components\Firebase\firebase.js)
     * has the placeholder for the uid var and pass it to the firebase ref:
     * 
     *  todoItem = uid => this.db.ref(`todoItems/${uid}`);
     * 
     * todoItems() doesn't
     * 
     *  todoItems = () => this.db.ref('todoItems');
     */
    onRemoveItem = uid => {
        this.props.firebase.todoItem(uid).remove();
    }

    onEditItem = ( listItem, text ) => {
        const { uid, ...listItemSnapshot } = listItem;

        this.props.firebase.todoItem(listItem.uid).set({ 
            ...listItemSnapshot,
            text,
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
    }

    render() {
        const { loading, todoListItems, text } = this.state;

        return(
            <AuthUserContext.Consumer>
                { authUser => (
                    <div>
                        {!loading && todoListItems && (
                            // <button type="button" onClick={this.onNextPage}>
                            //     More
                            // </button>

                            <Button 
                                type="button" 
                                onClick={this.onNextPage}
                                color="primary" 
                                variant="contained"
                            >
                                More
                            </Button>
                        )}

                        {loading && <div>
                            <Typography variant="body1" gutterBottom>
                                Loading ...
                            </Typography></div>}

                        {
                            todoListItems ? (
                                <ItemsList
                                    authUser={authUser}
                                    todoListItems={todoListItems}
                                    onEditItem={this.onEditItem}
                                    onRemoveItem={this.onRemoveItem}
                                />
                            ) : (
                                <div>
                                    <Typography variant="body1" gutterBottom>
                                        There are no To-do list items...
                                    </Typography>
                                </div>
                            )
                        }
                        
                        <form className="form" onSubmit={ event => this.onCreateItem(event, authUser) }>
                            <Grid 
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-end"
                            >
                                <Grid item xs={2}>
                                    <TextField  
                                        id="filled-name"
                                        label="New note"
                                        value={text}
                                        onChange={this.onChangeText}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={1}> 
                                    <Button color="primary" variant="contained" type="submit">Send</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const ItemsList = ({ authUser, todoListItems, onEditItem, onRemoveItem }) => {
    return (
        <Grid 
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-end"
        >
            <ul>
                {   /*the map is important, as it is to get the todoListItems as a function param, not
                    * using this.props, every listItem object (todoListItems is an array of objects)
                    * has the 'text', 'userId' and 'uid' keys.
                    */
                    todoListItems.map( listItem => {
                        return(
                            <ListItem
                                authUser={authUser}
                                key={listItem.uid}
                                listItem={listItem}
                                onEditItem={onEditItem}
                                onRemoveItem={onRemoveItem}
                            />
                        )
                    })
                }
            </ul>
        </Grid>
    );
}

class ListItem extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            editMode: false,
            editText: this.props.listItem.text,
        };
    }

    onToggleEditMode = () => {
        this.setState( state => ({
            editMode: !state.editMode,
            editText: this.props.listItem.text,
        }));
    }

    onChangeEditText = event => {
        this.setState({ editText: event.target.value });
    }

    onSaveEditText = () => {
        this.props.onEditItem(this.props.listItem, this.state.editText);

        this.setState({ editMode: false });
    }

    render() { 
        const { authUser, listItem, onRemoveItem } = this.props;
        const { editMode, editText } = this.state;

        return ( 
            <li>
                <Grid item xs={12} my="1">
                    { editMode ? (
                        <TextField  
                            id="editText"
                            name="editText"
                            value={editText}
                            onChange={this.onChangeEditText}
                            type="text"
                        />
                        // <input
                        //     type="text"
                        //     value={editText}
                        //     onChange={this.onChangeEditText}
                        // />
                    ) : (
                        <span>
                            {/* <strong>{listItem.uid}</strong>*/}  
                            <Typography variant="body1" gutterBottom> 
                                {listItem.text} 
                            </Typography>
                            {listItem.editedAt && <span> (Edited) </span>}
                        </span>
                    )}
                
                
                {authUser.uid === listItem.userId && ( 
                    <span>
                        { editMode ? (
                            <span>
                                    <Button 
                                        color="primary" 
                                        variant="contained"
                                        onClick={this.onSaveEditText}
                                    > Save </Button>
                                    {/* <button onClick={this.onSaveEditText}>Save</button> */}

                                    <Button 
                                        color="primary" 
                                        variant="contained"
                                        onClick={this.onToggleEditMode}
                                    > Reset </Button>
                                    {/* <button onClick={this.onToggleEditMode}>Reset</button> */}
                            </span>
                        ) : (
                            <Button 
                                color="primary" 
                                variant="contained"
                                onClick={this.onToggleEditMode}
                            > Edit </Button>
                            // <button onClick={this.onToggleEditMode}>Edit</button>
                        )}

                        { !editMode && (
                            <Button 
                                color="primary" 
                                variant="contained"
                                onClick={ () => onRemoveItem(listItem.uid) }
                            > Delete </Button>
                            // <button
                            //     type="button"
                            //     onClick={ () => onRemoveItem(listItem.uid) }
                            // >
                            //     Delete
                            // </button>
                        )}
                    </span>
                )}
                </Grid>
            </li>
        );
    }
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
 * HomePage also renders a todo-list for the user
 * 
 * Notice the componentDidMount() event in the NotesBase component.
 * 
 * It adds a firebase 'listener' to the 'todo-list items' entity that will call the fallback function every time the db changes.
 * 
 *      this.props.firebase.todoItems().on( value => //to do )
 * 
 * And because it has a setState function it will re-render the changed components 
 * (https://firebase.google.com/docs/database/web/read-and-write#web_value_events).
 * 
 * It is important to know that .todoItems() is an API function defined at src\components\Firebase\firebase.js
 * 
 *      // *** To-do list API ***
 *      todoItem = uid => this.db.ref(`todoItems/${uid}`);
 *      todoItems = () => this.db.ref('todoItems');
 * 
 * So the listener will be the same as:
 *      
 *      firebase.db.ref('todoItems').on( snapshot => //todo )
 * 
 * Just like the docs suggest.
 * 
 * The same component also displays a form to save new todo-list items, the onSubmit handler, calls the onCreateNote function,
 * that then calls the firebase's .push() method (https://firebase.google.com/docs/database/admin/save-data) and cleans the input
 * state (a controlled form), that method returns an id for the new record in the db. The <TodoListBase> component also uses
 * the authUser context to get the uid of the logged in user (see its render function), and be able to pass it to the 
 * onCreateNote function, a random fact is that when you have several parameters to pass in a function, as a form handler, 
 * you must pass the 'event' parameter first:
 * 
 *      event => this.onCreateNote(event, authUser)
 * 
 * The base component will call the ItemsList component that only maps and calls ListItem for each of the list-items returned by 
 * the API call.
 * 
 * ListItem renders the item based on the passed parameters, it also has a local state to handle the 'edit mode', and renders
 * an edit and delete button based on it (the handlers wer defined at TodoListBase)
 */