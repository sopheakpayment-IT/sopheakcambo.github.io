
import React, { useState, useEffect } from 'react';
import { ProfilePersona } from '../types';

interface ProfileStudioProps {
  profile: ProfilePersona;
  isLoading: boolean;
  onEditImage: (editPrompt: string, imageIndex: number) => Promise<void>;
  isEditing: boolean;
}

export const ProfileStudio: React.FC<ProfileStudioProps> = ({ 
  profile, 
  isLoading, 
  onEditImage, 
  isEditing 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editPrompt, setEditPrompt] = useState('');
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (profile.images.length > 1 && !isLoading && !isEditing && !showEdit) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % profile.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [profile.images, isLoading, isEditing, showEdit]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim() || isEditing) return;
    await onEditImage(editPrompt, currentIndex);
    setEditPrompt('');
    setShowEdit(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center">
        {/* Profile Picture Cycle Container */}
        <div className="relative group mb-12">
          {/* Aura Background Glow */}
          <div 
            className="absolute -inset-8 blur-[80px] opacity-30 rounded-full animate-pulse transition-colors duration-1000" 
            style={{ backgroundColor: profile.accentColor }}
          ></div>
          
          {/* Main Circular Image */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-white/10 p-2 glass shadow-2xl overflow-hidden">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              {profile.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${profile.name} variation ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => setShowEdit(!showEdit)}
            className="absolute top-0 right-0 p-3 rounded-full glass border border-white/20 hover:bg-white/10 transition-colors shadow-lg z-20 group/edit"
            title="Edit current photo with AI"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300 group-hover/edit:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Indicators / Cycle Switchers */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {profile.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowEdit(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-white' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        {showEdit && (
          <form onSubmit={handleEditSubmit} className="max-w-md w-full mb-8 glass p-4 rounded-2xl border border-indigo-500/30 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold ml-1">AI Photo Editor</label>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g., 'Make it look like a pencil sketch'"
                  className="flex-grow bg-transparent border-none outline-none text-white text-sm placeholder:text-slate-500"
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!editPrompt.trim() || isEditing}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Profile Details */}
        <div className="text-center space-y-4 max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-serif text-white">{profile.name}</h2>
          
          <div className="flex flex-wrap justify-center gap-2">
            <div className="inline-block px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-white/5 border border-white/10 text-slate-400">
              {profile.vibe}
            </div>
            <div className="inline-block px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              {profile.style}
            </div>
          </div>

          <p className="text-xl md:text-2xl text-slate-300 font-light italic leading-relaxed">
            "{profile.bio}"
          </p>

          <div className="pt-10 grid grid-cols-2 gap-4">
             <button className="flex-1 glass py-4 px-8 rounded-2xl hover:bg-white/5 transition-all text-sm font-medium border border-white/10">
               Save Persona
             </button>
             <button 
              className="flex-1 py-4 px-8 rounded-2xl bg-white text-black hover:bg-slate-200 transition-all text-sm font-bold"
              style={{ boxShadow: `0 10px 30px -10px ${profile.accentColor}80` }}
             >
               Export Cycle (GIF)
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
