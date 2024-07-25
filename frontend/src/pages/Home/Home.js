import React from 'react'
import Sidebar from "../Sidebar/Sidebar.js";
import Widgets from '../Widget/Widgets.js';
import Feed from "../Feed/Feed.js";
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import auth from '../../firebase.init.js';
import { Outlet } from 'react-router-dom';

function Home() {
  const [user ] = useAuthState(auth);
    const handleLogout = async () => {
        signOut(auth)
        localStorage.setItem('isOtpVerified', false);
    };
    
    console.log("user",user);
  return (
    <div className='app'>

      <Sidebar handleLogout={handleLogout} user={user} />
      <Outlet />
      <Widgets/>
    </div>
  )
}

export default Home
