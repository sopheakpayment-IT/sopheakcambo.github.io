
import React, { useState, useRef } from 'react';

interface ControlPanelProps {
  onGenerate: (prompt: string, image: string | null) => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onGenerate(input, selectedImage);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="max-w-3xl mx-auto mb-16">
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
          Breathe Life into Abstract Ideas
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Enter a feeling, a vibe, or upload a reference. Aura will synthesize a complete visual and sensory mood board.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass rounded-2xl p-2 flex flex-col shadow-2xl overflow-hidden">
          
          {selectedImage && (
            <div className="px-4 py-2 flex items-center gap-3 border-b border-white/5 bg-white/5">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 group/img">
                <img src={selectedImage} alt="Reference" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={clearImage}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <span className="text-xs text-slate-400 font-medium">Reference image attached</span>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Cyberpunk tea ceremony in Kyoto..."
              className="flex-grow bg-transparent border-none outline-none px-6 py-4 text-white text-lg placeholder:text-slate-600"
              disabled={isLoading}
            />
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-4 text-slate-400 hover:text-white transition-colors"
              title="Upload reference picture"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Thinking...
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
