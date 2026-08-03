import { useState, useEffect } from 'react';
import { 
  Star, ClipboardList, MessageSquareReply, Trash2, 
  CheckCircle2, Circle, Send, X, MapPin
} from 'lucide-react';
import { fetchAllReviews, adminReplyToReview, deleteReview, type Review } from '../../../api/reviewApi';

export default function Feedback() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await fetchAllReviews();
      setReviews(data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: number) => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    try {
      const updated = await adminReplyToReview(reviewId, replyText.trim());
      setReviews(prev => prev.map(r => r.id === reviewId ? updated : r));
      setReplyingTo(null);
      setReplyText('');
    } catch {
      alert('Failed to send reply.');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch {
      alert('Failed to delete review.');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "text-amber-500 fill-amber-500" : "text-slate-300"} 
      />
    ));
  };

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  const avatarInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Filter logic
  const filtered = reviews.filter(r => {
    if (filter === 'Pending') return !r.adminReply;
    if (filter === 'Replied') return !!r.adminReply;
    return true;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const pendingCount = reviews.filter(r => !r.adminReply).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-1">Community Insights</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Review Feedback</h2>
          <p className="text-slate-500 text-sm max-w-2xl">
            View and respond to trail reviews from travelers. Reply to engage with your community.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[160px]">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Star size={20} className="text-amber-500 fill-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Avg. Rating</p>
              <p className="text-xl font-bold text-slate-800">{avgRating}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[160px]">
            <div className="p-2 bg-slate-50 rounded-lg">
              <ClipboardList size={20} className="text-slate-800" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Pending</p>
              <p className="text-xl font-bold text-slate-800">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        {['All', 'Pending', 'Replied'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${
              filter === f 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {f} {f === 'All' ? `(${reviews.length})` : f === 'Pending' ? `(${pendingCount})` : `(${reviews.length - pendingCount})`}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <MessageSquareReply size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-1">No reviews found</h3>
          <p className="text-slate-400 text-sm">
            {filter !== 'All' ? 'Try changing the filter.' : 'Reviews from travelers will appear here.'}
          </p>
        </div>
      )}

      {/* Review Cards */}
      <div className="space-y-4">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5">
              {/* Top row: user + trail + rating */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">{avatarInitials(review.user.username)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{review.user.username}</h3>
                    <p className="text-xs text-slate-500">{review.user.email} • {formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    review.adminReply 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {review.adminReply ? 'Replied' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Trail badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium mb-3">
                <MapPin size={12} className="text-emerald-500" />
                {review.trip.title}
                {review.trip.province && <span className="text-slate-400">• {review.trip.province}</span>}
              </div>

              {/* Comment */}
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                "{review.comment}"
              </p>

              {/* Existing admin reply */}
              {review.adminReply && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-600 uppercase">Your Reply</span>
                    {review.adminRepliedAt && (
                      <span className="text-xs text-slate-400 ml-auto">{formatDate(review.adminRepliedAt)}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 pl-5">{review.adminReply}</p>
                </div>
              )}

              {/* Reply form */}
              {replyingTo === review.id && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-3">
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write your reply to this review…"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 resize-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(''); }}
                      className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={replyLoading || !replyText.trim()}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                    >
                      <Send size={12} />
                      {replyLoading ? 'Sending…' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex gap-2">
                  {!review.adminReply && replyingTo !== review.id && (
                    <button
                      onClick={() => { setReplyingTo(review.id); setReplyText(''); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <MessageSquareReply size={14} />
                      Reply
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  {review.adminReply 
                    ? <CheckCircle2 size={14} className="text-emerald-500" />
                    : <Circle size={14} className="text-slate-300" />
                  }
                  <span className={`text-xs font-medium ${review.adminReply ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {review.adminReply ? 'Resolved' : 'Awaiting Reply'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
