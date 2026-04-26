import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { Loader2, Image as ImageIcon, Send, Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Buzz', icon: '🌍' },
  { id: 'beer', label: 'Craft Beer', icon: '🍺' },
  { id: 'wine', label: 'Wine', icon: '🍷' },
  { id: 'cocktail', label: 'Cocktails', icon: '🍸' },
  { id: 'spirit', label: 'Spirits', icon: '🥃' },
];

const Feed: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Post creation state
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loader = useRef(null);

  const fetchPosts = async (pageNum: number, isReset = false) => {
    try {
      const data = await postService.getFeed(pageNum);
      if (isReset) {
        setPosts(data.data);
      } else {
        setPosts(prev => [...prev, ...data.data]);
      }
      setHasMore(data.meta.hasNextPage);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  const handleObserver = (entities: any[]) => {
    const target = entities[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage(prev => prev + 1);
      fetchPosts(page + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newPost = await postService.createPost({
        content: newPostContent,
        drinkCategory: activeCategory !== 'all' ? activeCategory : undefined
      });
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    } catch (error) {
      console.error('Error creating post', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* Page Header (Mobile mostly) */}
      <div className="sticky top-0 z-20 bg-[#0a0600]/80 backdrop-blur-md border-b border-white/5 pb-2 -mx-4 px-4 pt-4 md:hidden">
        <h1 className="text-xl font-bold font-sans tracking-tight">Buzz Feed</h1>
      </div>

      {/* Post Creator */}
      {user && (
        <div className="bg-[#110a02] border border-[rgba(251,191,36,0.2)] rounded-xl p-4 shadow-amber">
          <div className="flex gap-3">
            <img src={user.avatar} className="w-10 h-10 rounded-full border border-white/10" alt="You" />
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's your vibe right now?"
                className="w-full bg-transparent border-none focus:ring-0 resize-none text-white placeholder-gray-500 text-[15px] h-12 outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-amber-400 transition-colors p-1.5 rounded-full hover:bg-white/5">
                <ImageIcon size={18} />
              </button>
              <button className="text-gray-400 hover:text-amber-400 transition-colors p-1.5 rounded-full hover:bg-white/5">
                <Sparkles size={18} />
              </button>
            </div>
            
            <button 
              onClick={handleCreatePost}
              disabled={!newPostContent.trim() || isSubmitting}
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded-full font-bold text-sm tracking-wide disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
              Share
            </button>
          </div>
        </div>
      )}

      {/* Categories Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${activeCategory === cat.id 
                ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-4">
        {loading && posts.length === 0 ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin text-amber-500" size={32} />
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        )}
        
        {/* Infinite Scroll trigger */}
        <div ref={loader} className="p-4 flex justify-center text-gray-500">
          {loading && posts.length > 0 && <Loader2 className="animate-spin text-amber-500" size={24} />}
          {!hasMore && posts.length > 0 && <p className="text-sm">You've reached the bottom of the glass! 🍻</p>}
        </div>
      </div>
      
    </div>
  );
};

export default Feed;
