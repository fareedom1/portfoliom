import { useState } from "react";
import supabase from "../supabase/client.js";
import PostForm from "../components/PostForm.jsx";
import { useNavigate } from "react-router-dom";

/**
 * Submit a new portfolio post.
 */
export default function CreatePost() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(data) {
    setLoading(true);
    setStatus("");
    // Get user
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      setStatus("You must be logged in.");
      setLoading(false);
      return;
    }
    const userId = session.session.user.id;
    const { error } = await supabase.from("portfolio_posts").insert([
      {
        user_id: userId,
        title: data.title,
        description: data.description,
        website_url: data.website_url,
        image_url: data.image_url,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
    setLoading(false);
    if (error) setStatus("Error: " + error.message);
    else navigate("/feed");
  }

  return (
    <div className="max-w-[700px] mt-12 mx-auto p-10 rounded-2xl bg-[#0b1020] border border-slate-800 shadow-[var(--shadow-soft)] max-md:p-6 max-md:mx-4">
      <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Create Portfolio Post</h2>
      <PostForm onSubmit={handleSubmit} loading={loading} />
      {status && <div className="mt-4 text-center text-red-400 text-sm font-medium">{status}</div>}
    </div>
  );
}
