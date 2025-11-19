// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import supabase from "../supabase/client.js";

/**
 * Simple profile viewing/editing page for current user.
 */
export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line
  }, []);

  async function getProfile() {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    if (!userId) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  }

  return (
    <div className="profile-view">
      <h2>My Profile</h2>
      {profile ? (
        <>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
        </>
      ) : <div>Loading...</div>}
    </div>
  );
}
