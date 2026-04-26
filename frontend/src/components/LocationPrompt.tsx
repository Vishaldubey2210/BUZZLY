import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { MapPin, Loader2, Navigation, Map } from 'lucide-react';

export const LocationPrompt: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState('');

  if (!user || user.locationSet) return null;

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const updatedUser = await userService.updateProfile({
            location: { type: 'Point', coordinates: [longitude, latitude] },
            locationSet: true,
          } as any);
          updateUser(updatedUser);
          showToast('Location saved! 🎉', 'success');
        } catch (e) {
          showToast('Failed to save location', 'error');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        showToast('Failed to get location. Please enter your city manually.', 'error');
      }
    );
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;

    setLoading(true);
    try {
      const updatedUser = await userService.updateProfile({
        city: cityInput.trim(),
        locationSet: true,
      });
      updateUser(updatedUser);
      showToast('City saved! 🎉', 'success');
    } catch (e) {
      showToast('Failed to save city', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#110a02] border border-amber-500/20 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in slide-in-from-bottom-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
            <Map size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">Where are you buzzing?</h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Set your location to discover nearby events, trending venues, and locals in your area.
        </p>

        <button
          onClick={handleUseGPS}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 rounded-xl transition-all disabled:opacity-70 mb-4"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
          Use Current Location
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-gray-500 font-medium uppercase">Or enter city</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <form onSubmit={handleManualSubmit}>
          <div className="relative mb-4">
            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="e.g. Mumbai, Bengaluru"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !cityInput.trim()}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Save City'}
          </button>
        </form>
      </div>
    </div>
  );
};
