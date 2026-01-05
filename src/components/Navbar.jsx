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

  const navItemClasses = "text-gray-400 text-base font-medium px-3.5 py-1.5 rounded-full border-none bg-transparent cursor-pointer transition-all duration-200 hover:bg-teal-900/35 hover:text-gray-200 hover:-translate-y-px inline-block";

  return (
    <nav className="w-screen sticky top-0 z-20 backdrop-blur-lg bg-gradient-to-r from-slate-900/95 to-slate-900/80 border-b border-slate-400/15 px-7 py-3 flex justify-between items-center">
      <ul className="flex gap-5 list-none m-0 p-0">
        {session ? (
          <>
            <li><Link to="/feed" className={navItemClasses}>Feed</Link></li>
            <li><Link to="/profile" className={navItemClasses}>Profile</Link></li>
            <li><Link to="/create-post" className={navItemClasses}>Create Post</Link></li>
            <li><Link to={`/my-posts/${session?.user?.id}`} className={navItemClasses}>My Posts</Link></li>
            <li><Link to="/feedback" className={navItemClasses}>Feedback</Link></li>
            <li>
              <button className={navItemClasses} onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/" className={navItemClasses}>Home</Link></li>
            <li><Link to="/login" className={navItemClasses}>Login</Link></li>
            <li><Link to="/feedback" className={navItemClasses}>Feedback</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
