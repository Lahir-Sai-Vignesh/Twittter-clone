
import React from "react";
import "./Post.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";


function Post({ p }) {
  const { name, username, image, video, post, profilePhoto ,upvote} = p.userPost
  return (
    <div className="post">
      <div className="post__avatar">
        <Avatar src={profilePhoto} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>{name}
              <span className="post__headerSpecial">
                <VerifiedUserIcon className="post__badge" /> @{username}
              </span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{post}</p>
          </div>
        </div>
        <div>{image && <img src={image} alt="" width='500' />}</div>
        <div>
          {video &&
            <video width="320" height="240" controls autoplay>
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          }
        </div>
        <div className="post__footer">
          <ChatBubbleOutlineIcon className="post__footer__icon" fontSize="small" />
          <RepeatIcon className="post__footer__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__footer__icon" fontSize="small" />
          <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <PublishIcon className="post__footer__icon" fontSize="small" />
            <p>{upvote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Post;