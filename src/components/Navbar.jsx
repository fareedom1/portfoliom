// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabase/client.js";
// Import Lucide React icons for a modern, visual navbar
import {
  LayoutGrid,
  User,
  PlusSquare,
  Images,
  MessageSquare,
  LogOut,
  House,
  LogIn
} from "lucide-react";

/**
 * Navbar component
 * Displays navigation links and handles user authentication state.
 * Uses a sticky, backdrop-blur design to stay visible while scrolling.
 */
export default function Navbar() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for an active session immediately when the component mounts
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // Listen for changes in auth status (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Clean up the subscription when the component unmounts
    return () => listener?.subscription.unsubscribe();
  }, []);

  /**
   * Handles user logout.
   * Signs out from Supabase, clears local session state, and redirects to home.
   */
  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/");
  }

  // Styling for navigation items (Icons)
  // - text-gray-400: Default color for icons
  // - p-2: Padding for touch targets
  // - rounded-full: Circular hover effect
  // - hover:bg-teal-900/35: Subtle background color on hover
  // - hover:text-sky-400: Icon changes to sky blue on hover
  // - hover:-translate-y-px: Slight upward movement for interactive feel
  const navItemClasses = "text-gray-400 p-2 rounded-full border-none bg-transparent cursor-pointer transition-all duration-200 hover:bg-teal-900/35 hover:text-sky-400 hover:-translate-y-px inline-flex items-center justify-center";

  return (
    // Navbar Container Styling:
    // - w-screen: Full width
    // - sticky top-0: Stays at the top of the viewport
    // - backdrop-blur-lg: Frosted glass effect
    // - bg-gradient-to-r: Subtle gradient background (Slate 900)
    // - border-b: Bottom border for separation
    <nav className="w-screen sticky top-0 z-20 backdrop-blur-lg bg-gradient-to-r from-slate-900/95 to-slate-900/80 border-b border-slate-400/15 px-7 py-3 flex justify-between items-center">
      <ul className="flex gap-5 list-none m-0 p-0 w-full justify-center">
        {/* Conditional rendering: Show app links if logged in, public links otherwise */}
        {session ? (
          <>
            {/* Authenticated User Links */}
            <li><Link to="/feed" className={navItemClasses} title="Feed"><LayoutGrid size={24} /></Link></li>
            <li><Link to="/profile" className={navItemClasses} title="Profile"><User size={24} /></Link></li>
            <li><Link to="/create-post" className={navItemClasses} title="Create Post"><PlusSquare size={24} /></Link></li>
            <li><Link to={`/my-posts/${session?.user?.id}`} className={navItemClasses} title="My Posts"><Images size={24} /></Link></li>
            <li><Link to="/feedback" className={navItemClasses} title="Feedback"><MessageSquare size={24} /></Link></li>
            <li>
              <button className={navItemClasses} onClick={handleLogout} title="Logout">
                <LogOut size={24} />
              </button>
            </li>
          </>
        ) : (
          <>
            {/* Public/Guest Links */}
            <li><Link to="/" className={navItemClasses} title="Home"><House size={24} /></Link></li>
            <li><Link to="/login" className={navItemClasses} title="Login"><LogIn size={24} /></Link></li>
            <li><Link to="/feedback" className={navItemClasses} title="Feedback"><MessageSquare size={24} /></Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
