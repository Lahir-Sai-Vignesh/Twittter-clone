import {React,useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import twitterImg from '../../assets/twitter.jpeg';
import XIcon from '@mui/icons-material/X';
import auth from '../../firebase.init.js';
import GoogleButton from "react-google-button";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import "./Login.css";
import axios from 'axios';



function Signup() {
  const [username, setUsername] = useState(" ");
  const [name, setName] = useState("");
    const[email,setEmail]=useState('');
    const[password,setPassword] = useState('');
    const [
      createUserWithEmailAndPassword,
      user,
      loading,
      error,
    ] = useCreateUserWithEmailAndPassword(auth);
    const [signInWithGoogle, Googleuser, loadingGoogle, errorGoogle] = useSignInWithGoogle(auth);
    const navigate = useNavigate();
    
    async function handleSubmit(e){
        e.preventDefault();
        //console.log(email,password);
        try{
          createUserWithEmailAndPassword(email,password);
          const user = {
            userName : username,
            Name : name,
            Email : email
          }
          axios.post(`http://localhost:5000/register`,user);
        }
        catch(error){
          console.error(error)
        }
      }
    
      if (user || Googleuser){
        navigate('/');
      }
    
  return (
    <div className="login-container">

        <div className="image-container">
          <img className="image" src={twitterImg} alt="twitterImage" />
        </div>

      <div className="form-container">

        <XIcon className="Twittericon"/>
        <h2 className="heading">Happening Now</h2>
        <div class="d-flex align-items-sm-center">
          <h3 className="heading1"> Join twitter today </h3>
        </div>
        {error && <p className="errorMessage">{error.message}</p>}
        <form onSubmit={handleSubmit}>
        <input className="display-name" style={{ backgroudColor: "red" }}
                                type="username"
                                placeholder="@username "
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <input className="display-name" style={{ backgroudColor: "red" }}
                                type="name"
                                placeholder="Enter Full Name"
                                onChange={(e) => setName(e.target.value)}
                            />

                            <input className="email"
                                type="email"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />



                            <input className="password"
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />


                            <div className="btn-login">
                                <button type="submit" className="btn">Sign Up</button>
                            </div>
        </form>
        <div className="google-button">
                            <GoogleButton

                                className="g-btn"
                                type="light"

                                onClick={()=>signInWithGoogle()}
                            />
                        </div>
                        <div>
                            Already have an account?
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: 'none',
                                    color: 'var(--twitter-color)',
                                    fontWeight: '600',
                                    marginLeft: '5px'
                                }}
                            >
                                Log In
                            </Link>
                          </div>
      </div>
    </div>
  )
}

export default Signup
