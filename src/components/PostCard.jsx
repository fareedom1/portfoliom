// Displays portfolio preview in feed
import { Link } from "react-router-dom";

// PostCard component receives all post information via props from Feed
export default function PostCard({
  id,          // Unique post ID (for navigation)
  imageUrl,    // Project screenshot or featured image
  title,       // Project title
  description, // Short summary/teaser
  author,      // Username or display name of post creator
  date,        // Creation date (should be formatted before passing, or you can format here)
  likeCount,   // Total number of likes for this post
}) {
  console.log(likeCount);
  console.log(author);
  return (
    <div className="flex flex-col p-0 rounded-lg bg-[radial-gradient(circle_at_top_left,#111827_0%,#020617_85%)] border border-slate-800 shadow-[var(--shadow-soft)] overflow-hidden max-w-[470px] mx-auto w-full">
      {/* Featured Project Image */}
      {imageUrl && (
        <img
          className="w-full h-auto max-h-[585px] object-cover block"
          src={imageUrl}
          alt={title + " screenshot"}
        />
      )}

      <div className="px-4 pt-3 pb-4">
        {/* Title links to detail page */}
        <div className="mb-2">
          <h3 className="m-0 inline text-[0.95rem] mr-1.5">
            <Link to={`/post/${id}`} className="text-gray-200 font-bold hover:underline">{title}</Link>
          </h3>
          <p className="inline text-gray-200 m-0 text-[0.92rem] leading-relaxed">{description}</p>
        </div>

        <div className="flex justify-between items-center mb-3 text-sm">
          <span className="font-semibold text-gray-200">By {author}</span>
          <span className="text-gray-400 text-xs">
            {date}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {/* Like count (add Like button later) */}
          <span className="text-gray-200">👍 {likeCount || 0}</span>
          {/* View Post button (optional) */}
          <Link className="text-sm text-sky-400 font-semibold hover:text-sky-300" to={`/post/${id}`}>
            View Post
          </Link>
        </div>
      </div>
    </div>
  );
}
