import React, { useState, useEffect } from "react";
import "./TweetBox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import axios from 'axios';
import useLoggedinUser from "../../../Hooks/useLoggedinUser";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TweetBox() {
    const [post, setPost] = useState('');
    const [img, setImg] = useState('');
    const [imgURL, setImgURL] = useState('')
    const [video, setVideo] = useState('');
    const [videoURL, setVideoURL] = useState('');
    const [imageLoading, setImageLoading] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(localStorage.getItem('isOtpVerified')||false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState(' ');
    const [loggedInUser] = useLoggedinUser();
    const [user] = useAuthState(auth);
    
    const email = user?.email;
    const url = process.env.REACT_APP_BACKEND_URL
    const userProfilePic = loggedInUser[0]?.profileImage || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

    useEffect(() => {
        const otpVerified = localStorage.getItem('isOtpVerified');
        if (otpVerified === true) {
            setIsOtpVerified(true);
        }
    }, []);

    async function handleImageUpload() {
        const formData = new FormData();
        formData.set('file', img);
        formData.set('upload_preset', 'images_preset');

        try {
            setImageLoading(true);
            let cloudName = "dppfgnui0";
            let resourceType = 'image';
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, formData);
            const { secure_url } = res.data;
            return secure_url;
        } catch (err) {
            console.error(err);
        } finally {
            setImageLoading(false);
        }
    }

    async function handleVideoUpload() {
        const formData = new FormData();
        formData.set('file', video);
        formData.set('upload_preset', 'videos_preset');

        try {
            setVideoLoading(true);
            let cloudName = "dppfgnui0";
            let resourceType = 'video';
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, formData);
            const { secure_url } = res.data;
            return secure_url;
        } catch (err) {
            console.error(err);
        } finally {
            setVideoLoading(false);
        }
    }

    const sendOtp = async () => {
        try {
            await axios.post('${url}/send-otp', { email });
            setIsOtpSent(true);
            toast.success('OTP sent to your email');
        } catch (error) {
            toast.error('Error sending OTP');
        }
    };

    const verifyOtp = async () => {
        try {
            await axios.post('${url}/verify-otp', { email, otp });
            setIsOtpVerified(true);
            localStorage.setItem('isOtpVerified', true);
            toast.success('OTP verified');
        } catch (error) {
            toast.error('Invalid OTP');
        }
    };

    const handleTweet = async (e) => {
        e.preventDefault();
        if (!isOtpVerified) {
            toast.error('Please verify OTP before uploading');
            return;
        }

        if (user?.providerData[0]?.providerId === 'password') {
            fetch(`${url}/loggedInUser?email=${email}`)
                .then(res => res.json())
                .then(data => {
                    setName(data[0]?.name);
                    setUsername(data[0]?.username);
                });
        } else {
            setName(user?.displayName);
            setUsername(email?.split('@')[0]);
        }

        if (name) {
            let imgurl = "";
            let videourl = "";
            let upvoteCount = 0
            if (img) {
                imgurl = await handleImageUpload();
                setImgURL(imgurl);
            }

            if (video) {
                videourl = await handleVideoUpload();
                setVideoURL(videourl);
                upvoteCount = 1
            }

            const userPost = {
                profilePhoto: userProfilePic,
                post: post,
                image: imgurl,
                video: videourl,
                username: username,
                name: name,
                email: email,
                upvote: upvoteCount
            };

            setPost('');
            setImg('');
            setVideo('');
            setImgURL('');
            setVideoURL('');

            axios.post("${url}/post", { userPost })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        const maxSizeInMB = 10; // Set the max file size to 10 MB
        const maxDurationInSeconds = 60; // Set the max video duration to 30 seconds

        if (file && file.size / 1024 / 1024 > maxSizeInMB) {
            toast.error('Video size should be less than 10 MB');
            return;
        }

        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';

        videoElement.onloadedmetadata = () => {
            window.URL.revokeObjectURL(videoElement.src);
            if (videoElement.duration > maxDurationInSeconds) {
                toast.error('Video duration should be less than 30 seconds');
                return;
            }
            setVideo(file);
        };

        videoElement.src = URL.createObjectURL(file);
    };

    return (
        <div className="tweetBox">
            <ToastContainer />
            {!isOtpVerified ? (
                <>
                    <Button onClick={sendOtp}>Send OTP</Button>
                    {isOtpSent && (
                        <div>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                onChange={(e) => setOtp(e.target.value)}
                                value={otp}
                                required
                            />
                            <Button onClick={verifyOtp}>Verify OTP</Button>
                        </div>
                    )}
                </>
            ) : (
                <form onSubmit={handleTweet}>
                    <div className="tweetBox__input">
                        <Avatar src={userProfilePic} />
                        <input
                            type="text"
                            placeholder="What's happening?"
                            onChange={(e) => setPost(e.target.value)}
                            value={post}
                            required
                        />
                    </div>
                    <div className="mediaIcon_tweetButton">
                        <div className="mediaButton">
                            <label htmlFor='image' className="imageIcon">
                                {imageLoading ? <p>Uploading</p> : <p>{imgURL ? "Uploaded" : <AddPhotoAlternateOutlinedIcon />}</p>}
                            </label>
                            <input
                                type="file"
                                id='image'
                                className="imageInput"
                                onChange={(e) => setImg(e.target.files[0])}
                                accept="image/*"
                            />

                            <label htmlFor='video' className="imageIcon">
                                {videoLoading ? <p>Uploading</p> : <p>{videoURL ? "Uploaded" : <VideoLibraryOutlinedIcon />}</p>}
                            </label>
                            <input
                                type="file"
                                id='video'
                                className="imageInput"
                                onChange={handleVideoChange}
                                accept="video/*"
                            />
                        </div>
                        <Button className="tweetBox__tweetButton" type="submit">Tweet</Button>
                    </div>
                </form>
            )}
        </div>
    );
}
export default TweetBox;
