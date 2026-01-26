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


function App() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Configuration Error</h1>
        <p className="text-lg mb-2">Supabase environment variables are missing.</p>
        <p className="text-slate-400">Please check your <code className="bg-slate-800 p-1 rounded">.env</code> file.</p>
      </div>
    );
  }

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


