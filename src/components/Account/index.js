import {PasswordForgetForm} from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { withAuthorization } from '../Session';

const AccountPage = () => {
    return ( 
        <div>
            <h1>Account Page</h1>
            <PasswordForgetForm />
            <PasswordChangeForm />
        </div>
     );
}

const condition = authUser => !!authUser; // '!!expression', returns the 'truthiness' of expression

export default withAuthorization (condition)(AccountPage);