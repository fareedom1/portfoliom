// src/pages/MyPosts.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabase/client.js";
import PostCard from "../components/PostCard.jsx";

/**
 * Shows all portfolio posts for the logged-in user.
 */
export default function MyPosts() {
  const { id: userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [userId]);

  async function fetch() {
    setLoading(true);
    const { data } = await supabase
      .from("portfolio_posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  }

  return (
    <div className="my-posts">
      <h2>My Portfolio Posts</h2>
      {loading && <div>Loading...</div>}
      <div>
        {posts.map(post => <PostCard key={post.id} {...post} />)}
      </div>
    </div>
  );
}
