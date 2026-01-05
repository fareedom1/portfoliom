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
      .select("id, post_id, user_id, content, created_at, parent_id, profiles(username)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    console.log(data);
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
    <div className="mt-7">
      <h4 className="mb-2 font-semibold">Comments</h4>
      <form onSubmit={handleAddComment} className="flex flex-col gap-1.5 mb-4">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          className="p-3 rounded-lg border border-slate-700 bg-slate-900 text-gray-200 outline-none focus:border-sky-500 min-h-[70px] text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-full border-none px-4 py-1.5 bg-sky-500 text-slate-950 text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          Add Comment
        </button>
      </form>
      {loading && <div className="text-gray-400 text-xs">Loading...</div>}
      <ul className="list-none p-0 m-0">
        {comments.map(comment => (
          <li key={comment.id} className="py-2.5 border-b border-slate-800/70 text-sm text-gray-300">
            <strong className="text-gray-200">{comment.profiles.username}</strong>: {comment.content}
            <span className="text-gray-500 text-xs ml-2">({new Date(comment.created_at).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
