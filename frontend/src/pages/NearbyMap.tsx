import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Users, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet default icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Venue {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  distance: string;
  buzzScore: number;
  activeUsers: number;
  special: string;
  category: 'beer' | 'cocktail' | 'wine' | 'club' | 'rooftop';
}

const venues: Venue[] = [
  { id: '1', name: 'The Tipsy Bear', type: 'Craft Beer Bar', lat: 19.0548, lng: 72.8315, distance: '0.8 km', buzzScore: 94, activeUsers: 45, special: 'Happy Hour till 9PM 🍺', category: 'beer' },
  { id: '2', name: 'Aer Rooftop', type: 'Rooftop Lounge', lat: 19.0612, lng: 72.8361, distance: '1.4 km', buzzScore: 91, activeUsers: 72, special: 'Live DJ tonight 🎵', category: 'rooftop' },
  { id: '3', name: 'Hops & Barley', type: 'Brewery', lat: 19.0503, lng: 72.8254, distance: '0.5 km', buzzScore: 88, activeUsers: 32, special: 'New IPA drop! 🌿', category: 'beer' },
  { id: '4', name: 'The Harbour Bar', type: 'Heritage Bar', lat: 19.0698, lng: 72.8299, distance: '2.1 km', buzzScore: 85, activeUsers: 28, special: 'Classic cocktails + sea view', category: 'cocktail' },
  { id: '5', name: 'Social Bandra', type: 'Bar & Café', lat: 19.0578, lng: 72.8379, distance: '1.1 km', buzzScore: 89, activeUsers: 61, special: 'Trivia night 8PM 🧠', category: 'cocktail' },
  { id: '6', name: 'Wine Rack', type: 'Wine Bar', lat: 19.0522, lng: 72.8421, distance: '1.8 km', buzzScore: 82, activeUsers: 19, special: 'Free tasting 7-8PM 🍷', category: 'wine' },
  { id: '7', name: 'Bombay Canteen', type: 'Restaurant & Bar', lat: 19.0465, lng: 72.8290, distance: '1.2 km', buzzScore: 90, activeUsers: 54, special: 'Craft cocktail specials', category: 'cocktail' },
  { id: '8', name: 'Skybar Worli', type: 'Rooftop Club', lat: 19.0142, lng: 72.8219, distance: '3.5 km', buzzScore: 96, activeUsers: 88, special: '🔥 Biggest night of the week!', category: 'club' },
];

const categoryColors: Record<string, { color: string; emoji: string }> = {
  beer: { color: '#f59e0b', emoji: '🍺' },
  cocktail: { color: '#06b6d4', emoji: '🍸' },
  wine: { color: '#f43f5e', emoji: '🍷' },
  club: { color: '#a855f7', emoji: '🎉' },
  rooftop: { color: '#22c55e', emoji: '🌙' },
};

const createVenueIcon = (category: string, buzzScore: number) => {
  const config = categoryColors[category] || categoryColors.cocktail;
  const size = buzzScore > 90 ? 36 : 30;
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px; height: ${size}px;
        background: ${config.color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: ${size > 32 ? 16 : 13}px; display: block; text-align: center; line-height: ${size}px;">${config.emoji}</span>
      </div>
    `,
    className: '',
    iconSize: [size, size] as [number, number],
    iconAnchor: [size / 2, size] as [number, number],
    popupAnchor: [0, -size] as [number, number],
  });
};

const NearbyMap: React.FC = () => {
  const { user } = useAuth();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredVenues = activeFilter === 'all'
    ? venues
    : venues.filter(v => v.category === activeFilter);

  const userLng = user?.location?.coordinates?.[0];
  const userLat = user?.location?.coordinates?.[1];
  
  const center: [number, number] = userLat && userLng ? [userLat, userLng] : [19.051, 72.832];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] -mx-4 md:mx-0 animate-in fade-in duration-300">

      {/* Header */}
      <div className="px-4 md:px-0 pt-4 pb-3 bg-[#0a0600]">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-amber-500" size={22} />
          <h1 className="text-xl font-bold tracking-tight">Nearby Map</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {[
            { id: 'all', label: '🗺️ All' },
            { id: 'beer', label: '🍺 Beer' },
            { id: 'cocktail', label: '🍸 Cocktail' },
            { id: 'wine', label: '🍷 Wine' },
            { id: 'club', label: '🎉 Club' },
            { id: 'rooftop', label: '🌙 Rooftop' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all
                ${activeFilter === f.id
                  ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <MapContainer
          center={center}
          zoom={13}
          className="w-full h-full"
          style={{ background: '#0a0600', minHeight: '300px' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Circle
            center={center}
            radius={800}
            pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.05, weight: 1 }}
          />
          {filteredVenues.map(venue => (
            <Marker
              key={venue.id}
              position={[venue.lat, venue.lng] as [number, number]}
              icon={createVenueIcon(venue.category, venue.buzzScore)}
              eventHandlers={{ click: () => setSelectedVenue(venue) }}
            >
              <Popup maxWidth={240}>
                <div className="min-w-[180px]">
                  <div className="font-bold text-sm mb-1">{venue.name}</div>
                  <div className="text-xs text-gray-500 mb-1">{venue.type}</div>
                  <div className="text-xs text-amber-600 font-medium mb-1">{venue.special}</div>
                  <div className="text-xs text-gray-500">
                    👥 {venue.activeUsers} here · {venue.distance} away · 🔥 {venue.buzzScore}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {userLat && userLng && (
            <Marker
              position={[userLat, userLng]}
              icon={L.divIcon({
                html: `<div style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.8);"></div>`,
                className: '',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-bold text-sm text-blue-600">📍 You are here</div>
                  <div className="text-xs text-gray-500">{user?.city}</div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Stats Overlay */}
        <div className="absolute top-3 right-3 z-[1000] bg-[#110a02]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs">
          <div className="font-bold text-amber-500 mb-1.5 flex items-center gap-1">
            <Zap size={12} className="animate-pulse" /> Live Buzz
          </div>
          <div className="text-white font-bold text-lg">{filteredVenues.reduce((sum, v) => sum + v.activeUsers, 0)}</div>
          <div className="text-gray-400">people out tonight</div>
        </div>
      </div>

      {/* Bottom Venue Strip */}
      <div className="bg-[#0a0600] border-t border-white/5 px-4 py-3 overflow-x-auto flex-shrink-0">
        <div className="flex gap-3 pb-1">
          {filteredVenues
            .sort((a, b) => b.buzzScore - a.buzzScore)
            .map(venue => {
              const config = categoryColors[venue.category];
              return (
                <div
                  key={venue.id}
                  onClick={() => setSelectedVenue(venue)}
                  className={`flex-shrink-0 bg-[#110a02] border rounded-xl p-3 cursor-pointer transition-all w-44 hover:border-amber-500/30
                    ${selectedVenue?.id === venue.id ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{config.emoji}</span>
                    <span className="text-[10px] font-bold text-amber-500">🔥 {venue.buzzScore}</span>
                  </div>
                  <div className="font-bold text-xs text-white truncate">{venue.name}</div>
                  <div className="text-[10px] text-gray-500 truncate mt-0.5">{venue.distance} away</div>
                  <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Users size={8} />{venue.activeUsers} here
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default NearbyMap;
