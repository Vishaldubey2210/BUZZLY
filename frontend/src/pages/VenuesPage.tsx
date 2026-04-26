import React, { useState, useEffect } from 'react';
import { venueService } from '../services/venueService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Venue } from '../types';
import { Building, MapPin, Star, Users, Check, Clock, ExternalLink, Wine, Beer, Loader2 } from 'lucide-react';

const typeConfig: Record<string, { label: string; icon: string; color: string }> = {
  bar: { label: 'Bar', icon: '🍸', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  brewery: { label: 'Brewery', icon: '🍺', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  winery: { label: 'Winery', icon: '🍷', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  club: { label: 'Club', icon: '🎉', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  rooftop: { label: 'Rooftop', icon: '🌙', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  restaurant: { label: 'Restaurant', icon: '🍽️', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  cafe: { label: 'Café', icon: '☕', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
};

const FILTERS = [
  { id: 'all', label: 'All Venues' },
  { id: 'bar', label: '🍸 Bars' },
  { id: 'brewery', label: '🍺 Breweries' },
  { id: 'rooftop', label: '🌙 Rooftops' },
  { id: 'club', label: '🎉 Clubs' },
  { id: 'winery', label: '🍷 Wineries' },
];

const VenuesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  const loadVenues = async (type?: string) => {
    setLoading(true);
    try {
      const data = await venueService.getVenues(1, 20, undefined, type === 'all' ? undefined : type);
      setVenues(data.data || []);
    } catch {
      showToast('Failed to load venues', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVenues(activeFilter); }, [activeFilter]);

  const handleFollow = async (venue: Venue) => {
    if (!user) return;
    setFollowLoading(venue._id);
    try {
      const result = await venueService.followVenue(venue._id);
      setVenues(prev => prev.map(v => v._id === venue._id ? {
        ...v,
        followers: result.following
          ? [...(v.followers || []), user._id]
          : (v.followers || []).filter(id => id !== user._id),
      } : v));
      showToast(result.following ? 'Following venue! 🍺' : 'Unfollowed venue', result.following ? 'success' : 'info');
    } catch {
      showToast('Something went wrong', 'error');
    } finally {
      setFollowLoading(null);
    }
  };

  const isFollowing = (venue: Venue) => user ? (venue.followers || []).includes(user._id) : false;

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0 animate-in fade-in duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0600]/80 backdrop-blur-md border-b border-white/5 -mx-4 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <Building className="text-amber-500" size={22} />
          <h1 className="text-xl font-bold tracking-tight">Bars & Venues</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all
                ${activeFilter === f.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[#110a02] border border-white/5 rounded-xl overflow-hidden animate-pulse">
              <div className="h-40 bg-white/10" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="h-3 bg-white/5 rounded w-3/4" />
                <div className="flex gap-2 mt-4">
                  <div className="h-8 bg-white/5 rounded-full w-24" />
                  <div className="h-8 bg-white/5 rounded-full w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Building className="mx-auto mb-4 opacity-30" size={48} />
          <p>No venues found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {venues.map(venue => {
            const conf = typeConfig[venue.type] || typeConfig.bar;
            const following = isFollowing(venue);
            const isLoading = followLoading === venue._id;

            return (
              <div key={venue._id} className="bg-[#110a02] border border-white/5 rounded-xl overflow-hidden hover:border-amber-500/20 transition-all group">
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-white/5">
                  {venue.image ? (
                    <img src={venue.image} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-5xl opacity-20">{conf.icon}</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#110a02] via-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {venue.isFeatured && <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded-full">⭐ Featured</span>}
                    {venue.isVerified && <span className="bg-blue-500/80 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">✓ Verified</span>}
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border backdrop-blur-sm ${conf.color}`}>{conf.icon} {conf.label}</span>
                  </div>
                  {venue.priceRange && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">{venue.priceRange}</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">{venue.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                        <MapPin size={12} className="text-amber-500" />
                        {venue.address && `${venue.address}, `}{venue.city}
                      </div>
                    </div>
                    {venue.rating && (
                      <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full flex-shrink-0">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-400">{venue.rating}</span>
                      </div>
                    )}
                  </div>

                  {venue.description && <p className="text-sm text-gray-400 line-clamp-2 mb-3">{venue.description}</p>}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Users size={12} />{(venue.followers || []).length} followers</span>
                    {venue.openingHours && <span className="flex items-center gap-1"><Clock size={12} />{venue.openingHours}</span>}
                  </div>

                  {/* Specialties */}
                  {venue.specialties && venue.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {venue.specialties.slice(0, 4).map(s => (
                        <span key={s} className="text-[11px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFollow(venue)}
                      disabled={isLoading}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all
                        ${following
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                          : 'bg-amber-500 text-black hover:bg-amber-400'} disabled:opacity-60`}
                    >
                      {isLoading ? <Loader2 size={14} className="animate-spin" /> : following ? <Check size={14} /> : <Users size={14} />}
                      {following ? 'Following' : 'Follow'}
                    </button>
                    {venue.website && (
                      <a href={venue.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-gray-400 border border-white/10 hover:border-amber-500/30 hover:text-amber-400 transition-all">
                        <ExternalLink size={14} /> Visit
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VenuesPage;
