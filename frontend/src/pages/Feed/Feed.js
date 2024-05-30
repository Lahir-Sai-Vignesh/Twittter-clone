import React,{useState,useEffect} from 'react';
import "./Feed.css";
import TweetBox from "./TweetBox/TweetBox";
import Post from "./Post/Post.js";
import axios from 'axios';
function Feed() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        //fetch('https://pacific-peak-30751.herokuapp.com/post')
        axios.get('http://localhost:5000/post')
            .then(res=> {
                //console.log(res.data)
                setPosts(res.data);
            })
    }, [posts])
  return (
    <div className="feed">
        <div className="feed__header">
            <h2>Home</h2>
        </div>
        <TweetBox />
        {
            posts.map(p => <Post key={p._id} p={p} />)
        }
        
    </div>

)
}

export default Feed
