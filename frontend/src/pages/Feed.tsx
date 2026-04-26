import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PostSkeleton } from '../components/Skeleton';
import { Loader2, Image as ImageIcon, Send, Sparkles, TrendingUp, Clock, Users2 } from 'lucide-react';

const DRINK_CATS = [
  { id: 'all', label: 'All Buzz', icon: '🌍' },
  { id: 'beer', label: 'Beer', icon: '🍺' },
  { id: 'wine', label: 'Wine', icon: '🍷' },
  { id: 'cocktail', label: 'Cocktails', icon: '🍸' },
  { id: 'spirit', label: 'Spirits', icon: '🥃' },
  { id: 'na', label: 'Non-Alc', icon: '🌿' },
];

const FEED_TYPES = [
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'following', label: 'Following', icon: Users2 },
];

const VIBE_TAGS = ['Lit 🔥', 'Chill 😌', 'Classy 🥂', 'Wild 🎉', 'Cozy 🕯️', 'Rooftop 🌙'];

const Feed: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [feedType, setFeedType] = useState('recent');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const loader = useRef<HTMLDivElement>(null);

  const fetchPosts = async (pageNum: number, cat: string, type: string, reset = false) => {
    if (reset) setLoading(true); else setIsFetchingMore(true);
    try {
      const data = await postService.getFeed(pageNum, 10, cat, type);
      if (reset) setPosts(data.data); else setPosts(prev => [...prev, ...data.data]);
      setHasMore(data.meta.hasNextPage);
    } catch { showToast('Failed to load feed', 'error'); }
    finally { setLoading(false); setIsFetchingMore(false); }
  };

  useEffect(() => { setPage(1); fetchPosts(1, activeCategory, feedType, true); }, [activeCategory, feedType]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && !isFetchingMore) {
        const next = page + 1; setPage(next); fetchPosts(next, activeCategory, feedType);
      }
    }, { threshold: 0.5 });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore, loading, isFetchingMore, page, activeCategory, feedType]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsSubmitting(true);
    try {
      const post = await postService.createPost({
        content: newPostContent,
        vibeTag: selectedVibe.replace(/\s[\S]+$/, ''),
        drinkCategory: activeCategory !== 'all' ? activeCategory : 'other',
      });
      setPosts(prev => [post, ...prev]);
      setNewPostContent(''); setSelectedVibe(''); setIsExpanded(false);
      showToast('Posted! +50 XP 🍻', 'success');
    } catch { showToast('Failed to post', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const handleLikeToggle = (postId: string, liked: boolean) => {
    setPosts(prev => prev.map(p => p._id === postId ? {
      ...p, likes: liked
        ? [...p.likes, user!._id]
        : p.likes.filter(id => id !== user!._id)
    } : p));
  };

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      {/* Mobile header */}
      <div className="sticky top-0 z-20 bg-[#0a0600]/80 backdrop-blur-md -mx-4 px-4 pt-4 pb-2 border-b border-white/5 md:hidden">
        <h1 className="text-xl font-bold">Buzz Feed</h1>
      </div>

      {/* Post Creator */}
      {user && (
        <div className="bg-[#110a02] border border-[rgba(251,191,36,0.15)] rounded-xl p-4 shadow-[0_4px_20px_rgba(251,191,36,0.06)]">
          <div className="flex gap-3">
            <img src={user.avatar} className="w-10 h-10 rounded-full border border-white/10 flex-shrink-0" alt="" />
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={e => { setNewPostContent(e.target.value); if (e.target.value) setIsExpanded(true); }}
                onFocus={() => setIsExpanded(true)}
                placeholder="What's your vibe? Share a drink moment... (Ctrl+Enter)"
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleCreatePost(); }}
                className="w-full bg-transparent border-none focus:ring-0 resize-none text-white placeholder-gray-500 text-sm outline-none"
                rows={isExpanded ? 3 : 1}
              />
            </div>
          </div>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
              {/* Vibe tags */}
              <div className="flex gap-1.5 flex-wrap mb-3">
                {VIBE_TAGS.map(v => (
                  <button key={v} onClick={() => setSelectedVibe(v === selectedVibe ? '' : v)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all
                      ${selectedVibe === v ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-amber-500/30'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-amber-400 transition-colors p-1.5 rounded-full hover:bg-white/5">
                <ImageIcon size={17} />
              </button>
              <button className="text-gray-400 hover:text-amber-400 transition-colors p-1.5 rounded-full hover:bg-white/5">
                <Sparkles size={17} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {newPostContent.length > 0 && (
                <span className={`text-xs ${newPostContent.length > 900 ? 'text-red-400' : 'text-gray-500'}`}>{newPostContent.length}/1000</span>
              )}
              <button onClick={handleCreatePost} disabled={!newPostContent.trim() || isSubmitting}
                className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 transition-colors flex items-center gap-1.5">
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />} Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feed Type Tabs */}
      <div className="flex bg-[#110a02] border border-white/5 rounded-xl p-1 gap-1">
        {FEED_TYPES.map(ft => (
          <button key={ft.id} onClick={() => setFeedType(ft.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all
              ${feedType === ft.id ? 'bg-amber-500 text-black shadow-[0_2px_8px_rgba(251,191,36,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <ft.icon size={13} />{ft.label}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {DRINK_CATS.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex-shrink-0
              ${activeCategory === cat.id ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(251,191,36,0.25)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}>
            <span>{cat.icon}</span>{cat.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
          : posts.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-[#110a02] rounded-xl border border-white/5">
                <div className="text-5xl mb-4">{feedType === 'following' ? '🤝' : '🍺'}</div>
                <h3 className="text-base font-bold text-white mb-2">
                  {feedType === 'following' ? 'Your circle is quiet' : 'Nothing here yet'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {feedType === 'following' ? 'Follow people or connect to see their posts' : 'Be the first to share a buzz moment!'}
                </p>
                {feedType !== 'recent' && (
                  <button onClick={() => setFeedType('recent')} className="mt-4 text-amber-500 text-sm font-semibold hover:underline">
                    View All Posts
                  </button>
                )}
              </div>
            )
            : posts.map(post => (
              <PostCard key={post._id} post={post} onLikeToggle={handleLikeToggle} />
            ))
        }
        <div ref={loader} className="flex justify-center py-4">
          {isFetchingMore && <Loader2 className="animate-spin text-amber-500" size={22} />}
          {!hasMore && posts.length > 0 && <p className="text-xs text-gray-600">You've reached the end 🍻</p>}
        </div>
      </div>
    </div>
  );
};

export default Feed;
