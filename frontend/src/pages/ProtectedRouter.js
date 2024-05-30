import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import auth from '../firebase.init'
import { Navigate } from 'react-router-dom';


function ProtectedRouter({children}) {
    const [user,loading]=useAuthState(auth);
    if (loading){
        return <p>Loading..</p>
    }
    // when we refresh the page after login , if we don't return anything during the loading phase where user is null
    // then it will go to /login page as user is not found
    if (!user){
        return <Navigate to='/login' />
    }
    return children;
}
// content inside <ProtectedRouter><Home /> </ProtectedRouter> will be sent to this function 
// the argument sent will be a plain javascript object which has some properties inside like children
// react expects react elements to render but not objects
// so we need to destructure the object 
// one option could be props as paramter and return props.children
// else like above code
export default ProtectedRouter
