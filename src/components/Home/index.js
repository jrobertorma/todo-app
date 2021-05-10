import React, {Component} from 'react';
import { withFirebase } from '../Firebase';

import { withAuthorization, withEmailVerification } from '../Session';

const HomePage = () => {
    return ( 
        <div>
            <h1>Home Page</h1>
            <p>The Home Page is accessible by every signed in user.</p>
            
            <Notes />
        </div>
     );
}

class NotesBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            notes: [],
        }
    }
    
    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.notes().on('value', snapshot => {
            const notesObject = snapshot.val();

            //convert notes list from snapshot (is a set of objects)
            if ( notesObject ) {
                const notesArray = Object.keys(notesObject).map(key => ({
                    ...notesObject[key],
                    uid: key,
                }));

                this.setState({
                    notes: notesArray,
                    loading: false,
                });
            } else {
                this.setState({ notes: null, loading: false });
            }
        });
    }

    componentWillUnmount() {
        this.props.firebase.notes.off();
    }

    render() { 
        const { notes, loading } = this.state;

        return (
            <div>
                { loading && <div>Loading ...</div> }

                <NoteList notes={notes}/>
            </div>
        );
    }
}

const NoteList = ({ notes }) => {
    return(
        <ul>
            {
                notes.map( note => {
                    <NoteItem key={note.uid} note={note}/>
                })
            }
        </ul>
    );
}

const NoteItem = ({ note }) => {
    return ( 
        <li>
            <strong>{note.uid}</strong>
            {note.text}
        </li>
    );
}

const Notes = withFirebase(NotesBase);

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
 * And because it has a setState function it will re-render the changed components.
 */