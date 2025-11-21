import { useEffect, useState } from "react";
import supabase from "../supabase/client.js";
import PostCard from "../components/PostCard.jsx";

/**
 * Portfolio feed — supports sorting by newest or top (most liked) and searching by post title.
 */
export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState(""); // <-- New state for search input

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [sort]);

  // Fetch posts and like counts (count likes in JS, sort in JS)
  async function fetchPosts() {
    setLoading(true);

    // 1. Get all posts with author profile
    const { data: posts, error } = await supabase
      .from("portfolio_posts")
      .select("id, title, description, image_url, created_at, user_id, profiles(username)");

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
      //main feed limited meta data requirement: comment out later
      //description: post.description,
      //imageUrl: post.image_url,
      //author: post.profiles?.username || "Unknown",
      date: new Date(post.created_at).toLocaleDateString(),
      likeCount: likeCountMap[post.id] || 0,
    }));

    // 5. Sort locally in JS
    if (sort === "top") {
      mergedPosts.sort((a, b) => b.likeCount - a.likeCount);
    } else {
      mergedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setPosts(mergedPosts);
    setLoading(false);
  }

  // Filter posts based on search query (case-insensitive)
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="feed-container">
      <h2 className="feed-title">Portfolio Feed</h2>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by title..."
        className="feed-search-box"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />
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
      {!loading && filteredPosts.length === 0 && <div className="feed-empty">No posts found.</div>}
      <div className="feed-list">
        {!loading &&
          filteredPosts.map(post => (
            <PostCard key={post.id} {...post} />
          ))}
      </div>
    </div>
  );
}
