import React, { useState } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, UserPlus } from 'lucide-react';
import { formatTimeAgo, formatCount } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';

interface PostCardProps {
  post: Post;
  onPostUpdated?: (updatedPost: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  
  // Local state for optimistic UI updates
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id || ''));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isLiking, setIsLiking] = useState(false);

  const getCategoryColor = (cat = 'beer') => {
    const colors: Record<string, string> = {
      beer: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      wine: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      spirit: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      cocktail: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      na: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[cat] || colors.beer;
  };

  const handleLike = async () => {
    if (!user || isLiking) return;
    
    setIsLiking(true);
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      if (isLiked) {
        await postService.unlikePost(post._id);
      } else {
        await postService.likePost(post._id);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(post.likes.length);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="bg-[#110a02] border border-white/5 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-0.5 duration-300 relative group">
      
      {/* Header */}
      <div className="p-4 pb-2 flex justify-between items-start">
        <div className="flex gap-3">
          <div className="relative">
            <img src={post.author.avatar} alt={post.author.buzzName} className="w-10 h-10 rounded-full border border-white/10" />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[9px] font-bold px-1 rounded-sm border border-[#110a02]">
              L{post.author.level}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 hover:underline cursor-pointer">
              <span className="font-bold text-sm tracking-tight">{post.author.buzzName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>@{post.author.handle}</span>
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {user && user._id !== post.author._id && (
            <button className="text-amber-400 hover:bg-amber-400/10 p-1.5 rounded-full transition-colors hidden sm:block">
              <UserPlus size={16} />
            </button>
          )}
          <button className="text-gray-500 hover:text-white p-1.5 rounded-full transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-1">
        
        {/* Drink Tag */}
        {(post.drinkCategory || post.vibeTag) && (
          <div className="flex gap-2 mb-3">
            {post.drinkCategory && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-[2px] rounded-full border ${getCategoryColor(post.drinkCategory)}`}>
                {post.drinkCategory}
              </span>
            )}
            {post.vibeTag && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-[2px] rounded-full border border-white/10 bg-white/5 text-gray-300">
                {post.vibeTag}
              </span>
            )}
          </div>
        )}

        <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Image Attachment */}
        {post.image && (
          <div className="mt-3 rounded-lg overflow-hidden border border-white/5">
            <img src={post.image} alt="Post content" className="w-full object-cover max-h-[400px]" loading="lazy" />
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-gray-400 text-sm">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 font-medium transition-colors ${isLiked ? 'text-amber-500' : 'hover:text-amber-500'}`}
        >
          <Heart size={18} className={isLiked ? "fill-amber-500" : ""} />
          <span>{formatCount(likesCount)}</span>
        </button>
        
        <button className="flex items-center gap-1.5 font-medium hover:text-blue-400 transition-colors">
          <MessageCircle size={18} />
          <span>{formatCount(post.commentCount)}</span>
        </button>
        
        <button className="flex items-center gap-1.5 font-medium hover:text-green-400 transition-colors">
          <Share2 size={18} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </article>
  );
};

export default PostCard;
