import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { User } from '../types';
import { Settings as SettingsIcon, Bell, Lock, User as UserIcon, Palette, LogOut, Check, Loader2, ChevronRight, Moon, Volume2, Shield, Trash2 } from 'lucide-react';

const SECTIONS = [
  { id: 'account', label: 'Account', icon: UserIcon, desc: 'Manage your profile information' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Control what you hear about' },
  { id: 'privacy', label: 'Privacy', icon: Shield, desc: 'Manage your privacy settings' },
  { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Customize your experience' },
];

const Settings: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('account');
  const [isSaving, setIsSaving] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ likes: true, comments: true, connections: true, messages: true });

  useEffect(() => {
    if (user?.notificationPrefs) setNotifPrefs(user.notificationPrefs as any);
  }, [user]);

  const handleSaveNotifPrefs = async () => {
    setIsSaving(true);
    try {
      const updated = await userService.updateProfile({ notificationPrefs: notifPrefs } as any);
      updateUser(updated);
      showToast('Notification preferences saved!', 'success');
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 pt-4 pb-2">
        <SettingsIcon size={20} className="text-amber-500" />
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-4">
        {/* Sidebar Nav */}
        <div className="bg-[#110a02] border border-white/5 rounded-xl p-2 h-fit">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all text-left
                ${activeSection === s.id ? 'bg-amber-500/10 text-amber-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <s.icon size={18} />
              <div className="flex-1">
                <div>{s.label}</div>
              </div>
              <ChevronRight size={14} className="opacity-40" />
            </button>
          ))}
          <div className="border-t border-white/5 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#110a02] border border-white/5 rounded-xl p-5">
          {/* Account */}
          {activeSection === 'account' && (
            <div>
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><UserIcon size={20} className="text-amber-500" />Account</h2>
              <div className="flex flex-col gap-4">
                {/* Profile summary */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <img src={user.avatar} className="w-16 h-16 rounded-full border border-white/10" alt="" />
                  <div>
                    <div className="font-bold text-white">{user.buzzName}</div>
                    <div className="text-sm text-gray-400">@{user.handle}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Level', val: `Level ${user.level}` },
                    { label: 'XP', val: `${user.xp.toLocaleString()} XP` },
                    { label: 'Badges Earned', val: `${(user.badges || []).length} badges` },
                    { label: 'Member Since', val: new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
                  ].map(item => (
                    <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-xs text-gray-500">{item.label}</div>
                      <div className="font-bold text-white mt-0.5">{item.val}</div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <p className="text-sm text-gray-400">To update your profile details, go to <a href="/profile" className="text-amber-500 hover:underline">My Profile</a> and click Edit.</p>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={16} /> Delete Account
                  </button>
                  <p className="text-xs text-gray-600 mt-1">This action is permanent and cannot be undone.</p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div>
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Bell size={20} className="text-amber-500" />Notifications</h2>
              <div className="flex flex-col gap-3 mb-4">
                {[
                  { key: 'likes', label: 'Post Likes', desc: 'When someone likes your post' },
                  { key: 'comments', label: 'Comments', desc: 'When someone comments on your post' },
                  { key: 'connections', label: 'Connections', desc: 'Connection requests and acceptances' },
                  { key: 'messages', label: 'Messages', desc: 'New messages from your connections' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div>
                      <div className="font-medium text-white">{label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifPrefs(p => ({ ...p, [key]: !(p as any)[key] }))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${(notifPrefs as any)[key] ? 'bg-amber-500' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-1 transition-all ${(notifPrefs as any)[key] ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSaveNotifPrefs} disabled={isSaving}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Preferences
              </button>
            </div>
          )}

          {/* Privacy */}
          {activeSection === 'privacy' && (
            <div>
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Shield size={20} className="text-amber-500" />Privacy</h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Profile Visibility', desc: 'Anyone on Buzzly can see your profile', val: 'Public' },
                  { label: 'Connection Requests', desc: 'Who can send you pour requests', val: 'Everyone' },
                  { label: 'Message Requests', desc: 'Who can message you', val: 'Connections' },
                  { label: 'Activity Status', desc: 'Show when you\'re active', val: 'Visible' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div>
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                    <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full font-medium">{item.val}</span>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-2">Full privacy controls coming soon 🔒</p>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div>
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Palette size={20} className="text-amber-500" />Appearance</h2>
              <div className="flex flex-col gap-3">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="font-medium text-white mb-1 flex items-center gap-2"><Moon size={16} className="text-amber-500" />Theme</div>
                  <p className="text-xs text-gray-400 mb-3">Buzzly uses a dark theme optimized for nightlife vibes</p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/40 rounded-full text-sm font-bold text-amber-400">
                      <div className="w-3 h-3 rounded-full bg-[#0a0600] border border-amber-500" /> Dark (Buzzly Default)
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="font-medium text-white mb-1 flex items-center gap-2"><Volume2 size={16} className="text-amber-500" />Sound Effects</div>
                  <p className="text-xs text-gray-400">Notification sounds — coming soon</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
