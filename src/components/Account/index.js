import {PasswordForgetForm} from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';

const AccountPage = () => {
    return ( 
        <AuthUserContext.Consumer>
            {
                (authUser) => {
                    <div>
                        <h1>Account Page</h1>
                        <PasswordForgetForm />
                        <PasswordChangeForm />
                    </div>
                }
            }
        </AuthUserContext.Consumer>
     );
}

const condition = authUser => !!authUser; // '!!expression', returns the 'truthiness' of expression

export default withAuthorization (condition)(AccountPage);