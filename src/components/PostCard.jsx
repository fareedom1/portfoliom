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
  return (
    <div className="post-card">
      {/* Featured Project Image */}
      {imageUrl && (
        <img
          className="post-card-img"
          src={imageUrl}
          alt={title + " screenshot"}
        />
      )}

      <div className="post-card-body">
        {/* Title links to detail page */}
        <h3 className="post-card-title">
          <Link to={`/post/${id}`}>{title}</Link>
        </h3>

        <p className="post-card-description">{description}</p>

        <div className="post-card-meta">
          <span className="post-card-author">By {author}</span>
          <span className="post-card-date">
            {date}
          </span>
        </div>

        <div className="post-card-actions">
          {/* Like count (add Like button later) */}
          <span className="post-card-likes">👍 {likeCount || 0}</span>
          {/* View Post button (optional) */}
          <Link className="post-card-link" to={`/post/${id}`}>
            View Post
          </Link>
        </div>
      </div>
    </div>
  );
}
