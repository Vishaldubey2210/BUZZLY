import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';
import { Sparkles, Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { LeaderboardRowSkeleton } from '../components/Skeleton';

const rankConfig = [
  { icon: <Crown size={20} className="text-yellow-400" />, bg: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30', badge: 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black' },
  { icon: <Medal size={20} className="text-slate-300" />, bg: 'from-slate-400/20 to-slate-500/10 border-slate-400/30', badge: 'bg-gradient-to-br from-slate-300 to-slate-400 text-black' },
  { icon: <Medal size={20} className="text-amber-700" />, bg: 'from-amber-700/20 to-amber-800/10 border-amber-700/30', badge: 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' },
];

const Leaderboard: React.FC = () => {
  const [leaders, setLeaders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getLeaderboard()
      .then(data => setLeaders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0600]/80 backdrop-blur-md border-b border-white/5 pb-3 -mx-4 px-4 pt-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-amber-500" size={22} />
          <h1 className="text-xl font-bold tracking-tight">Leaderboard</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">Top drinkers ranked by XP earned</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 mt-2">
          {Array.from({ length: 10 }).map((_, i) => <LeaderboardRowSkeleton key={i} />)}
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Trophy className="mx-auto mb-4 opacity-30" size={48} />
          <p>No players yet. Be the first to earn XP!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-2">

          {/* Top 3 Podium */}
          {leaders.length >= 3 && (
            <div className="grid grid-cols-3 gap-2 mb-4 px-2">
              {/* 2nd place */}
              <div className="flex flex-col items-center gap-2 pt-6">
                <div className={`relative p-3 rounded-2xl border bg-gradient-to-b ${rankConfig[1].bg}`}>
                  <img src={leaders[1].avatar} alt={leaders[1].buzzName} className="w-14 h-14 rounded-full border-2 border-slate-400/50" />
                  <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full ${rankConfig[1].badge} flex items-center justify-center font-black text-xs shadow-lg`}>2</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xs text-white truncate max-w-[80px]">{leaders[1].buzzName}</div>
                  <div className="text-[10px] text-amber-500 font-semibold">{leaders[1].xp.toLocaleString()} XP</div>
                </div>
              </div>

              {/* 1st place */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <Crown size={24} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                  <div className={`relative p-3 rounded-2xl border bg-gradient-to-b ${rankConfig[0].bg} shadow-[0_0_20px_rgba(250,204,21,0.2)]`}>
                    <img src={leaders[0].avatar} alt={leaders[0].buzzName} className="w-16 h-16 rounded-full border-2 border-yellow-400/50" />
                    <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full ${rankConfig[0].badge} flex items-center justify-center font-black text-xs shadow-lg`}>1</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-white truncate max-w-[90px]">{leaders[0].buzzName}</div>
                  <div className="text-xs text-amber-400 font-bold">{leaders[0].xp.toLocaleString()} XP</div>
                </div>
              </div>

              {/* 3rd place */}
              <div className="flex flex-col items-center gap-2 pt-8">
                <div className={`relative p-3 rounded-2xl border bg-gradient-to-b ${rankConfig[2].bg}`}>
                  <img src={leaders[2].avatar} alt={leaders[2].buzzName} className="w-12 h-12 rounded-full border-2 border-amber-700/50" />
                  <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full ${rankConfig[2].badge} flex items-center justify-center font-black text-xs shadow-lg`}>3</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xs text-white truncate max-w-[70px]">{leaders[2].buzzName}</div>
                  <div className="text-[10px] text-amber-500 font-semibold">{leaders[2].xp.toLocaleString()} XP</div>
                </div>
              </div>
            </div>
          )}

          {/* Full Rankings */}
          <div className="bg-[#110a02] border border-white/5 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <TrendingUp size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Rankings</span>
            </div>
            
            {leaders.map((user, idx) => (
              <div
                key={user._id}
                className={`flex items-center gap-4 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors
                  ${idx < 3 ? 'bg-gradient-to-r from-amber-500/5 to-transparent' : ''}`}
              >
                {/* Rank */}
                <div className="w-8 flex justify-center flex-shrink-0">
                  {idx < 3 ? (
                    rankConfig[idx].icon
                  ) : (
                    <span className="text-gray-500 text-sm font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img src={user.avatar} alt={user.buzzName} className="w-10 h-10 rounded-full border border-white/10" />
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[9px] font-black px-1 rounded-sm border border-[#110a02]">L{user.level}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-white truncate">{user.buzzName}</div>
                  <div className="text-xs text-gray-400 truncate">@{user.handle}</div>
                </div>

                {/* XP */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                    <Sparkles size={12} />
                    {user.xp.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-500">XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
