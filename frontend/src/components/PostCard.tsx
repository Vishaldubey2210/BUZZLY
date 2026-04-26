import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Repeat2, Loader2, Send, Edit2, Trash2, Flag, AlertTriangle, X } from 'lucide-react';
import { formatTimeAgo, formatCount } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { useToast } from '../context/ToastContext';

interface PostCardProps {
  post: Post;
  onLikeToggle?: (postId: string, liked: boolean) => void;
  compact?: boolean;
}

const getCategoryColor = (cat = 'other') => {
  const colors: Record<string, string> = {
    beer: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    wine: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    spirit: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    cocktail: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    na: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  return colors[cat] || 'bg-white/10 text-gray-400 border-white/10';
};

const PostCard: React.FC<PostCardProps> = ({ post, onLikeToggle, compact = false }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!post || !post.author) return null;

  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id || ''));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReposting, setIsReposting] = useState(false);
  const [showRepostBox, setShowRepostBox] = useState(false);
  const [repostComment, setRepostComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  // Advanced post features
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(post.content);

  const isOwner = user?._id === post.author._id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      await postService.deletePost(post._id);
      showToast('Post deleted', 'success');
      setIsDeleted(true);
    } catch {
      showToast('Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    setIsEditing(true);
    try {
      await postService.updatePost(post._id, { content: editContent });
      setLocalContent(editContent);
      showToast('Post updated', 'success');
      setShowEditModal(false);
    } catch {
      showToast('Failed to update post', 'error');
    } finally {
      setIsEditing(false);
    }
  };

  const handleReport = async () => {
    const reason = window.prompt('Why are you reporting this post?');
    if (!reason) return;
    try {
      await postService.reportPost(post._id, reason);
      showToast('Post reported. Thank you.', 'info');
    } catch {
      showToast('Failed to report post', 'error');
    } finally {
      setShowMenu(false);
    }
  };

  if (isDeleted) return null;

  const handleLike = async () => {
    if (!user || isLiking) return;
    setIsLiking(true);
    const nowLiked = !isLiked;
    setIsLiked(nowLiked);
    setLikesCount(prev => nowLiked ? prev + 1 : prev - 1);
    onLikeToggle?.(post._id, nowLiked);
    try {
      if (nowLiked) await postService.likePost(post._id);
      else await postService.unlikePost(post._id);
    } catch {
      setIsLiked(!nowLiked);
      setLikesCount(prev => nowLiked ? prev - 1 : prev + 1);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    try {
      const result = await postService.savePost(post._id);
      setIsSaved(result.saved);
      showToast(result.saved ? 'Post saved! 🔖' : 'Removed from saved', result.saved ? 'success' : 'info');
    } catch { showToast('Could not save post', 'error'); }
    finally { setIsSaving(false); }
  };

  const handleRepost = async () => {
    if (!user || isReposting) return;
    setIsReposting(true);
    try {
      await postService.repost(post._id, repostComment || undefined);
      showToast('Reposted! +20 XP 🔄', 'success');
      setShowRepostBox(false);
      setRepostComment('');
    } catch { showToast('Could not repost', 'error'); }
    finally { setIsReposting(false); }
  };

  const toggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try { const data = await postService.getComments(post._id); setComments(data.data); }
      catch {} finally { setLoadingComments(false); }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;
    setIsSubmittingComment(true);
    try {
      const added = await postService.createComment(post._id, newComment);
      setComments([added, ...comments]);
      setNewComment('');
      setCommentCount(prev => prev + 1);
    } catch {} finally { setIsSubmittingComment(false); }
  };

  const goToAuthorProfile = () => {
    if (user && user._id === post.author._id) navigate('/profile');
    else navigate(`/profile/${post.author._id}`);
  };

  return (
    <article className="bg-[#110a02] border border-white/5 rounded-xl overflow-hidden transition-all hover:border-white/10 duration-200">
      {/* Repost indicator */}
      {post.repostOf && (
        <div className="flex items-center gap-2 px-4 pt-3 text-xs text-gray-500">
          <Repeat2 size={13} className="text-green-400" />
          <span className="text-green-400 font-semibold">{post.author.buzzName} reposted</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 pb-2 flex justify-between items-start">
        <div className="flex gap-3 min-w-0">
          <div className="relative flex-shrink-0 cursor-pointer" onClick={goToAuthorProfile}>
            <img src={post.author.avatar} alt={post.author.buzzName} className="w-10 h-10 rounded-full border border-white/10 hover:ring-2 hover:ring-amber-500/50 transition-all" />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[9px] font-black px-1 rounded border border-[#110a02]">
              L{post.author.level}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={goToAuthorProfile}>
              <span className="font-bold text-sm hover:text-amber-400 transition-colors">{post.author.buzzName}</span>
            </div>
            <div className="text-xs text-gray-400">
              @{post.author.handle} · {formatTimeAgo(post.createdAt)}
            </div>
            {post.author.headline && !compact && (
              <div className="text-xs text-gray-500 truncate mt-0.5">{post.author.headline}</div>
            )}
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="text-gray-600 hover:text-gray-300 p-1.5 rounded-full transition-colors flex-shrink-0">
            <MoreHorizontal size={16} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-[#1a1105] border border-white/10 rounded-xl shadow-2xl py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
              {isOwner ? (
                <>
                  <button onClick={() => { setShowMenu(false); setShowEditModal(true); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2">
                    <Edit2 size={14} /> Edit Post
                  </button>
                  <button onClick={handleDelete} disabled={isDeleting} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors disabled:opacity-50">
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete Post
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleSave} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2">
                    <Bookmark size={14} /> {isSaved ? 'Remove from saved' : 'Save post'}
                  </button>
                  <button onClick={handleReport} className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-orange-500/10 flex items-center gap-2">
                    <Flag size={14} /> Report Post
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reposted original post preview */}
      {post.repostOf && typeof post.repostOf === 'object' && (
        <div className="mx-4 mb-2 border border-white/10 rounded-xl p-3 bg-white/3">
          <div className="flex items-center gap-2 mb-1.5">
            <img src={(post.repostOf as Post).author?.avatar} className="w-6 h-6 rounded-full" alt="" />
            <span className="text-xs font-bold">{(post.repostOf as Post).author?.buzzName}</span>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2">{(post.repostOf as Post).content}</p>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-3">
        {(post.drinkCategory && post.drinkCategory !== 'other') || post.vibeTag ? (
          <div className="flex gap-2 mb-2">
            {post.drinkCategory && post.drinkCategory !== 'other' && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-px rounded-full border ${getCategoryColor(post.drinkCategory)}`}>
                {post.drinkCategory}
              </span>
            )}
            {post.vibeTag && (
              <span className="text-[10px] font-medium px-2 py-px rounded-full border border-white/10 bg-white/5 text-gray-400">
                {post.vibeTag}
              </span>
            )}
          </div>
        ) : null}

        <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap text-gray-100">
          {localContent}
        </p>

        {post.image && (
          <div className="mt-3 rounded-xl overflow-hidden border border-white/5">
            <img src={post.image} alt="" className="w-full object-cover max-h-96" loading="lazy" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-5 text-sm text-gray-400">
        <button onClick={handleLike} disabled={isLiking}
          className={`flex items-center gap-1.5 font-medium transition-colors group ${isLiked ? 'text-amber-500' : 'hover:text-amber-500'}`}>
          <Heart size={17} className={`transition-transform group-hover:scale-110 ${isLiked ? 'fill-amber-500' : ''}`} />
          <span>{formatCount(likesCount)}</span>
        </button>

        <button onClick={toggleComments} className="flex items-center gap-1.5 font-medium hover:text-sky-400 transition-colors group">
          <MessageCircle size={17} className="transition-transform group-hover:scale-110" />
          <span>{formatCount(commentCount)}</span>
        </button>

        <button onClick={() => setShowRepostBox(!showRepostBox)}
          className={`flex items-center gap-1.5 font-medium transition-colors group ${showRepostBox ? 'text-green-400' : 'hover:text-green-400'}`}>
          <Repeat2 size={17} className="transition-transform group-hover:scale-110" />
          <span className="hidden sm:inline text-xs">Repost</span>
        </button>

        <button onClick={handleSave} disabled={isSaving}
          className={`flex items-center gap-1.5 font-medium transition-colors group ml-auto ${isSaved ? 'text-amber-400' : 'hover:text-amber-400'}`}>
          {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Bookmark size={16} className={`transition-transform group-hover:scale-110 ${isSaved ? 'fill-amber-400' : ''}`} />}
        </button>
      </div>

      {/* Repost Box */}
      {showRepostBox && (
        <div className="border-t border-white/5 px-4 py-3 bg-[#0a0600] animate-in slide-in-from-top-2 duration-200">
          <div className="flex gap-2">
            <img src={user?.avatar} className="w-7 h-7 rounded-full flex-shrink-0" alt="" />
            <input type="text" value={repostComment} onChange={e => setRepostComment(e.target.value)}
              placeholder="Add a comment (optional)..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
            />
            <button onClick={handleRepost} disabled={isReposting}
              className="bg-green-500 hover:bg-green-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 disabled:opacity-60 transition-colors">
              {isReposting ? <Loader2 size={12} className="animate-spin" /> : <Repeat2 size={12} />} Go
            </button>
          </div>
        </div>
      )}

      {/* Comments */}
      {showComments && (
        <div className="border-t border-white/5 bg-[#0a0600] p-4 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleAddComment} className="flex gap-2 mb-3">
            <img src={user?.avatar} className="w-8 h-8 rounded-full flex-shrink-0" alt="" />
            <div className="flex-1 flex gap-2">
              <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-[#110a02] border border-white/10 rounded-full pl-4 pr-3 py-1.5 text-sm focus:outline-none focus:border-amber-500/50 text-white placeholder-gray-500"
              />
              <button type="submit" disabled={!newComment.trim() || isSubmittingComment}
                className="bg-amber-500 hover:bg-amber-400 text-black p-2 rounded-full disabled:opacity-50 transition-colors">
                {isSubmittingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </form>
          <div className="flex flex-col gap-3">
            {loadingComments ? (
              <div className="text-xs text-gray-500 text-center py-2">Loading...</div>
            ) : comments.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-2">No comments yet. Be the first! 💬</div>
            ) : (
              comments.map(c => (
                <div key={c._id} className="flex gap-2">
                  <img src={c.author.avatar} className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5" alt="" />
                  <div>
                    <div className="bg-[#110a02] border border-white/5 rounded-2xl rounded-tl-sm px-3 py-2 inline-block">
                      <div className="text-xs font-bold text-white">{c.author.buzzName}</div>
                      <div className="text-sm text-gray-300 mt-0.5">{c.content}</div>
                    </div>
                    <div className="text-[10px] text-gray-500 ml-2 mt-0.5">{formatTimeAgo(c.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#110a02] border border-amber-500/20 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-bold text-lg text-white">Edit Post</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-4">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 resize-none"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleEdit} disabled={isEditing || !editContent.trim()} className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isEditing ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;
