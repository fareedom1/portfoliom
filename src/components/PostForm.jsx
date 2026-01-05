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
    <form className="flex flex-col gap-4 text-sm w-full" onSubmit={handleSubmit}>
      <label className="text-gray-400 font-medium">Project Title</label>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="p-3 rounded-lg border border-slate-700 bg-slate-900 text-gray-200 outline-none focus:border-sky-500 transition-colors"
      />
      <label className="text-gray-400 font-medium">Description</label>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        className="p-3 rounded-lg border border-slate-700 bg-slate-900 text-gray-200 outline-none focus:border-sky-500 transition-colors min-h-[120px]"
      />
      <label className="text-gray-400 font-medium">Website URL</label>
      <input
        value={websiteUrl}
        onChange={e => setWebsiteUrl(e.target.value)}
        className="p-3 rounded-lg border border-slate-700 bg-slate-900 text-gray-200 outline-none focus:border-sky-500 transition-colors"
      />
      <label className="text-gray-400 font-medium">Image URL (optional)</label>
      <input
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        className="p-3 rounded-lg border border-slate-700 bg-slate-900 text-gray-200 outline-none focus:border-sky-500 transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 font-semibold border-none rounded-full px-8 py-2.5 cursor-pointer transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed self-start"
      >
        {loading ? "Saving..." : "Save Post"}
      </button>
    </form>
  );
}
