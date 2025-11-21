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
    console.log("fetched like count: "+ count);
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
    <div className="post-detail">
      <h2>{post.title}</h2>
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          style={{ maxWidth: '320px' }}
        />
      )}
      <p>{post.description}</p>
      <p>
        Website:{" "}
        <a href={post.website_url} target="_blank" rel="noopener noreferrer">
          {post.website_url}
        </a>
      </p>

      <div className="post-detail-likes" style={{ marginBottom: "0.7rem" }}>
        <span role="img" aria-label="likes">👍</span> {likeCount}
      </div>
      <LikeButton postId={post.id} userId={userId} onLikeChanged={fetchLikeCount} />

      {isOwner && (
        <>
          <button
            onClick={() => setEditing(e => !e)}
            style={{ marginBottom: "1rem" }}
          >
            {editing ? "Cancel" : "Edit Post"}
          </button>
          {editing && (
            <>
              <PostForm
                initialData={post}
                onSubmit={handleUpdate}
                loading={loading}
              />
              {/* Add Delete Button */}
              <button
                onClick={handleDelete}
                className="post-delete-btn"
                style={{ marginTop: "1rem", background: "#F44336", color: "#fff", border: "none", padding: "0.5rem 1rem", cursor: "pointer" }}
                disabled={loading}
              >
                Delete Post
              </button>
            </>
          )}
          {status && <div className="form-status">{status}</div>}
        </>
      )}
      <CommentSection postId={post.id} userId={userId} />
    </div>
  );
}
