import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Post } from '../types';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { connectionService } from '../services/connectionService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PostCard from '../components/PostCard';
import { PostSkeleton } from '../components/Skeleton';
import { MapPin, Sparkles, UserPlus, UserCheck, MessageCircle, ArrowLeft, Briefcase, Award, Calendar, ExternalLink, Users } from 'lucide-react';

const DRINK_LABELS: Record<string, string> = { beer: '🍺 Beer', wine: '🍷 Wine', spirit: '🥃 Spirits', cocktail: '🍸 Cocktails', na: '🌿 Non-Alc' };

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<{ postCount: number; connectionCount: number; followerCount: number; followingCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'journey' | 'badges'>('posts');
  const [actionLoading, setActionLoading] = useState(false);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    if (!userId) return;
    if (isOwnProfile) { navigate('/profile', { replace: true }); return; }
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [userData, statsData] = await Promise.all([
        userService.getUserById(userId),
        userService.getUserStats(userId),
      ]);
      setProfile(userData);
      setStats(statsData);
    } catch {
      showToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
    setPostsLoading(true);
    try {
      const postsData = await postService.getUserPosts(userId);
      setPosts(postsData.data);
    } catch {} finally {
      setPostsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profile) return;
    setActionLoading(true);
    try {
      const result = await userService.followUser(profile._id);
      setProfile(p => p ? { ...p, isFollowing: result.following } : p);
      showToast(result.following ? `Following ${profile.buzzName}! 🍻` : 'Unfollowed', result.following ? 'success' : 'info');
    } catch (e: any) {
      showToast(e?.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!profile) return;
    setActionLoading(true);
    try {
      await connectionService.sendRequest(profile._id);
      showToast(`Pour request sent to ${profile.buzzName}! 🍺`, 'success');
    } catch (e: any) {
      showToast(e?.response?.data?.message || 'Already connected or pending', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-40 bg-white/5 rounded-xl mb-4" />
      <div className="bg-[#110a02] border border-white/5 rounded-xl p-6 space-y-4">
        <div className="flex gap-4 items-end -mt-16">
          <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-[#0a0600]" />
          <div className="flex-1 space-y-2 pb-2">
            <div className="h-5 bg-white/10 rounded w-1/3" />
            <div className="h-3 bg-white/5 rounded w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="text-center py-20 text-gray-500">
      <div className="text-5xl mb-4">🍺</div>
      <p>User not found</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-amber-500 hover:underline">Go back</button>
    </div>
  );

  const xpProgress = ((profile.xp % 1000) / 1000) * 100;

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0 animate-in fade-in duration-300">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors -mb-2">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Profile Header */}
      <div className="bg-[#110a02] border border-white/5 rounded-xl overflow-hidden">
        {/* Cover */}
        <div className="h-40 relative overflow-hidden">
          {profile.coverImage ? (
            <img src={profile.coverImage} className="w-full h-full object-cover" alt="Cover" />
          ) : (
            <div className="h-full bg-gradient-to-tr from-amber-500/20 via-purple-500/10 to-transparent" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#110a02]/80 to-transparent" />
        </div>

        <div className="px-5 pb-5">
          {/* Avatar + actions */}
          <div className="flex items-end justify-between -mt-14 mb-4">
            <div className="relative">
              <img src={profile.avatar} alt={profile.buzzName} className="w-24 h-24 rounded-full border-4 border-[#110a02] object-cover" />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded-full border-2 border-[#110a02] shadow-lg">
                Lv.{profile.level}
              </span>
            </div>
            <div className="flex gap-2 mb-1">
              <button
                onClick={handleFollow}
                disabled={actionLoading}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all
                  ${profile.isFollowing
                    ? 'bg-white/10 text-gray-300 border border-white/10 hover:bg-red-500/20 hover:text-red-400'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'}`}
              >
                {profile.isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                {profile.isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={handleConnect}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all"
              >
                <UserPlus size={16} /> Connect
              </button>
            </div>
          </div>

          {/* Info */}
          <h1 className="text-2xl font-bold">{profile.buzzName}</h1>
          <p className="text-gray-400 text-sm">@{profile.handle}</p>
          {profile.headline && <p className="text-gray-300 text-sm mt-1">{profile.headline}</p>}
          {profile.bio && <p className="text-gray-400 text-sm mt-2 leading-relaxed">{profile.bio}</p>}

          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            {profile.city && <span className="flex items-center gap-1"><MapPin size={12} className="text-amber-500" />{profile.city}</span>}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener" className="flex items-center gap-1 text-amber-500 hover:underline">
                <ExternalLink size={12} />{profile.website}
              </a>
            )}
            <span className="flex items-center gap-1"><Calendar size={12} />Joined {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex gap-5 mt-4 pt-4 border-t border-white/5">
              {[
                { label: 'Posts', val: stats.postCount },
                { label: 'Connections', val: stats.connectionCount },
                { label: 'Followers', val: stats.followerCount },
                { label: 'Following', val: stats.followingCount },
                { label: 'XP', val: profile.xp.toLocaleString(), amber: true },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className={`font-bold text-base ${s.amber ? 'text-amber-400' : 'text-white'}`}>{s.val}</div>
                  <div className="text-[10px] text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* XP Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span className="flex items-center gap-1 text-amber-500 font-semibold"><Sparkles size={11} />Experience</span>
              <span>Level {profile.level}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>

          {/* Drink Prefs */}
          {profile.drinkPreferences && profile.drinkPreferences.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profile.drinkPreferences.map(p => (
                <span key={p} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                  {DRINK_LABELS[p] || p}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-t border-white/10">
          {[
            { id: 'posts', label: 'Posts', icon: MessageCircle },
            { id: 'journey', label: 'Drink Journey', icon: Briefcase },
            { id: 'badges', label: 'Badges', icon: Award },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex justify-center items-center gap-1.5 py-3.5 font-bold text-sm border-b-2 transition-colors
                ${activeTab === tab.id ? 'border-amber-500 text-amber-500' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon size={15} />{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-4">
        {activeTab === 'posts' && (
          <div className="flex flex-col gap-4">
            {postsLoading
              ? [1,2].map(i => <PostSkeleton key={i} />)
              : posts.length === 0
                ? <div className="text-center py-12 text-gray-500 bg-[#110a02] border border-white/5 rounded-xl"><div className="text-3xl mb-2">📝</div><p>No posts yet</p></div>
                : posts.map(p => <PostCard key={p._id} post={p} />)
            }
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="bg-[#110a02] border border-white/5 rounded-xl p-5">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Briefcase size={18} className="text-amber-500" />Drink Journey</h3>
            {!profile.drinkJourney || profile.drinkJourney.length === 0 ? (
              <div className="text-center py-8 text-gray-500"><div className="text-3xl mb-2">🥃</div><p>No journey entries yet</p></div>
            ) : (
              <div className="flex flex-col gap-4">
                {profile.drinkJourney.map((entry, i) => (
                  <div key={entry._id || i} className="flex gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-xl">🍺</div>
                    <div>
                      <div className="font-bold text-white">{entry.title}</div>
                      <div className="text-sm text-amber-400">{entry.place}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {entry.startDate && new Date(entry.startDate).getFullYear()}
                        {entry.isCurrent ? ' – Present' : entry.endDate ? ` – ${new Date(entry.endDate).getFullYear()}` : ''}
                      </div>
                      {entry.description && <p className="text-sm text-gray-400 mt-1">{entry.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="bg-[#110a02] border border-white/5 rounded-xl p-5">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Award size={18} className="text-amber-500" />Achievements</h3>
            {!profile.badges || profile.badges.length === 0 ? (
              <div className="text-center py-8 text-gray-500"><div className="text-3xl mb-2">🏅</div><p>No badges yet</p></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {profile.badges.map(badge => (
                  <div key={badge.id} className="flex flex-col items-center gap-2 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl text-center hover:bg-amber-500/10 transition-colors">
                    <span className="text-3xl">{badge.icon}</span>
                    <div className="font-bold text-sm text-white">{badge.name}</div>
                    <div className="text-[10px] text-gray-500">{new Date(badge.earnedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
