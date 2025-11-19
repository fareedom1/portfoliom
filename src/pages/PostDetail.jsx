import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabase/client.js";
import PostForm from "../components/PostForm.jsx";
import LikeButton from "../components/LikeButton.jsx";
import CommentSection from "../components/CommentSection.jsx";

/**
 * View post detail, with owner editing, likes, and comments.
 */
export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Likes logic
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchPost();
    getUser();
    fetchLikeCount();
    // eslint-disable-next-line
  }, [id]);

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
    // Get the total number of likes for the current post
    const { count } = await supabase
      .from("likes")
      .select('*', { count: 'exact', head: true })
      .eq("post_id", id);
    setLikeCount(count || 0);
  }

  // Update the post (edit)
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
      .eq("user_id", userId); // Secure: user only updates their own post
    setLoading(false);

    if (error) {
      setStatus("Error updating post: " + error.message);
    } else {
      setEditing(false);
      setStatus("Post updated!");
      fetchPost(); // Refresh details
    }
  }

  if (!post) return <div>Loading Post...</div>;

  // Only owners see edit controls
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

      {/* Show the current like count */}
      <div className="post-detail-likes" style={{ marginBottom: "0.7rem" }}>
        <span role="img" aria-label="likes">👍</span> {likeCount}
      </div>

      {/* Like button for all logged-in users */}
      <LikeButton postId={post.id} userId={userId} onLikeChanged={fetchLikeCount} />

      {/* Owner edit controls */}
      {isOwner && (
        <>
          <button
            onClick={() => setEditing(e => !e)}
            style={{ marginBottom: "1rem" }}
          >
            {editing ? "Cancel" : "Edit Post"}
          </button>
          {editing && (
            <PostForm
              initialData={post}
              onSubmit={handleUpdate}
              loading={loading}
            />
          )}
          {status && <div className="form-status">{status}</div>}
        </>
      )}

      {/* Comments, shown to all */}
      <CommentSection postId={post.id} userId={userId} />
    </div>
  );
}
