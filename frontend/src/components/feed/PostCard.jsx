import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal, Heart, Smile, BadgeCheck, Send, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostContext';
import Avatar from '../ui/Avatar';
import { formatNumber, formatTimeAgo } from '../../utils/helpers';

const reactions = ['👍', '❤️', '🎉', '🔥', '💡', '🚀'];

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { likePost, savePost } = usePosts();
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [localComments, setLocalComments] = useState([]);
  const [reaction, setReaction] = useState(null);

  // Map backend fields to frontend expected format
  const author = post.author || post.user || { name: 'Unknown User' };
  const timeDisplay = post.timeAgo || formatTimeAgo(post.createdAt || post.updatedAt);
  const likesCount = Array.isArray(post.likes) ? post.likes.length : (post.likes || 0);
  const commentsCount = Array.isArray(post.comments) ? post.comments.length : (post.comments || 0);
  const isGuest = user?.role === 'guest';

  const handleReact = (r) => {
    if (isGuest) {
      alert('Sign up to like posts!');
      return;
    }
    setReaction(reaction === r ? null : r);
    setShowReactions(false);
    if (!post.isLiked) likePost(post._id || post.id);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (isGuest) {
      alert('Sign up to comment!');
      return;
    }
    if (!comment.trim()) return;
    setLocalComments([...localComments, { id: Date.now(), text: comment, author: user?.name, timeAgo: 'now' }]);
    setComment('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar name={author.name} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold text-dark-900 dark:text-dark-100 hover:text-brand-500 cursor-pointer transition-colors">
                  {author.name}
                </h4>
                {author.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-brand-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-dark-400">{author.title || author.company}</p>
              <p className="text-xs text-dark-300">{timeDisplay}</p>
            </div>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-dark-400">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-3 text-sm text-dark-700 dark:text-dark-200 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-brand-500 dark:text-brand-400 hover:text-brand-600 cursor-pointer">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Post Image */}
      {post.image && typeof post.image === 'string' && post.image.trim() !== '' && (
        <div className="relative border-y border-dark-100 dark:border-dark-700/50 bg-dark-50 dark:bg-dark-900/40 overflow-hidden">
          <img
            src={post.image}
            alt="Post attachment"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full max-h-[550px] object-contain mx-auto cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => setImageModalOpen(true)}
          />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 border-t border-dark-100 dark:border-dark-700/50 flex items-center justify-between text-xs text-dark-400">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-0.5">
            {['👍', '❤️', '🔥'].map((r, i) => (
              <span key={i} className="text-xs">{r}</span>
            ))}
          </div>
          <span>{formatNumber(likesCount)}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowComments(!showComments)}>
            {formatNumber(commentsCount + localComments.length)} comments
          </button>
          <span>{formatNumber(post.shares || 0)} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-1 border-t border-dark-100 dark:border-dark-700/50 flex items-center gap-1">
        {/* Like with reactions */}
        <div className="relative flex-1">
          <motion.button
            whileTap={!isGuest ? { scale: 0.9 } : {}}
            onMouseEnter={() => !isGuest && setShowReactions(true)}
            onMouseLeave={() => !isGuest && setTimeout(() => setShowReactions(false), 300)}
            onClick={() => {
              if (isGuest) return alert('Sign up to like posts!');
              likePost(post._id || post.id);
            }}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              post.isLiked 
                ? 'text-brand-500 bg-brand-50 dark:bg-brand-900/20' 
                : 'text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700'
            } ${isGuest ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            {reaction ? <span className="text-base">{reaction}</span> : <ThumbsUp className="w-4 h-4" />}
            <span>Like</span>
          </motion.button>

          {/* Reaction picker */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                className="absolute bottom-full left-0 mb-2 flex items-center gap-1 p-2 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-2xl shadow-dark z-10"
              >
                {reactions.map(r => (
                  <button
                    key={r}
                    onClick={() => handleReact(r)}
                    className="text-xl hovex:scale-125 transition-transform hover:scale-125 p-1"
                  >
                    {r}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>

        <button
          onClick={() => {
            if (isGuest) return alert('Sign up to save posts!');
            savePost(post._id || post.id);
          }}
          className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
            post.isSaved ? 'text-brand-500' : 'text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700'
          } ${isGuest ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-dark-100 dark:border-dark-700/50 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {localComments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <Avatar name={c.author} size="xs" />
                  <div className="flex-1 bg-dark-50 dark:bg-dark-700 rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-dark-800 dark:text-dark-200">{c.author}</p>
                    <p className="text-sm text-dark-600 dark:text-dark-300">{c.text}</p>
                  </div>
                </div>
              ))}
              <form onSubmit={handleComment} className="flex gap-2">
                <Avatar name="Alex Rivera" size="xs" />
                <div className="flex-1 flex items-center gap-2 bg-dark-50 dark:bg-dark-700 rounded-xl px-3 py-2">
                  <input
                    type="text"
                    value={comment}
                    disabled={isGuest}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={isGuest ? "Sign up to comment..." : "Write a comment..."}
                    className="flex-1 bg-transparent text-sm text-dark-800 dark:text-dark-200 placeholder-dark-400 focus:outline-none disabled:opacity-50"
                  />
                  <button type="submit" disabled={isGuest} className="text-brand-500 hover:text-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {imageModalOpen && post.image && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setImageModalOpen(false)}
          >
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-white/80 hover:text-white rounded-full bg-black/50 hover:bg-black/80 transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={post.image}
              alt="Post image full view"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
