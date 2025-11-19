import { useState, useEffect } from "react";
import supabase from "../supabase/client.js";

/**
 * Handles like/unlike actions for a post.
 * Notifies the parent via onLikeChanged callback after like/unlike.
 */
export default function LikeButton({ postId, userId, onLikeChanged }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLiked();
    // eslint-disable-next-line
  }, [postId, userId]);

  async function checkLiked() {
    if (!userId) return;
    const { data } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();
    setLiked(!!data);
  }

  async function handleLike() {
    setLoading(true);
    if (!userId) {
      setLoading(false);
      return;
    }
    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
      setLiked(false);
    } else {
      await supabase.from("likes").insert([
        { post_id: postId, user_id: userId }
      ]);
      setLiked(true);
    }
    setLoading(false);
    if (onLikeChanged) onLikeChanged(); // Parent fetches new like count
  }

  return (
    <button className="like-btn" onClick={handleLike} disabled={loading || !userId}>
      {liked ? "❤️ Liked" : "🤍 Like"}
    </button>
  );
}
