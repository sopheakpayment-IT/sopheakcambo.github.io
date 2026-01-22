
export interface ColorPalette {
  name: string;
  colors: string[];
}

export interface VisionData {
  title: string;
  description: string;
  keywords: string[];
  palette: ColorPalette;
}

export interface ProfilePersona {
  name: string;
  bio: string;
  vibe: string;
  style: string;
  accentColor: string;
  images: string[];
}

export type AppMode = 'moodboard' | 'studio';

export interface AppState {
  isGenerating: boolean;
  mode: AppMode;
  vision: VisionData | null;
  imageUrl: string | null;
  profile: ProfilePersona | null;
  error: string | null;
  // Fixed: Removed duplicate selectedImage property
  selectedImage: string | null;
}
