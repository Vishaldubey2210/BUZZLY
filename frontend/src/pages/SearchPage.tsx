import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, User, FileText, Loader2, MapPin, Sparkles } from 'lucide-react';
import { searchService } from '../services/searchService';
import { useToast } from '../context/ToastContext';
import { PostSkeleton, UserCardSkeleton } from '../components/Skeleton';
import PostCard from '../components/PostCard';
import { Post, User as IUser } from '../types';

const TABS = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'users', label: 'People', icon: User },
  { id: 'posts', label: 'Posts', icon: FileText },
];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'all');
  const [results, setResults] = useState<{ users: IUser[]; posts: Post[]; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const doSearch = async (q: string, type: string) => {
    if (!q.trim()) { setResults(null); return; }
    setLoading(true);
    try {
      const data = await searchService.search(q, type);
      setResults(data);
    } catch {
      showToast('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchParams({ q: query, type: activeTab });
      doSearch(query, activeTab);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, activeTab]);

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0 animate-in fade-in duration-300">
      {/* Search Bar */}
      <div className="sticky top-0 z-20 bg-[#0a0600]/95 backdrop-blur-md -mx-4 px-4 pt-4 pb-3 border-b border-white/5">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search people, posts, #hashtags..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          {loading && <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 animate-spin" />}
        </div>
        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all
                ${activeTab === tab.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
            >
              <tab.icon size={12} />{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty / No query */}
      {!query.trim() && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-400 font-medium">Search for people or posts</p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['#CraftBeer', '#MumbaiNights', '#WhiskeyWednesday', 'Dev Malhotra', 'Cocktails'].map(s => (
              <button key={s} onClick={() => setQuery(s)} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 hover:text-amber-400 hover:border-amber-500/30 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {query.trim() && !loading && results && (
        <div className="flex flex-col gap-6">
          {/* Users */}
          {results.users.length > 0 && (activeTab === 'all' || activeTab === 'users') && (
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={14} /> People
              </h2>
              <div className="flex flex-col gap-2">
                {results.users.map(u => (
                  <div
                    key={u._id}
                    onClick={() => navigate(`/profile/${u._id}`)}
                    className="flex items-center gap-4 p-4 bg-[#110a02] border border-white/5 rounded-xl hover:border-amber-500/20 cursor-pointer transition-all group"
                  >
                    <img src={u.avatar} alt={u.buzzName} className="w-14 h-14 rounded-full border border-white/10 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-amber-400 transition-colors">{u.buzzName}</div>
                      <div className="text-sm text-gray-400">@{u.handle}</div>
                      {u.headline && <div className="text-xs text-gray-500 mt-0.5 truncate">{u.headline}</div>}
                      {u.city && <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={10} />{u.city}</div>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full mb-1">Lv.{u.level}</div>
                      <div className="text-xs text-amber-500 flex items-center gap-1"><Sparkles size={10} />{u.xp.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {results.posts.length > 0 && (activeTab === 'all' || activeTab === 'posts') && (
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText size={14} /> Posts
              </h2>
              <div className="flex flex-col gap-4">
                {results.posts.map(p => <PostCard key={p._id} post={p} />)}
              </div>
            </div>
          )}

          {/* No results */}
          {results.users.length === 0 && results.posts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🍺</div>
              <p className="text-gray-400 font-medium">No results for "{query}"</p>
              <p className="text-gray-600 text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && query.trim() && (
        <div className="flex flex-col gap-4">
          {activeTab !== 'posts' && [1,2,3].map(i => <UserCardSkeleton key={i} />)}
          {activeTab !== 'users' && [1,2].map(i => <PostSkeleton key={i} />)}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
