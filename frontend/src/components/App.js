import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Signup from '../pages/Login/Signup';
import './App.css';
import ProtectedRouter from '../pages/ProtectedRouter';
import Explore from "../pages/Explore/Explore";
import Feed from "../pages/Feed/Feed";
import Messages from "../pages/Messages/Messages";
import Bookmarks from "../pages/Bookmarks/Bookmarks";
import Lists from "../pages/Lists/Lists";
import Profile from "../pages/Profile/Profile";
import More from "../pages/More/More";
import Notifications from "../pages/Notifications/Notifications";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRouter> <Home /></ProtectedRouter>} >
            <Route index element={<Feed />} />
          </Route>
          {/* Nested Route with index: The nested route with index indicates that 
          when the user is at the root URL and no additional path is provided, 
          the Feed component should be rendered within the Home component. */}
          <Route path='/home' element=<ProtectedRouter><Home /> </ProtectedRouter> >
            <Route path="feed" element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="lists" element={<Lists />} />
            <Route path="profile" element={<Profile />} />
            <Route path="more" element={<More />} />
          </Route>
          <Route path='/login' element=<Login /> />
          <Route path='/signup' element=<Signup /> />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
