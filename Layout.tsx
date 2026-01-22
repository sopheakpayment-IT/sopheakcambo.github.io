
import React from 'react';
import { AppMode, ProfilePersona } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  activeProfile?: ProfilePersona | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, mode, onModeChange, activeProfile }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-gradient"></div>
              <span className="text-xl font-bold tracking-tight">AURA<span className="font-light text-slate-400">VISION</span></span>
            </div>
            
            {activeProfile && (
              <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10">
                <img 
                  src={activeProfile.images[0]} 
                  alt="Current Profile" 
                  className="w-6 h-6 rounded-full border border-white/20 object-cover"
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {activeProfile.name}
                </span>
              </div>
            )}
          </div>

          <nav className="hidden md:flex gap-4 p-1 rounded-full bg-white/5 border border-white/10">
            <button 
              onClick={() => onModeChange('moodboard')}
              className={`px-6 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === 'moodboard' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Mood Board
            </button>
            <button 
              onClick={() => onModeChange('studio')}
              className={`px-6 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === 'studio' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Studio
            </button>
          </nav>
          
          <button className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-slate-200 transition-colors uppercase tracking-widest">
            Unlock Pro
          </button>
        </div>
      </header>
      <main className="flex-grow pt-24 pb-12 px-6">
        {children}
      </main>
      <footer className="py-8 px-6 border-t border-white/5 text-center text-slate-500 text-xs">
        <p>&copy; 2024 Aura Vision AI. Crafted for the curious.</p>
      </footer>
    </div>
  );
};
