
import React from 'react';
import { ProfilePersona } from '../types';

interface FloatingProfileProps {
  profile: ProfilePersona;
  onJumpToStudio: () => void;
}

export const FloatingProfile: React.FC<FloatingProfileProps> = ({ profile, onJumpToStudio }) => {
  return (
    <div 
      onClick={onJumpToStudio}
      className="fixed bottom-8 right-8 z-40 group cursor-pointer"
    >
      <div 
        className="absolute -inset-4 blur-2xl opacity-20 rounded-full transition-all duration-500 group-hover:opacity-40"
        style={{ backgroundColor: profile.accentColor }}
      ></div>
      
      <div className="relative glass p-4 pr-6 rounded-full flex items-center gap-4 shadow-2xl border border-white/10 group-hover:-translate-y-1 transition-transform">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
          <img src={profile.images[0]} alt={profile.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white leading-none mb-1">{profile.name}</h4>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">{profile.vibe}</p>
        </div>
      </div>
    </div>
  );
};
