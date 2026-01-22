
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ControlPanel } from './components/ControlPanel';
import { VisionDisplay } from './components/VisionDisplay';
import { ProfileStudio } from './components/ProfileStudio';
import { FloatingProfile } from './components/FloatingProfile';
import { VisionData, AppMode, ProfilePersona } from './types';
import { generateVisionMetadata, generateVisionImage, generateVisionAudio, generateProfileMetadata, editImage } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mode, setMode] = useState<AppMode>('moodboard');
  const [vision, setVision] = useState<VisionData | null>(null);
  const [profile, setProfile] = useState<ProfilePersona | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string, base64Image: string | null) => {
    setIsLoading(true);
    setError(null);
    
    if (mode === 'moodboard') setVision(null);
    if (mode === 'studio') setProfile(null);
    setImageUrl(null);
    setAudioData(null);

    try {
      if (mode === 'moodboard') {
        const visionMetadata = await generateVisionMetadata(prompt, base64Image);
        setVision(visionMetadata);

        const [img, audio] = await Promise.all([
          generateVisionImage(prompt, visionMetadata.title, "16:9", base64Image),
          generateVisionAudio(visionMetadata.description)
        ]);

        setImageUrl(img);
        setAudioData(audio);
      } else {
        const meta = await generateProfileMetadata(prompt, base64Image);
        const imgPromises = [
          generateVisionImage(`${prompt} close-up portrait, variation 1`, meta.style, "1:1", base64Image),
          generateVisionImage(`${prompt} close-up portrait, variation 2`, meta.style, "1:1", base64Image),
          generateVisionImage(`${prompt} close-up portrait, variation 3`, meta.style, "1:1", base64Image)
        ];

        const images = await Promise.all(imgPromises);
        setProfile({ ...meta, images });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMoodboardImage = async (editPrompt: string) => {
    if (!imageUrl) return;
    setIsEditing(true);
    setError(null);
    try {
      const editedBase64 = await editImage(imageUrl, editPrompt);
      setImageUrl(editedBase64);
    } catch (err: any) {
      setError("Failed to apply edit. " + (err.message || ''));
    } finally {
      setIsEditing(false);
    }
  };

  const handleEditProfileImage = async (editPrompt: string, index: number) => {
    if (!profile) return;
    setIsEditing(true);
    setError(null);
    try {
      const targetImage = profile.images[index];
      const editedBase64 = await editImage(targetImage, editPrompt);
      const newImages = [...profile.images];
      newImages[index] = editedBase64;
      setProfile({ ...profile, images: newImages });
    } catch (err: any) {
      setError("Failed to apply edit. " + (err.message || ''));
    } finally {
      setIsEditing(false);
    }
  };

  const jumpToStudio = () => {
    setMode('studio');
  };

  return (
    <Layout 
      mode={mode} 
      onModeChange={setMode} 
      activeProfile={profile}
    >
      <ControlPanel 
        onGenerate={handleGenerate} 
        isLoading={isLoading} 
      />
      
      {error && (
        <div className="max-w-3xl mx-auto mb-10 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
          <p className="font-medium">Update Failed</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      )}

      {!vision && !profile && !isLoading && !error && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40">
           <div className="glass p-8 rounded-3xl h-64 border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 rounded-full bg-slate-800 mb-4"></div>
             <p className="text-sm text-slate-500">{mode === 'moodboard' ? 'Visuals' : 'Identities'} will appear here</p>
           </div>
           <div className="glass p-8 rounded-3xl h-64 border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 rounded-full bg-slate-800 mb-4"></div>
             <p className="text-sm text-slate-500">{mode === 'moodboard' ? 'Palettes' : 'Auras'} will be synthesized</p>
           </div>
           <div className="glass p-8 rounded-3xl h-64 border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 rounded-full bg-slate-800 mb-4"></div>
             <p className="text-sm text-slate-500">{mode === 'moodboard' ? 'Narrative' : 'Persona'} description</p>
           </div>
        </div>
      )}

      {mode === 'moodboard' && vision && (
        <VisionDisplay 
          vision={vision} 
          imageUrl={imageUrl} 
          audioBase64={audioData} 
          onEditImage={handleEditMoodboardImage}
          isEditing={isEditing}
        />
      )}

      {mode === 'studio' && profile && (
        <ProfileStudio 
          profile={profile} 
          isLoading={isLoading} 
          onEditImage={handleEditProfileImage}
          isEditing={isEditing}
        />
      )}

      {profile && mode === 'moodboard' && (
        <FloatingProfile profile={profile} onJumpToStudio={jumpToStudio} />
      )}

      {isLoading && (
        <div className="max-w-3xl mx-auto text-center py-20 animate-pulse">
           <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8 blur-xl opacity-50"></div>
           <h2 className="text-2xl font-serif text-slate-400">
             {mode === 'moodboard' ? 'Synthesizing Atmosphere...' : 'Crafting Identity Variations...'}
           </h2>
           <p className="text-slate-600 mt-2">Connecting abstract neurons...</p>
        </div>
      )}
    </Layout>
  );
};

export default App;
