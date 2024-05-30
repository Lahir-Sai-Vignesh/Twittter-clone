import React, { useState } from "react";
import "./TweetBox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import axios from 'axios';
import useLoggedinUser from "../../../Hooks/useLoggedinUser";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";
function TweetBox() {
    const [post, setPost] = useState('')
    const [imageURL, setImageURL] = useState('');
    const [isLoading,setIsLoading]=useState('')
    const [name, setName] = useState('');
    const [username, setUsername] = useState(' ');
    const [loggedInUser] = useLoggedinUser();
    const [user]  = useAuthState(auth);
    const email = user?.email;


    const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"


    function handleImageUpload(e){
        const image = e.target.files[0]

        const formData = new FormData();
        formData.set('image',image)

        axios.post("https://api.imgbb.com/1/upload?key=dc892dd71df9da2f538cb1091faf15d4",formData)
        .then(res=>{
            const Data = res.data;
            setImageURL(Data.data.display_url);
            setIsLoading(false)
        }).catch(error =>{
            console.error(error)
            setIsLoading(false)
        })
    }

    const handleTweet = (e) => {
        e.preventDefault();
        if (user?.providerData[0]?.providerId === 'password') {
            fetch(`http://localhost:5000/loggedInUser?email=${email}`)
                .then(res => res.json())
                .then(data => {
                    setName(data[0]?.name)
                    setUsername(data[0]?.username)
                })
        }
        else {
            setName(user?.displayName)
            setUsername(email?.split('@')[0])
        }
        if (name) {
            const userPost = {
                profilePhoto: userProfilePic,
                post: post,
                photo: imageURL,
                username: username,
                name: name,
                email: email,
            }
            console.log(userPost);
            setPost('')
            setImageURL('')
            axios.post("http://localhost:5000/post",
                        {userPost})
                .then(res =>{
                    console.log(res)
                })
                .catch(err =>{
                    console.error(err)
                })
    
        }
            
}

    return <div className="tweetBox">
        <form onSubmit={handleTweet}>
            <div className="tweetBox__input">
                <Avatar src={userProfilePic}/>
                <input
                    type="text"
                    placeholder="What's happening?"
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    required
                />

            </div>
            <div className="imageIcon_tweetButton">
                <label htmlFor='image' className="imageIcon">
                    {isLoading?<p>Uploading Image</p> :<p>{imageURL? "imageUploaded":<AddPhotoAlternateOutlinedIcon />}</p>}
                </label>
                <input
                    type="file"
                    id='image'
                    className="imageInput"
                    onChange={handleImageUpload}
                />
                <Button className="tweetBox__tweetButton" type="submit">Tweet</Button>
            </div>
        </form>

    </div>
}
export default TweetBox;