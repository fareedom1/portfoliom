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
    <div>
      <h2>Create Portfolio Post</h2>
      <PostForm onSubmit={handleSubmit} loading={loading} />
      {status && <div className="form-status">{status}</div>}
    </div>
  );
}
