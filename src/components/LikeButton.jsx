import { useState, useEffect } from "react";
import supabase from "../supabase/client.js";

export default function LikeButton({ postId, userId, onLikeChanged }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Post id: " + postId + ". User id: " + userId);
    checkLiked();
    // eslint-disable-next-line
  }, [postId, userId]);

  async function checkLiked() {
    if (!userId || !postId) {
      setLiked(false);
      return;
    }
    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();
    setLiked(!!data);
    console.log(liked);
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
      // Only try to insert
      const { error } = await supabase.from("likes").insert([
        { post_id: postId, user_id: userId }
      ]);
      // Ignore duplicate error (code 23505) – treat as successful like, update UI
      if (error) {
        // Only display/log if NOT the expected duplicate error!
        console.error(error);
      }
      setLiked(true);
    }

    setLoading(false);
    if (onLikeChanged) onLikeChanged();
  }


  return (
    <button className="rounded-full border border-slate-500/15 bg-slate-900/90 py-1 px-3.5 text-sm cursor-pointer text-gray-50 flex items-center gap-2 hover:scale-110 hover:text-red-400 transition-transform disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleLike} disabled={loading || !userId}>
      {liked ? "❤️ Liked" : "🤍 Like"}
    </button>
  );
}
