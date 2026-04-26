import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Calendar, MapPin, Users, Check, Loader2, Star, Plus, X } from 'lucide-react';
import { EventSkeleton } from '../components/Skeleton';

interface Event {
  _id: string;
  title: string;
  description: string;
  venue: { name: string; address: string; city: string };
  date: string;
  image?: string;
  category: string;
  attendees: string[];
  isFeatured?: boolean;
  createdBy?: { buzzName: string; avatar: string };
}

const categoryConfig: Record<string, { label: string; color: string; icon: string }> = {
  beer: { label: 'Beer', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: '🍺' },
  wine: { label: 'Wine', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', icon: '🍷' },
  spirit: { label: 'Spirits', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🥃' },
  cocktail: { label: 'Cocktails', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: '🍸' },
  other: { label: 'Special', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '✨' },
  mixer: { label: 'Mixer', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30', icon: '🎉' },
};

const filters = [
  { id: 'all', label: 'All Events' },
  { id: 'beer', label: '🍺 Beer' },
  { id: 'cocktail', label: '🍸 Cocktail' },
  { id: 'wine', label: '🍷 Wine' },
  { id: 'spirit', label: '🥃 Spirit' },
  { id: 'other', label: '✨ Special' },
];

const Events: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

  // Create Event State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', description: '', category: 'other', date: '',
    venueName: '', venueCity: ''
  });

  const loadEvents = async (category = 'all') => {
    setLoading(true);
    try {
      const data = await eventService.getEvents(1, 20, category);
      setEvents(data.data || []);
    } catch {
      showToast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(activeFilter); }, [activeFilter]);

  const handleRsvp = async (event: Event) => {
    if (!user) return;
    const isAttending = event.attendees.includes(user._id);
    setRsvpLoading(event._id);
    try {
      if (isAttending) {
        await eventService.unrsvpEvent(event._id);
        setEvents(prev => prev.map(e => e._id === event._id
          ? { ...e, attendees: e.attendees.filter(id => id !== user._id) }
          : e
        ));
        showToast('RSVP cancelled', 'info');
      } else {
        await eventService.rsvpEvent(event._id);
        setEvents(prev => prev.map(e => e._id === event._id
          ? { ...e, attendees: [...e.attendees, user._id] }
          : e
        ));
        showToast('You\'re going! See you there 🍻', 'success');
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setRsvpLoading(null);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.venueName) {
      showToast('Please fill out all required fields', 'error');
      return;
    }
    setIsCreating(true);
    try {
      const created = await eventService.createEvent({
        title: newEvent.title,
        description: newEvent.description,
        category: newEvent.category,
        date: new Date(newEvent.date).toISOString(),
        venue: { name: newEvent.venueName, city: newEvent.venueCity || 'Mumbai', address: '' },
      });
      setEvents(prev => [created, ...prev]);
      setShowCreateModal(false);
      setNewEvent({ title: '', description: '', category: 'other', date: '', venueName: '', venueCity: '' });
      showToast('Event created successfully! 🎉', 'success');
    } catch {
      showToast('Failed to create event', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const dateFormatted = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    const timeFormatted = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    if (days === 0) return `Today • ${timeFormatted}`;
    if (days === 1) return `Tomorrow • ${timeFormatted}`;
    return `${dateFormatted} • ${timeFormatted}`;
  };

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0600]/80 backdrop-blur-md border-b border-white/5 pb-3 -mx-4 px-4 pt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-amber-500" size={22} />
            <h1 className="text-xl font-bold tracking-tight">Events</h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-xl font-bold text-sm transition-colors"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Create Event</span>
          </button>
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-1">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all
                ${activeFilter === f.id
                  ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {Array.from({ length: 4 }).map((_, i) => <EventSkeleton key={i} />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Calendar className="mx-auto mb-4 opacity-30" size={48} />
          <p className="font-medium">No events found</p>
          <p className="text-sm mt-1">Check back soon for upcoming events!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {events.map(event => {
            const catConfig = categoryConfig[event.category] || categoryConfig.other;
            const isAttending = user ? event.attendees.includes(user._id) : false;
            const isLoading = rsvpLoading === event._id;

            return (
              <div
                key={event._id}
                className="bg-[#110a02] border border-white/5 rounded-xl overflow-hidden hover:border-amber-500/20 transition-all group"
              >
                {/* Event Image */}
                <div className="relative h-40 overflow-hidden bg-white/5">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
                      {catConfig.icon}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#110a02] via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    {event.isFeatured && (
                      <span className="flex items-center gap-1 bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded-full">
                        <Star size={10} fill="currentColor" /> Featured
                      </span>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border backdrop-blur-sm ${catConfig.color}`}>
                      {catConfig.icon} {catConfig.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white leading-tight mb-1 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">{event.description}</p>

                  <div className="flex flex-col gap-1.5 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-amber-500 flex-shrink-0" />
                      <span className="text-white font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-amber-500 flex-shrink-0" />
                      <span className="truncate">{event.venue.name}, {event.venue.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-amber-500 flex-shrink-0" />
                      <span>{event.attendees.length} going</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRsvp(event)}
                    disabled={isLoading}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                      ${isAttending
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                      } disabled:opacity-60`}
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isAttending ? (
                      <><Check size={16} /> Going ✓</>
                    ) : (
                      <>🍻 RSVP Now</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#110a02] border border-amber-500/20 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-bold text-lg text-white flex items-center gap-2"><Calendar size={18} className="text-amber-500"/> Host an Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateEvent} className="p-4 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Event Title *</label>
                <input type="text" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Craft Beer Tasting" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))}
                  placeholder="What's happening?" rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Date & Time *</label>
                  <input type="datetime-local" value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50 [color-scheme:dark]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Category</label>
                  <select value={newEvent.category} onChange={e => setNewEvent(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50">
                    <option value="beer">Beer</option>
                    <option value="wine">Wine</option>
                    <option value="spirit">Spirits</option>
                    <option value="cocktail">Cocktails</option>
                    <option value="mixer">Mixer / Party</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Venue Name *</label>
                  <input type="text" value={newEvent.venueName} onChange={e => setNewEvent(p => ({ ...p, venueName: e.target.value }))}
                    placeholder="e.g. Toit Brewpub" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">City *</label>
                  <input type="text" value={newEvent.venueCity} onChange={e => setNewEvent(p => ({ ...p, venueCity: e.target.value }))}
                    placeholder="e.g. Bengaluru" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isCreating || !newEvent.title || !newEvent.date || !newEvent.venueName} className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : 'Host Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
