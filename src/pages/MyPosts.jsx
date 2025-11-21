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
    fetchPosts();
    // eslint-disable-next-line
  }, [userId]);

  // Fetch posts and like counts (count likes in JS, sort in JS)
  async function fetchPosts() {
    setLoading(true);

    // 1. Get all posts with author profile
    const { data: posts, error } = await supabase
      .from("portfolio_posts")
      .select("id, title, description, image_url, created_at, user_id, profiles(username)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // 2. Get all likes (rows with post_id)
    const { data: allLikes, error: likesError } = await supabase
      .from("likes")
      .select("id, post_id");

    if (error || !posts || likesError) {
      setPosts([]);
      setLoading(false);
      return;
    }

    // 3. Build like counts: post_id -> count
    const likeCountMap = {};
    (allLikes || []).forEach(like => {
      if (!likeCountMap[like.post_id]) likeCountMap[like.post_id] = 0;
      likeCountMap[like.post_id]++;
    });

    // 4. Merge like counts with posts
    let mergedPosts = (posts || []).map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.image_url,
      author: post.profiles?.username || "Unknown",
      date: new Date(post.created_at).toLocaleDateString(),
      likeCount: likeCountMap[post.id] || 0,
    }));

    setPosts(mergedPosts);
    setLoading(false);
  }

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
