
import React, { useRef, useState } from 'react';
import { VisionData } from '../types';

interface VisionDisplayProps {
  vision: VisionData;
  imageUrl: string | null;
  audioBase64: string | null;
  onEditImage: (editPrompt: string) => Promise<void>;
  isEditing: boolean;
}

export const VisionDisplay: React.FC<VisionDisplayProps> = ({ 
  vision, 
  imageUrl, 
  audioBase64, 
  onEditImage, 
  isEditing 
}) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${vision.title.replace(/\s+/g, '_')}_AuraVision.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim() || isEditing) return;
    await onEditImage(editPrompt);
    setEditPrompt('');
    setShowEdit(false);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Visual Content */}
      <div className="lg:col-span-8 space-y-8">
        <div className="relative aspect-video rounded-3xl overflow-hidden glass group shadow-2xl border border-white/10">
          {imageUrl ? (
            <img src={imageUrl} alt={vision.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 animate-pulse">
              <span className="text-slate-600">Visualizing atmosphere...</span>
            </div>
          )}
          
          {isEditing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-indigo-400 font-medium animate-pulse">Applying Magic...</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={() => setShowEdit(!showEdit)}
              className="p-3 rounded-full glass hover:bg-white/10 transition-colors border border-white/20 group/edit"
              title="Edit image with AI"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300 group-hover/edit:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          <div className="absolute bottom-8 left-8 right-8">
             <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{vision.title}</h2>
             <div className="flex flex-wrap gap-2">
               {vision.keywords.map((kw, i) => (
                 <span key={i} className="text-[10px] uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                   {kw}
                 </span>
               ))}
             </div>
          </div>
        </div>

        {showEdit && (
          <form onSubmit={handleEditSubmit} className="relative glass p-4 rounded-2xl border border-indigo-500/30 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Describe your change (e.g., 'Add a retro filter' or 'Make it neon')"
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
          </form>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {vision.palette.colors.map((color, idx) => (
             <div key={idx} className="group relative">
               <div 
                 className="h-24 rounded-2xl shadow-lg border border-white/5 transition-transform group-hover:-translate-y-1" 
                 style={{ backgroundColor: color }}
               />
               <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                 {color}
               </span>
             </div>
           ))}
        </div>
      </div>

      {/* Narrative & Info */}
      <div className="lg:col-span-4 space-y-8">
        <div className="glass p-8 rounded-3xl border border-white/10 h-full flex flex-col">
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Atmosphere Narrative</h3>
            <p className="text-slate-300 leading-relaxed font-light text-lg italic">
              "{vision.description}"
            </p>
          </div>

          <div className="mt-auto space-y-6">
             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Auditory Impression</h4>
                  <p className="text-xs text-slate-500">AI Narrative Voiceover</p>
                </div>
                <button 
                  disabled={!audioBase64}
                  className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
             </div>

             <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Palette: {vision.palette.name}</h4>
                <div className="flex gap-2">
                  {vision.palette.colors.map((c, i) => (
                    <div key={i} className="w-full h-2 rounded-full" style={{ backgroundColor: c }}></div>
                  ))}
                </div>
             </div>

             <button 
              onClick={handleDownload}
              className="w-full py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
             >
               Download Mood Board
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
