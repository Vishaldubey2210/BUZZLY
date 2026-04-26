import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { connectionService } from '../services/connectionService';
import { Post, User, DrinkJourneyEntry } from '../types';
import PostCard from '../components/PostCard';
import { PostSkeleton } from '../components/Skeleton';
import {
  Loader2, Grid, Users, Edit3, MapPin, Sparkles, X, Check,
  Briefcase, Award, Plus, Calendar, Globe, Trash2, Pencil,
  MessageCircle, UserPlus, UserCheck
} from 'lucide-react';

const DRINK_OPTIONS = [
  { id: 'beer', label: '🍺 Beer' }, { id: 'wine', label: '🍷 Wine' },
  { id: 'spirit', label: '🥃 Spirits' }, { id: 'cocktail', label: '🍸 Cocktails' }, { id: 'na', label: '🌿 Non-Alc' },
];

const TABS = [
  { id: 'posts', label: 'Posts', icon: MessageCircle },
  { id: 'journey', label: 'Drink Journey', icon: Briefcase },
  { id: 'badges', label: 'Badges', icon: Award },
  { id: 'connections', label: 'Connections', icon: Users },
];

const defaultJourneyForm: DrinkJourneyEntry = { title: '', place: '', description: '', isCurrent: false };

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [connections, setConnections] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', headline: '', city: '', website: '', drinkPreferences: [] as string[] });
  const [isSaving, setIsSaving] = useState(false);

  // Journey modal
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [journeyForm, setJourneyForm] = useState<DrinkJourneyEntry>(defaultJourneyForm);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [localJourney, setLocalJourney] = useState<DrinkJourneyEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    setEditForm({ bio: user.bio || '', headline: user.headline || '', city: user.city || '', website: user.website || '', drinkPreferences: user.drinkPreferences || [] });
    setLocalJourney(user.drinkJourney || []);
    loadStats();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    if (activeTab === 'posts') {
      postService.getUserPosts(user._id).then(d => setPosts(d.data)).catch(() => {}).finally(() => setLoading(false));
    } else if (activeTab === 'connections') {
      connectionService.getConnections().then(d => setConnections(d)).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [activeTab, user]);

  const loadStats = async () => {
    if (!user) return;
    try { setStats(await userService.getUserStats(user._id)); } catch {}
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updated = await userService.updateProfile(editForm);
      updateUser?.(updated);
      showToast('Profile updated! ✨', 'success');
      setShowEditModal(false);
    } catch {
      showToast('Update failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveJourney = async () => {
    if (!journeyForm.title || !journeyForm.place) { showToast('Title and place are required', 'error'); return; }
    setJourneyLoading(true);
    try {
      let entries;
      if (editingEntryId) {
        entries = await userService.updateDrinkJourneyEntry(editingEntryId, journeyForm);
      } else {
        entries = await userService.addDrinkJourneyEntry(journeyForm);
      }
      setLocalJourney(entries);
      updateUser?.({ ...user!, drinkJourney: entries });
      showToast('Drink Journey updated! 🍺', 'success');
      setShowJourneyModal(false);
      setJourneyForm(defaultJourneyForm);
      setEditingEntryId(null);
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setJourneyLoading(false);
    }
  };

  const handleDeleteJourney = async (entryId: string) => {
    try {
      await userService.deleteDrinkJourneyEntry(entryId);
      const updated = localJourney.filter(e => e._id !== entryId);
      setLocalJourney(updated);
      updateUser?.({ ...user!, drinkJourney: updated });
      showToast('Entry removed', 'info');
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  if (!user) return null;
  const xpProgress = ((user.xp % 1000) / 1000) * 100;

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="bg-[#110a02] border border-white/5 rounded-xl overflow-hidden shadow-amber">
        {/* Cover */}
        <div className="h-36 relative overflow-hidden">
          {user.coverImage ? (
            <img src={user.coverImage} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="h-full bg-gradient-to-tr from-amber-500/25 via-purple-500/10 to-transparent" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#110a02]/60 to-transparent" />
          <button onClick={() => setShowEditModal(true)} className="absolute top-3 right-3 bg-[#0a0600]/70 text-gray-400 hover:text-amber-400 p-2 rounded-full border border-white/10 backdrop-blur-sm transition-colors">
            <Edit3 size={15} />
          </button>
        </div>

        <div className="px-5 pb-0">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-14 mb-3">
            <div className="relative p-1 bg-[#110a02] rounded-full">
              <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-[#0a0600] object-cover" alt="" />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded-full border-2 border-[#110a02] shadow-lg">
                Lv.{user.level}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{user.buzzName}</h1>
            <p className="text-gray-400 text-sm">@{user.handle}</p>
            {user.headline && <p className="text-gray-300 text-sm mt-1">{user.headline}</p>}
            {user.bio && <p className="text-gray-400 text-sm mt-2 leading-relaxed">{user.bio}</p>}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              {user.city && <span className="flex items-center gap-1"><MapPin size={11} className="text-amber-500" />{user.city}</span>}
              {user.website && <span className="flex items-center gap-1"><Globe size={11} />{user.website}</span>}
              <span className="flex items-center gap-1"><Calendar size={11} />Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
            </div>
            {/* Drink prefs */}
            {user.drinkPreferences && user.drinkPreferences.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {user.drinkPreferences.map(p => {
                  const opt = DRINK_OPTIONS.find(o => o.id === p);
                  return opt ? <span key={p} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{opt.label}</span> : null;
                })}
              </div>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex gap-5 py-3 border-t border-white/5">
              {[
                { label: 'Posts', val: stats.postCount },
                { label: 'Connections', val: stats.connectionCount },
                { label: 'Followers', val: stats.followerCount || 0 },
                { label: 'Following', val: stats.followingCount || 0 },
                { label: 'XP', val: user.xp.toLocaleString(), amber: true },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className={`font-bold text-base ${s.amber ? 'text-amber-400' : 'text-white'}`}>{s.val}</div>
                  <div className="text-[10px] text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* XP Bar */}
          <div className="py-3 border-t border-white/5">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-amber-500 font-semibold flex items-center gap-1"><Sparkles size={11} />Experience</span>
              <span className="text-gray-500">{1000 - (user.xp % 1000)} XP to Level {user.level + 1}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>

          {/* Badges preview */}
          {user.badges && user.badges.length > 0 && (
            <div className="py-3 border-t border-white/5 flex gap-3 flex-wrap">
              {user.badges.map(b => (
                <div key={b.id} title={b.name} className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/15 px-2.5 py-1 rounded-full cursor-default" onClick={() => setActiveTab('badges')}>
                  <span>{b.icon}</span>
                  <span className="text-xs font-semibold text-amber-400">{b.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-t border-white/10 mt-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex justify-center items-center gap-1 py-3.5 text-[11px] font-bold border-b-2 transition-colors
                ${activeTab === tab.id ? 'border-amber-500 text-amber-500' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon size={13} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div className="flex flex-col gap-4">
          {loading ? [1,2].map(i => <PostSkeleton key={i} />) : posts.length === 0 ? (
            <div className="text-center p-10 bg-[#110a02] rounded-xl border border-white/5 text-gray-500">
              <div className="text-4xl mb-3">📝</div><p>No posts yet</p>
            </div>
          ) : posts.map(p => <PostCard key={p._id} post={p} />)}
        </div>
      )}

      {activeTab === 'journey' && (
        <div className="bg-[#110a02] border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2"><Briefcase size={18} className="text-amber-500" />Drink Journey</h3>
            <button
              onClick={() => { setJourneyForm(defaultJourneyForm); setEditingEntryId(null); setShowJourneyModal(true); }}
              className="flex items-center gap-1 text-sm text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          {localJourney.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-3">🥃</div>
              <p>No entries yet</p>
              <button onClick={() => { setJourneyForm(defaultJourneyForm); setShowJourneyModal(true); }} className="mt-3 text-sm text-amber-500 hover:underline">Add your first entry</button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {localJourney.map((entry, i) => (
                <div key={entry._id || i} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl flex-shrink-0">🍺</div>
                    {i < localJourney.length - 1 && <div className="w-0.5 flex-1 bg-white/5 mt-2" />}
                  </div>
                  <div className="flex-1 pb-4 border-b border-white/5 last:border-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white">{entry.title}</div>
                        <div className="text-sm text-amber-400">{entry.place}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {entry.startDate && new Date(entry.startDate).getFullYear()}
                          {entry.isCurrent ? ' – Present' : entry.endDate ? ` – ${new Date(entry.endDate).getFullYear()}` : ''}
                        </div>
                        {entry.description && <p className="text-sm text-gray-400 mt-1">{entry.description}</p>}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setJourneyForm({ ...entry }); setEditingEntryId(entry._id || null); setShowJourneyModal(true); }}
                          className="p-1.5 text-gray-400 hover:text-amber-400 transition-colors rounded-lg hover:bg-white/5"><Pencil size={14} /></button>
                        <button onClick={() => entry._id && handleDeleteJourney(entry._id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="bg-[#110a02] border border-white/5 rounded-xl p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Award size={18} className="text-amber-500" />Achievements</h3>
          {!user.badges || user.badges.length === 0 ? (
            <div className="text-center py-8 text-gray-500"><div className="text-4xl mb-3">🏅</div><p>Earn badges by posting and connecting!</p></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {user.badges.map(b => (
                <div key={b.id} className="flex flex-col items-center gap-2 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl hover:bg-amber-500/8 transition-colors text-center">
                  <span className="text-4xl">{b.icon}</span>
                  <div className="font-bold text-sm">{b.name}</div>
                  <div className="text-[11px] text-gray-500">{new Date(b.earnedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {loading ? [1,2,3,4].map(i => <div key={i} className="h-20 bg-[#110a02] rounded-xl animate-pulse" />) :
            connections.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-[#110a02] rounded-xl border border-white/5 text-gray-500">
                <div className="text-4xl mb-3">🤝</div><p>No connections yet</p>
              </div>
            ) : connections.map(buddy => (
              <div key={buddy._id} className="flex items-center gap-3 p-3 bg-[#110a02] rounded-xl border border-white/5 hover:border-amber-500/20 transition-all">
                <img src={buddy.avatar} alt={buddy.buzzName} className="w-12 h-12 rounded-full border border-white/10" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{buddy.buzzName}</div>
                  <div className="text-xs text-gray-400">@{buddy.handle}</div>
                  {buddy.headline && <div className="text-xs text-gray-500 truncate mt-0.5">{buddy.headline}</div>}
                </div>
                <span className="text-xs bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full">Lv.{buddy.level}</span>
              </div>
            ))
          }
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-end md:items-center justify-center p-4">
          <div className="bg-[#110a02] border border-amber-500/20 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#110a02] z-10">
              <h2 className="font-bold text-lg">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {[
                { key: 'headline', label: 'Headline', placeholder: 'Craft Beer Enthusiast | Mumbai 🍺', maxLen: 120 },
                { key: 'bio', label: 'Bio', placeholder: 'Tell your buzz story...', maxLen: 300, area: true },
                { key: 'city', label: 'City', placeholder: 'Mumbai, Bengaluru, Delhi...', maxLen: 50 },
                { key: 'website', label: 'Website', placeholder: 'https://yoursite.com', maxLen: 100 },
              ].map(({ key, label, placeholder, maxLen, area }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">{label}</label>
                  {area ? (
                    <textarea
                      value={(editForm as any)[key]}
                      onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      maxLength={maxLen}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-amber-500/50"
                    />
                  ) : (
                    <input
                      type="text"
                      value={(editForm as any)[key]}
                      onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      maxLength={maxLen}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Drink Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {DRINK_OPTIONS.map(opt => {
                    const sel = editForm.drinkPreferences.includes(opt.id);
                    return (
                      <button key={opt.id}
                        onClick={() => setEditForm(p => ({ ...p, drinkPreferences: sel ? p.drinkPreferences.filter(d => d !== opt.id) : [...p.drinkPreferences, opt.id] }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${sel ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-gray-400 border-white/10 hover:border-amber-500/30'}`}
                      >
                        {opt.label} {sel && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={handleSaveProfile} disabled={isSaving}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drink Journey Modal */}
      {showJourneyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-end md:items-center justify-center p-4">
          <div className="bg-[#110a02] border border-amber-500/20 rounded-2xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-bold text-lg">{editingEntryId ? 'Edit' : 'Add'} Journey Entry</h2>
              <button onClick={() => setShowJourneyModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {[
                { key: 'title', label: 'Role / Title', placeholder: 'Head Bartender, Beer Blogger...' },
                { key: 'place', label: 'Place / Venue', placeholder: 'The Tipsy Bear, Bandra' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">{label}</label>
                  <input type="text" value={(journeyForm as any)[key]}
                    onChange={e => setJourneyForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea value={journeyForm.description || ''} onChange={e => setJourneyForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="What did you do / learn here?"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <input type="checkbox" id="isCurrent" checked={journeyForm.isCurrent || false}
                  onChange={e => setJourneyForm(p => ({ ...p, isCurrent: e.target.checked }))}
                  className="w-4 h-4 accent-amber-500"
                />
                <label htmlFor="isCurrent" className="text-sm text-white font-medium">Currently active here</label>
              </div>
              <button onClick={handleSaveJourney} disabled={journeyLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {journeyLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {editingEntryId ? 'Update Entry' : 'Add Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
