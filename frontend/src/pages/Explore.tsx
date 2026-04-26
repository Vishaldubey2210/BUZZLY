import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';
import { connectionService } from '../services/connectionService';
import { Search, UserPlus, Check, X, Loader2, Sparkles } from 'lucide-react';

const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'requests'>('suggestions');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'suggestions') {
        const data = await userService.getSuggestions();
        setSuggestions(data);
      } else {
        const data = await connectionService.getPendingRequests();
        setRequests(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      const data = await userService.searchUsers(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await connectionService.sendRequest(userId);
      // Remove from suggestions optimistically
      setSuggestions(prev => prev.filter(u => u._id !== userId));
      setSearchResults(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      await connectionService.acceptRequest(connectionId);
      setRequests(prev => prev.filter(req => req._id !== connectionId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectRequest = async (connectionId: string) => {
    try {
      await connectionService.rejectRequest(connectionId);
      setRequests(prev => prev.filter(req => req._id !== connectionId));
    } catch (error) {
      console.error(error);
    }
  };

  const UserCard = ({ user, isRequest = false, requestId = '' }: { user: User, isRequest?: boolean, requestId?: string }) => (
    <div className="flex items-center gap-4 bg-[#110a02] p-4 border border-white/5 rounded-xl hover:border-amber-500/20 transition-colors">
      <div className="relative">
        <img src={user.avatar} alt={user.buzzName} className="w-14 h-14 rounded-full border-2 border-[#0a0600]" />
        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#110a02] shadow-sm">
          Lv.{user.level}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white text-sm truncate">{user.buzzName}</h4>
        <p className="text-xs text-gray-400 truncate">@{user.handle}</p>
        <div className="text-[10px] text-amber-500 font-semibold mt-1 flex items-center gap-1">
          <Sparkles size={10} /> {(user.xp || 0).toLocaleString()} XP
        </div>
      </div>

      <div className="flex gap-2">
        {isRequest ? (
          <>
            <button 
              onClick={() => handleAcceptRequest(requestId)}
              className="bg-amber-500 text-black p-2 rounded-full hover:bg-amber-400 transition-colors shadow-amber"
              title="Accept"
            >
              <Check size={16} />
            </button>
            <button 
              onClick={() => handleRejectRequest(requestId)}
              className="bg-white/10 text-gray-300 p-2 rounded-full hover:bg-white/20 transition-colors"
              title="Decline"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <button 
            onClick={() => handleSendRequest(user._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all text-amber-500"
          >
            <UserPlus size={14} /> Add
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0 animate-in fade-in duration-300">
      
      <div className="sticky top-0 z-20 bg-[#0a0600]/80 backdrop-blur-md border-b border-white/5 pb-2 -mx-4 px-4 pt-4">
        <h1 className="text-xl font-bold tracking-tight mb-3">Explore</h1>
        
        {/* Search Bar */}
        <div className="relative mb-2">
          <Search className="absolute left-4 top-3 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search for drinking buddies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#110a02] border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all text-white placeholder-gray-500"
          />
        </div>
      </div>

      {searchQuery.trim().length > 2 ? (
        // Search Results View
        <div className="pt-2">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Search Results</h2>
          {searching ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-amber-500" /></div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.map(user => <UserCard key={user._id} user={user} />)}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">No users found for "{searchQuery}"</div>
          )}
        </div>
      ) : (
        // Standard View
        <div className="pt-2">
          {/* Tabs */}
          <div className="flex bg-[#110a02] rounded-full p-1 border border-white/5 mb-4 inline-flex w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('suggestions')}
              className={`flex-1 md:flex-none px-6 py-1.5 text-sm font-bold rounded-full transition-all ${activeTab === 'suggestions' ? 'bg-white/10 text-amber-500 shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              Suggestions
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`flex-1 md:flex-none px-6 py-1.5 text-sm font-bold rounded-full transition-all ${activeTab === 'requests' ? 'bg-white/10 text-amber-500 shadow-sm' : 'text-gray-400 hover:text-white'} flex items-center justify-center gap-1.5`}
            >
              Pending
              {requests.length > 0 && activeTab !== 'requests' && (
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_theme(colors.amber.500)]"></span>
              )}
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-amber-500" /></div>
          ) : activeTab === 'suggestions' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {suggestions.length > 0 ? (
                 suggestions.map(user => <UserCard key={user._id} user={user} />)
               ) : (
                 <div className="col-span-full text-center p-8 text-gray-500 bg-white/5 rounded-xl border border-white/5">
                   No suggestions available right now.
                 </div>
               )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requests.length > 0 ? (
                requests.map(req => <UserCard key={req._id} user={req.requester} isRequest={true} requestId={req._id} />)
              ) : (
                <div className="col-span-full text-center p-8 text-gray-500 bg-white/5 rounded-xl border border-white/5">
                  No pending connection requests.
                </div>
               )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Explore;
