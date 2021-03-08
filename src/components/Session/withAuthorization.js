import React from 'React';

const withAuthorization = () => (component) => {
    class WithAuthorization extends React.Compoent {
        render() {
            return <Component {...this.props} />
        }
    }

    return WithAuthorization;
};

export default withAuthorization;

/**
 * The withAuthorization HOC (higher order component).
 * 
 * it'll allow us to add the authorization bussiness logic to the other components.
 * 
 * See how it cathces a component as a prop, and then returns ...
 */