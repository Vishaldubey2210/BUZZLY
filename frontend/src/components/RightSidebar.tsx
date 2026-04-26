import React, { useState, useEffect } from 'react';
import { Zap, MapPin, Users, Flame, Trophy, Sparkles } from 'lucide-react';
import { User } from '../types';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { connectionService } from '../services/connectionService';

const mockVenues = [
  { id: '1', name: 'The Tipsy Bear', type: 'Cocktail Bar', distance: '0.8 km', special: 'Happy Hour till 8PM', buzzScore: 92, activeUsers: 45, image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=150' },
  { id: '2', name: 'Hops & Barley', type: 'Brewery', distance: '1.2 km', special: 'Live Jazz tonight', buzzScore: 88, activeUsers: 32, image: 'https://images.unsplash.com/photo-1582229192453-27717cb4afc4?auto=format&fit=crop&q=80&w=150' },
];

const RightSidebar: React.FC = () => {
  const { user } = useAuth();
  const [twin, setTwin] = useState<User | null>(null);
  const [leaderTop, setLeaderTop] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;
    userService.getSuggestions().then(users => {
      if (users.length > 0) setTwin(users[0]);
    }).catch(console.error);

    userService.getLeaderboard().then(leaders => {
      setLeaderTop(leaders.slice(0, 5));
    }).catch(console.error);
  }, [user]);

  const handleAddTwin = async () => {
    if (twin) {
      try {
        await connectionService.sendRequest(twin._id);
        setTwin(null);
      } catch (e) { console.error(e); }
    }
  };

  return (
    <aside className="flex flex-col gap-5 pb-20">

      {/* Taste Twin Widget */}
      <div className="bg-[#110a02] border border-[rgba(251,191,36,0.1)] rounded-xl p-4 overflow-hidden relative">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wide mb-3">
          <Zap size={14} className="animate-pulse" /> Taste Twin
        </div>

        {twin ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={twin.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Twin'} alt="Twin" className="w-12 h-12 rounded-full bg-white/5 border border-[rgba(251,191,36,0.3)]" />
              <div className="absolute -bottom-1 -right-1 bg-[#110a02] rounded-full p-0.5">
                <div className="bg-gradient-to-r from-amber-400 to-amber-hot text-[#0a0600] text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  98%
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{twin.buzzName}</div>
              <div className="text-xs text-gray-400 truncate mt-0.5">@{twin.handle}</div>
              <div className="text-[10px] text-amber-500 font-semibold mt-0.5 flex items-center gap-1">
                <Sparkles size={9} /> {(twin.xp || 0).toLocaleString()} XP
              </div>
            </div>
            <button onClick={handleAddTwin} className="bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-black transition-colors rounded-full p-2 border border-amber-400/20">
              <Users size={16} />
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No twins found... Keep tasting!</div>
        )}
      </div>

      {/* Mini Leaderboard Widget */}
      <div className="bg-[#110a02] border border-[rgba(251,191,36,0.1)] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-hot uppercase tracking-wide">
            <Trophy size={14} /> Top Buzzers
          </div>
          <a href="/leaderboard" className="text-xs text-amber-500 hover:text-amber-400 font-medium">See All</a>
        </div>

        <div className="flex flex-col gap-2">
          {leaderTop.length === 0 ? (
            <div className="text-sm text-gray-500">Loading rankings...</div>
          ) : (
            leaderTop.map((u, idx) => (
              <div key={u._id} className="flex items-center gap-2.5">
                <span className={`text-xs font-black w-5 text-center flex-shrink-0
                  ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {idx + 1}
                </span>
                <img src={u.avatar} alt={u.buzzName} className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{u.buzzName}</div>
                </div>
                <div className="text-[10px] text-amber-500 font-bold flex-shrink-0">{u.xp.toLocaleString()} XP</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bar Battle Widget */}
      <div className="bg-[#110a02] border border-[rgba(251,191,36,0.1)] rounded-xl p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-hot uppercase tracking-wide mb-3">
          <Flame size={14} /> Bar Battle: Friday Night
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold">Dive Bars</span>
              <span className="text-amber-400">65% (Mumbai)</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-hot to-red-500" style={{ width: '65%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold">Rooftop Lounges</span>
              <span className="text-purple-400">35%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: '35%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Venues Widget */}
      <div className="bg-[#110a02] border border-[rgba(251,191,36,0.1)] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wide">
            <MapPin size={14} /> Buzzing Near You
          </div>
          <a href="/map" className="text-xs text-amber-500 hover:text-amber-400 font-medium">See Map</a>
        </div>
        <div className="flex flex-col gap-3">
          {mockVenues.map(venue => (
            <div key={venue.id} className="flex gap-3 items-center group cursor-pointer border-b border-white/5 pb-3 last:border-0 last:pb-0">
              <img src={venue.image} className="w-12 h-12 rounded-lg object-cover" alt={venue.name} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm group-hover:text-amber-400 transition-colors truncate">{venue.name}</div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                  <span>{venue.type}</span> • <span>{venue.distance}</span>
                </div>
                <div className="text-[10px] text-amber-500 mt-0.5 truncate flex items-center gap-1">
                  🔥 {venue.special}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
