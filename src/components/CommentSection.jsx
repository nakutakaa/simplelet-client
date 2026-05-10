// src/components/CommentSection.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function CommentSection({ listingId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    loadComments();
  }, [listingId, page]);

  const loadComments = async () => {
    setLoading(true);
    const data = await api.getComments(listingId, page);
    setComments(data.comments || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">
          💬 Comments
          <span className="ml-2 text-sm text-gray-500 font-normal">
            Join the conversation
          </span>
        </h3>
      </div>

      {/* Comment Form */}
      <CommentForm
        listingId={listingId}
        onCommentAdded={loadComments}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />

      {/* Comments List */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-400">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-2">💭</div>
            <p className="text-gray-400">
              No comments yet. Start the conversation!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              listingId={listingId}
              onReply={(commentId) => setReplyTo(commentId)}
              onCommentAdded={loadComments}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-between items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-600 transition"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-600 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// Comment Form Component
function CommentForm({ listingId, onCommentAdded, replyTo, onCancelReply }) {
  const { user, token } = useAuth();
  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    const result = await api.postComment(
      listingId,
      token,
      content,
      replyTo,
      !user ? guestName : null,
    );

    if (result.id) {
      setContent("");
      setGuestName("");
      onCommentAdded();
      if (onCancelReply) onCancelReply();
    }

    setLoading(false);
  };

  return (
    <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
      {replyTo && (
        <div className="mb-3 flex items-center justify-between text-sm text-blue-600">
          <span>Replying to comment...</span>
          <button
            onClick={onCancelReply}
            className="text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {!user && (
          <input
            type="text"
            placeholder="Your name (optional)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        )}

        <div className="flex gap-3">
          <textarea
            placeholder={
              user ? "Write a comment..." : "Write a comment as guest..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "..." : "Post"}
          </button>
        </div>
        <p className="text-xs text-gray-400">
          {!user && "Comments are anonymous. Your email won't be shared."}
          {user && "Posting as " + user.name}
        </p>
      </form>
    </div>
  );
}

// Comment Thread Component
function CommentThread({
  comment,
  listingId,
  onReply,
  onCommentAdded,
  depth = 0,
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesPage, setRepliesPage] = useState(1);
  const [hasMoreReplies, setHasMoreReplies] = useState(false);

  useEffect(() => {
    if (showReplies && comment.replies_count > 0) {
      loadReplies();
    }
  }, [showReplies]);

  const loadReplies = async () => {
    setLoadingReplies(true);
    const data = await api.getReplies(comment.id, repliesPage);
    if (repliesPage === 1) {
      setReplies(data.replies || []);
    } else {
      setReplies((prev) => [...prev, ...(data.replies || [])]);
    }
    setHasMoreReplies(data.page < data.pages);
    setLoadingReplies(false);
  };

  const loadMoreReplies = () => {
    setRepliesPage((p) => p + 1);
  };

  useEffect(() => {
    if (repliesPage > 1) {
      loadReplies();
    }
  }, [repliesPage]);

  return (
    <div className="px-6 py-4 hover:bg-gray-50/50 transition">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
            {comment.author_name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-800 text-sm">
                {comment.author_name}
              </span>
              {comment.is_anonymous && (
                <span className="text-xs text-gray-400">(guest)</span>
              )}
              <span className="text-xs text-gray-400">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-1 ml-2">
            <button
              onClick={() => onReply(comment.id)}
              className="text-xs text-gray-400 hover:text-blue-600 transition"
            >
              Reply
            </button>
            {comment.replies_count > 0 && !showReplies && (
              <button
                onClick={() => setShowReplies(true)}
                className="text-xs text-gray-400 hover:text-blue-600 transition"
              >
                View {comment.replies_count} repl
                {comment.replies_count === 1 ? "y" : "ies"} →
              </button>
            )}
            {showReplies && (
              <button
                onClick={() => setShowReplies(false)}
                className="text-xs text-gray-400 hover:text-blue-600 transition"
              >
                Hide replies
              </button>
            )}
          </div>

          {/* Replies */}
          {showReplies && (
            <div className="mt-3 pl-0 md:pl-6 border-l-2 border-gray-100">
              {replies.map((reply) => (
                <CommentThread
                  key={reply.id}
                  comment={reply}
                  listingId={listingId}
                  onReply={onReply}
                  onCommentAdded={onCommentAdded}
                  depth={depth + 1}
                />
              ))}

              {loadingReplies && (
                <div className="text-center py-2 text-sm text-gray-400">
                  Loading...
                </div>
              )}

              {hasMoreReplies && !loadingReplies && (
                <button
                  onClick={loadMoreReplies}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2 ml-2"
                >
                  Load more replies ↓
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
