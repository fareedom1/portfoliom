// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabase/client.js";

/**
 * Navbar with dynamic links depending on user login state.
 */
export default function Navbar() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    // Listen for changes in auth status
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  // Log out handler
  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {session ? (
          <>
            <li><Link to="/feed">Feed</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/create-post">Create Post</Link></li>
            <li><Link to={`/my-posts/${session?.user?.id}`}>My Posts</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
            <li>
              <button className="navbar-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
