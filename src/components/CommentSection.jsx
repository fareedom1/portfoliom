// src/components/CommentSection.jsx
import { useEffect, useState } from "react";
import supabase from "../supabase/client.js";

/**
 * Displays and submits comments for a portfolio post.
 */
export default function CommentSection({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  async function fetchComments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setComments(data || []);
    setLoading(false);
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await supabase.from("comments").insert([
      { post_id: postId, user_id: userId, content }
    ]);
    setContent("");
    fetchComments();
    setLoading(false);
  }

  return (
    <div className="comments-section">
      <h4>Comments</h4>
      <form onSubmit={handleAddComment}>
        <textarea value={content} onChange={e => setContent(e.target.value)} required />
        <button type="submit" disabled={loading}>Add Comment</button>
      </form>
      {loading && <div>Loading...</div>}
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <strong>{comment.user_id}</strong>: {comment.content}
            <span className="comment-date"> ({new Date(comment.created_at).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
