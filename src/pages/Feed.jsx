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
      description: post.description,
      imageUrl: post.image_url,
      author: post.profiles?.username || "Unknown",
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

  const sortBtnBase = "rounded-full border border-slate-700 bg-slate-900/85 text-gray-400 px-5 py-1.5 text-sm cursor-pointer transition-colors duration-200 hover:bg-sky-400 hover:text-slate-950 hover:border-transparent";
  const sortBtnActive = "bg-sky-400 text-slate-950 border-transparent";

  return (
    <div className="max-w-[960px] mx-auto mt-10 px-5 pb-14">
      <h1 className="text-3xl font-bold mb-3 text-center tracking-wide font-extrabold mb-2 bg-[linear-gradient(90deg,var(--logo-gradient))] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.45)] ">
    Portfoliom
      </h1>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by title..."
        className="w-full mb-4 p-2 rounded-lg border border-slate-700 bg-slate-900 text-gray-200 focus:border-sky-500 outline-none block"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex justify-center gap-3 mb-8">
        <button
          className={`${sortBtnBase} ${sort === "newest" ? sortBtnActive : ""}`}
          onClick={() => setSort("newest")}
        >
          Newest
        </button>
        <button
          className={`${sortBtnBase} ${sort === "top" ? sortBtnActive : ""}`}
          onClick={() => setSort("top")}
        >
          Top
        </button>
      </div>
      {loading && <div className="text-center mt-8 text-gray-400">Loading...</div>}
      {!loading && filteredPosts.length === 0 && <div className="text-center mt-8 text-gray-400">No posts found.</div>}
      <div className="grid grid-cols-1 gap-6">
        {!loading &&
          filteredPosts.map(post => (
            <PostCard key={post.id} {...post} />
          ))}
      </div>
    </div>
  );
}
