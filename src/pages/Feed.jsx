// src/pages/Feed.jsx
import { useEffect, useState } from "react";
import supabase from "../supabase/client.js";
import PostCard from "../components/PostCard.jsx";

/**
 * Portfolio feed — supports sorting by newest or top (most liked).
 */
export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [sort]);

  // Fetch posts (with author info and like counts)
  async function fetchPosts() {
    setLoading(true);

    // Supabase join + like count aggregation
    let query = supabase
      .from("portfolio_posts")
      .select(`
        id, title, description, image_url, created_at, user_id,
        profiles(username),
        likes(count)
      `);

    // Sorting: by newest or most liked
    if (sort === "top") {
      // Order by aggregated likes descending
      // Supabase creates 'likes' join as an array of 1 object with a 'count'
      query = query.order("likes", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      setPosts([]);
      setLoading(false);
      return;
    }

    // Format posts for PostCard
    const formatted = (data || []).map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.image_url,
      author: post.profiles?.username || "Unknown",
      date: new Date(post.created_at).toLocaleDateString(),
      likeCount: Array.isArray(post.likes) && post.likes.length > 0 
        ? post.likes[0].count 
        : 0,
    }));

    setPosts(formatted);
    setLoading(false);
  }

  return (
    <div className="feed-container">
      <h2 className="feed-title">Portfolio Feed</h2>
      <div className="feed-sorting">
        <button
          className={sort === "newest" ? "feed-sort-btn active" : "feed-sort-btn"}
          onClick={() => setSort("newest")}
        >
          Newest
        </button>
        <button
          className={sort === "top" ? "feed-sort-btn active" : "feed-sort-btn"}
          onClick={() => setSort("top")}
        >
          Top
        </button>
      </div>
      {loading && <div className="feed-loading">Loading...</div>}
      {!loading && posts.length === 0 && <div className="feed-empty">No posts found.</div>}
      <div className="feed-list">
        {!loading &&
          posts.map(post => (
            <PostCard key={post.id} {...post} />
          ))}
      </div>
    </div>
  );
}
