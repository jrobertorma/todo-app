import React from 'React';

import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

const withAuthorization = (condition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount(){
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                (authUser) => {
                    if(!condition(authUser)){
                        this.props.history.push(ROUTES.SIGN_IN);
                    }
                },
            );
        }

        componentWillUnmount(){
            this.listener();
        }

        render() {
            return <Component {...this.props} />
        }
    }

    return withRouter( withFirebase( WithAuthorization ) );
};

export default withAuthorization;

/**
 * The withAuthorization HOC (higher order component).
 * 
 * it'll allow us to add the authorization bussiness logic to the other components.
 * 
 * See how it catches a component as a prop, and then returns a new component wrapped between another one that passes all the props we need
 * 
 */