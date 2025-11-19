import { useState } from "react";

/**
 * Reusable form for create/edit portfolio post. Receives initialData for editing, calls onSubmit with latest values.
 */
export default function PostForm({ initialData = {}, onSubmit, loading }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [websiteUrl, setWebsiteUrl] = useState(initialData.website_url || "");
  const [imageUrl, setImageUrl] = useState(initialData.image_url || "");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      title,
      description,
      website_url: websiteUrl,
      image_url: imageUrl,
    });
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <label>Project Title</label>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <label>Description</label>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <label>Website URL</label>
      <input
        value={websiteUrl}
        onChange={e => setWebsiteUrl(e.target.value)}
      />
      <label>Image URL (optional)</label>
      <input
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Post"}
      </button>
    </form>
  );
}
