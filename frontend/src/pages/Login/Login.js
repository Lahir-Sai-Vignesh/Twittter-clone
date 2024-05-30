import {React,useState} from 'react'
import twitterImg from '../../assets/twitter.jpeg';
import { Link, useNavigate } from "react-router-dom";
import XIcon from '@mui/icons-material/X';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init.js';
import GoogleButton from 'react-google-button';
import "./Login.css";

function Login() {
  const[email,setEmail]=useState('');
  const[password,setPassword] = useState('');

  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  const [signInWithGoogle, Googleuser, loadingGoogle, errorGoogle] = useSignInWithGoogle(auth);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      await signInWithEmailAndPassword(email, password);
      // signInWithEmailAndPassword is an asynchronous operation
      // After successful sign-in, you can handle user redirection or state update
    } catch (error) {
      window.alert(error.message);
    }
  };

  if (user || Googleuser){
    navigate('/');
  }


  return (
    <div className="login-container">
        <div className="image-container">
          <img className="image" src={twitterImg} alt="twitterImage" />
        </div>
      
      <div className="form-container">
      <div className="form-box">
        <XIcon />
        <h2 className="heading">Happening Now</h2>
        {error && <p>{error.message}</p>}
        <form onSubmit={handleSubmit}>
           <input type="email" className="email" placeholder='email' onChange={event=>{setEmail(event.target.value)}}/> {/*event.target gives the element that triggered the event */}
          <input className="password" type="password" placeholder='password' onChange={event=>{setPassword(event.target.value)}}/>
          <div className="btn-login">
            <button type="submit" className="btn" >Log In</button>
          </div>
        </form>
        <hr />
        <GoogleButton type="light" className="g-btn" onClick={()=>signInWithGoogle()} />
      
      </div>
      <div>
          Don't have an account?
          <Link
              to="/signup"
              style={{
                  textDecoration: 'none',
                  color: 'var(--twitter-color)',
                  fontWeight: '600',
                  marginLeft: '5px'
              }}
          >
              Sign up
          </Link>
      </div>
      </div>
    </div>
  )
}

export default Login
