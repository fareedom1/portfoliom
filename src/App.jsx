import { Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Feed from './pages/Feed.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import CreatePost from './pages/CreatePost.jsx';
import PostDetail from './pages/PostDetail.jsx';
import MyPosts from './pages/MyPosts.jsx';
import Feedback from './pages/Feedback.jsx';
import Navbar from './components/Navbar.jsx';

import './App.css';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/my-posts/:id" element={<MyPosts />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </>
  )
}

export default App;


