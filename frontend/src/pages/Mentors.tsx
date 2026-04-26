import React, { useState, useEffect } from 'react';
import { mentorService } from '../services/mentorService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GraduationCap, Star, Clock, UserCheck, Loader2, Calendar, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_CATEGORIES = ['all', 'Mixology', 'Brewing', 'Sommelier', 'Bar Management', 'Distilling'];

export const Mentors: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const [showBookModal, setShowBookModal] = useState<any>(null);
  const [bookDate, setBookDate] = useState('');
  const [bookNotes, setBookNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Become a Mentor State
  const [showBecomeMentor, setShowBecomeMentor] = useState(false);
  const [mentorForm, setMentorForm] = useState({ experienceYears: '', bio: '', pricingPerSession: '' });
  const [expertiseInput, setExpertiseInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Advanced Filter
  const [minExperience, setMinExperience] = useState(0);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const data = await mentorService.getMentors(activeCategory);
        setMentors(data || []);
      } catch (err) {
        showToast('Failed to load mentors', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, [activeCategory]);

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookDate) return;
    setIsBooking(true);
    try {
      await mentorService.bookSession(showBookModal._id, new Date(bookDate).toISOString(), bookNotes);
      showToast('Session booked & payment complete! 🎉', 'success');
      setShowBookModal(null);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  const handleRegisterMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorForm.experienceYears || !mentorForm.bio || !mentorForm.pricingPerSession || !expertiseInput) return;
    setIsRegistering(true);
    try {
      const expertiseArr = expertiseInput.split(',').map(s => s.trim()).filter(Boolean);
      await mentorService.registerMentor({
        experienceYears: Number(mentorForm.experienceYears),
        bio: mentorForm.bio,
        pricingPerSession: Number(mentorForm.pricingPerSession),
        expertise: expertiseArr
      });
      showToast('Successfully registered as a Mentor! 🎓', 'success');
      setShowBecomeMentor(false);
      // Reload mentors to see themselves
      const data = await mentorService.getMentors(activeCategory);
      setMentors(data || []);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to register', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const filteredMentors = mentors.filter(m => (m.experienceYears || 0) >= minExperience);

  return (
    <div className="flex flex-col gap-4 pb-20 md:pb-0 animate-in fade-in duration-300">
      <div className="sticky top-0 z-20 bg-[#0a0600]/80 backdrop-blur-md border-b border-white/5 pb-3 -mx-4 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="text-amber-500" size={22} />
              <h1 className="text-xl font-bold tracking-tight">Mentorship</h1>
            </div>
            <p className="text-xs text-gray-400 mt-1">Learn from industry experts & masters.</p>
          </div>
          <button onClick={() => setShowBecomeMentor(true)} className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black border border-amber-500/20 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            Become a Mentor
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 pb-1">
          {MOCK_CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all
                ${activeCategory === c
                  ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
            >
              {c === 'all' ? 'All Experts' : c}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 mt-3 px-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Min Experience:</span>
          <input type="range" min="0" max="20" value={minExperience} onChange={(e) => setMinExperience(Number(e.target.value))} className="accent-amber-500 w-32" />
          <span className="text-xs text-white font-bold">{minExperience}+ years</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-amber-500" size={32} /></div>
      ) : filteredMentors.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <GraduationCap className="mx-auto mb-4 opacity-30" size={48} />
          <p className="font-medium">No mentors found matching your criteria</p>
          <button onClick={() => setShowBecomeMentor(true)} className="mt-4 bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-xl text-sm font-bold transition-all">
            Be the first to offer mentorship!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {filteredMentors.map(mentor => (
            <div key={mentor._id} className="bg-[#110a02] border border-white/5 rounded-xl p-5 hover:border-amber-500/20 transition-all flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                <img src={mentor.user.avatar} className="w-14 h-14 rounded-full border-2 border-white/10 object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg truncate hover:text-amber-400 cursor-pointer" onClick={() => navigate(`/profile/${mentor.user._id}`)}>
                    {mentor.user.buzzName}
                  </h3>
                  <p className="text-xs text-amber-500 font-medium">{mentor.user.headline || 'Beverage Expert'}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <MapPin size={10} /> {mentor.user.city || 'Global'}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-2">
                  <Clock size={12} /> {mentor.experienceYears || 0} years experience
                </div>
                <p className="text-sm text-gray-300 line-clamp-3 mb-3">{mentor.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.expertise.map((exp: string) => (
                    <span key={exp} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded-md">{exp}</span>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <div className="text-sm font-black text-white">${mentor.pricingPerSession} <span className="text-xs text-gray-500 font-normal">/ session</span></div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" /> {mentor.rating.toFixed(1)} ({mentor.sessionCount} sessions)
                  </div>
                </div>
                <button
                  onClick={() => setShowBookModal(mentor)}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Mock Checkout Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#110a02] border border-amber-500/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-bold text-lg text-white">Book Mentorship</h3>
              <button onClick={() => setShowBookModal(null)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-5 bg-white/[0.02] border-b border-white/5 flex items-center gap-3">
               <img src={showBookModal.user.avatar} className="w-10 h-10 rounded-full" alt="" />
               <div>
                 <div className="font-bold text-white text-sm">Session with {showBookModal.user.buzzName}</div>
                 <div className="text-amber-500 text-xs font-medium">${showBookModal.pricingPerSession} USD</div>
               </div>
            </div>

            <form onSubmit={handleBookSession} className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Select Date & Time</label>
                <input type="datetime-local" value={bookDate} onChange={e => setBookDate(e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50 [color-scheme:dark]" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">What do you want to learn? (Optional)</label>
                <textarea value={bookNotes} onChange={e => setBookNotes(e.target.value)} rows={3} placeholder="I want to learn about..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50 resize-none" />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">1x Mentorship Session</span>
                  <span className="text-white">${showBookModal.pricingPerSession}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">Platform Fee</span>
                  <span className="text-white">$2.00</span>
                </div>
                <div className="flex justify-between font-bold border-t border-amber-500/20 pt-3">
                  <span className="text-amber-500">Total</span>
                  <span className="text-white">${showBookModal.pricingPerSession + 2} USD</span>
                </div>
              </div>

              <button type="submit" disabled={isBooking || !bookDate} className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-bold transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
                {isBooking ? <Loader2 size={18} className="animate-spin" /> : 'Pay & Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Become Mentor Modal */}
      {showBecomeMentor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#110a02] border border-amber-500/20 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-bold text-lg text-white">Register as a Mentor</h3>
              <button onClick={() => setShowBecomeMentor(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleRegisterMentor} className="p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Years of Experience</label>
                <input type="number" value={mentorForm.experienceYears} onChange={e => setMentorForm(p => ({ ...p, experienceYears: e.target.value }))} required min="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Expertise (comma separated)</label>
                <input type="text" value={expertiseInput} onChange={e => setExpertiseInput(e.target.value)} required placeholder="e.g. Mixology, Bar Management, Wine Tasting"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Pricing per Session (USD)</label>
                <input type="number" value={mentorForm.pricingPerSession} onChange={e => setMentorForm(p => ({ ...p, pricingPerSession: e.target.value }))} required min="5"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">Mentor Bio</label>
                <textarea value={mentorForm.bio} onChange={e => setMentorForm(p => ({ ...p, bio: e.target.value }))} required rows={3} placeholder="Tell mentees about your background..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/50 resize-none" />
              </div>

              <div className="flex justify-end gap-3 mt-2 border-t border-white/10 pt-4">
                <button type="button" onClick={() => setShowBecomeMentor(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isRegistering} className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isRegistering ? <Loader2 size={16} className="animate-spin" /> : 'Become Mentor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
