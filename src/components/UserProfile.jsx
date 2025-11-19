// src/components/UserProfile.jsx
import { useEffect, useState } from "react";
import supabase from "../supabase/client.js";
import PostCard from "./PostCard.jsx";

/**
 * Shows profile info and portfolio posts for a specific user.
 */
export default function UserProfile({ userId }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [userId]);

  async function fetchData() {
    setLoading(true);
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(profileData);

    const { data: postsData } = await supabase
      .from("portfolio_posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setPosts(postsData || []);
    setLoading(false);
  }

  return (
    <div className="user-profile">
      {loading && <div>Loading profile...</div>}
      {profile && (
        <div>
          <h2>{profile.username}</h2>
          <p>{profile.email || ""}</p>
          {/* Add fields/bio/avatar as desired */}
        </div>
      )}
      <h3>User’s Portfolio Posts</h3>
      <div>
        {posts.map(post => (
          <PostCard key={post.id} {...post} author={profile?.username} />
        ))}
      </div>
    </div>
  );
}
