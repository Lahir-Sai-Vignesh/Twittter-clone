import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrWmC338Ukss3lq9ReDcXp7wJgVL3Q7cI",
  authDomain: "twitter-clone-47213.firebaseapp.com",
  projectId: "twitter-clone-47213",
  storageBucket: "twitter-clone-47213.appspot.com",
  messagingSenderId: "1086271624662",
  appId: "1:1086271624662:web:690a8cf0a0650ca150c077"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;