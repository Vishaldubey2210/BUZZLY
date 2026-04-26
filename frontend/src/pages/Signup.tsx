import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AtSign, Loader2 } from 'lucide-react';

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    buzzName: '',
    handle: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(formData);
    } catch (err: any) {
      let errorMsg = 'Failed to create account';
      if (err.response?.data?.errors) {
        errorMsg = err.response.data.errors.map((e: any) => e.message).join(', ');
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="card p-8 shadow-2xl relative z-10 w-full animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center">Join Buzzly</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="space-y-1">
          <label className="text-sm text-gray-400 font-medium">Display Name (BuzzName)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <User size={18} />
            </div>
            <input
              type="text"
              name="buzzName"
              required
              className="input pl-10 h-11"
              placeholder="e.g. CraftBeer King"
              value={formData.buzzName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-400 font-medium">Username Handle</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <AtSign size={18} />
            </div>
            <input
              type="text"
              name="handle"
              required
              className="input pl-10 h-11"
              placeholder="craftbeer_king"
              value={formData.handle}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-400 font-medium">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              required
              className="input pl-10 h-11"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-400 font-medium">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Lock size={18} />
            </div>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="input pl-10 h-11"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary w-full h-11 mt-6 text-[15px]"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Already part of the culture?{' '}
        <Link to="/login" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Signup;
