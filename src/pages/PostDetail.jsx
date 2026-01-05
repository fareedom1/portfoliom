import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabase/client.js";
import PostForm from "../components/PostForm.jsx";
import LikeButton from "../components/LikeButton.jsx";
import CommentSection from "../components/CommentSection.jsx";

/**
 * View post detail, with owner editing, likes, and comments.
 */
export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Navigates after delete
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchPost();
    getUser();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    fetchLikeCount();
    console.log("current likes: " + likeCount);
  }, [id, userId]);

  async function fetchPost() {
    const { data } = await supabase
      .from("portfolio_posts")
      .select("*")
      .eq("id", id)
      .single();
    setPost(data);
  }

  async function getUser() {
    const { data: session } = await supabase.auth.getSession();
    setUserId(session?.session?.user?.id || null);
  }

  async function fetchLikeCount() {
    // Always get the current total like count for this post
    const { count } = await supabase
      .from("likes")
      .select('user_id', { count: 'exact', head: true })
      .eq("post_id", id);
    setLikeCount(count);
    console.log("fetched like count: " + count);
  }

  async function handleUpdate(updatedData) {
    setLoading(true);
    setStatus("");
    const { error } = await supabase
      .from("portfolio_posts")
      .update({
        ...updatedData,
        updated_at: new Date(),
      })
      .eq("id", id)
      .eq("user_id", userId);
    setLoading(false);

    if (error) {
      setStatus("Error updating post: " + error.message);
    } else {
      setEditing(false);
      setStatus("Post updated!");
      fetchPost();
    }
  }

  // New: handle delete function
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;

    setLoading(true);
    const { error } = await supabase
      .from("portfolio_posts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    setLoading(false);

    if (error) {
      setStatus("Error deleting post: " + error.message);
    } else {
      setStatus("Post deleted!");
      navigate("/feed"); // Redirect to feed after deletion
    }
  }

  if (!post) return <div>Loading Post...</div>;

  const isOwner = userId && post.user_id === userId;

  return (
    <div className="max-w-[760px] mx-auto mt-10 p-9 pb-9 rounded-3xl bg-[radial-gradient(circle_at_top_left,#1f2937_0%,#020617_70%)] border border-slate-700/70 shadow-[var(--shadow-soft)] max-md:p-6 max-md:mx-4">
      <h2 className="mt-0 mb-3 text-3xl font-bold">{post.title}</h2>
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="rounded-xl my-4 object-cover w-full max-w-[320px] block"
        />
      )}
      <p className="text-gray-300 leading-relaxed mb-4">{post.description}</p>
      <p className="mb-6">
        <span className="text-gray-400 mr-2">Website:</span>
        <a href={post.website_url} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 font-medium break-all">
          {post.website_url}
        </a>
      </p>

      <div className="flex items-center gap-2 mb-3">
        <span role="img" aria-label="likes" className="text-lg">👍</span> <span className="font-semibold text-lg">{likeCount}</span>
      </div>
      <LikeButton postId={post.id} userId={userId} onLikeChanged={fetchLikeCount} />

      {isOwner && (
        <div className="mt-6 border-t border-slate-700 pt-4">
          <button
            onClick={() => setEditing(e => !e)}
            className="mb-4 text-sky-400 hover:text-sky-300 text-sm font-semibold bg-transparent border-none cursor-pointer"
          >
            {editing ? "Cancel Edit" : "Edit Post"}
          </button>
          {editing && (
            <div className="mb-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <PostForm
                initialData={post}
                onSubmit={handleUpdate}
                loading={loading}
              />
              {/* Add Delete Button */}
              <button
                onClick={handleDelete}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white border-none px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors"
                disabled={loading}
              >
                Delete Post
              </button>
            </div>
          )}
          {status && <div className="mt-2 text-sm text-green-400">{status}</div>}
        </div>
      )}
      <CommentSection postId={post.id} userId={userId} />
    </div>
  );
}
