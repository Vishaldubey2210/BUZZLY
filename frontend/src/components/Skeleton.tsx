import React from 'react';

export const PostSkeleton: React.FC = () => (
  <div className="bg-[#110a02] border border-white/5 rounded-xl p-4 animate-pulse">
    <div className="flex gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/10 rounded-full w-1/3" />
        <div className="h-2.5 bg-white/5 rounded-full w-1/4" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-white/10 rounded-full w-full" />
      <div className="h-3 bg-white/10 rounded-full w-5/6" />
      <div className="h-3 bg-white/5 rounded-full w-3/4" />
    </div>
    <div className="flex gap-6 pt-3 border-t border-white/5">
      <div className="h-4 bg-white/10 rounded-full w-12" />
      <div className="h-4 bg-white/10 rounded-full w-12" />
      <div className="h-4 bg-white/10 rounded-full w-12" />
    </div>
  </div>
);

export const UserCardSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 bg-[#110a02] p-4 border border-white/5 rounded-xl animate-pulse">
    <div className="w-14 h-14 rounded-full bg-white/10 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-white/10 rounded-full w-1/2" />
      <div className="h-2.5 bg-white/5 rounded-full w-1/3" />
      <div className="h-2.5 bg-amber-500/20 rounded-full w-1/4" />
    </div>
    <div className="w-16 h-8 rounded-full bg-white/5" />
  </div>
);

export const EventSkeleton: React.FC = () => (
  <div className="bg-[#110a02] border border-white/5 rounded-xl overflow-hidden animate-pulse">
    <div className="h-40 bg-white/10" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-white/10 rounded-full w-3/4" />
      <div className="h-3 bg-white/5 rounded-full w-full" />
      <div className="h-3 bg-white/5 rounded-full w-5/6" />
      <div className="flex justify-between items-center mt-4">
        <div className="h-3 bg-white/10 rounded-full w-1/3" />
        <div className="h-8 bg-white/10 rounded-full w-20" />
      </div>
    </div>
  </div>
);

export const LeaderboardRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl animate-pulse">
    <div className="w-8 h-8 bg-white/10 rounded-full flex-shrink-0" />
    <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-white/10 rounded-full w-1/3" />
      <div className="h-2.5 bg-white/5 rounded-full w-1/4" />
    </div>
    <div className="h-4 bg-amber-500/20 rounded-full w-16" />
  </div>
);
