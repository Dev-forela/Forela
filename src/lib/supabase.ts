import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Profile = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  preferences: {
    dark_mode: boolean;
    notifications_enabled: boolean;
    health_integrations: {
      apple_health: boolean;
      google_fit: boolean;
    };
  };
};

export type JournalEntry = {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  type: 'text' | 'audio';
  audio_url?: string;
  mood?: string;
  tags?: string[];
};

// Helper functions for common operations
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data as Profile;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Profile;
};

export const createJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert(entry)
    .select()
    .single();
  
  if (error) throw error;
  return data as JournalEntry;
};

export const getJournalEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as JournalEntry[];
};

export const uploadAudioFile = async (userId: string, audioBlob: Blob) => {
  const fileName = `${userId}/${Date.now()}.wav`;
  const { data, error } = await supabase.storage
    .from('audio-entries')
    .upload(fileName, audioBlob, {
      contentType: 'audio/wav',
      cacheControl: '3600'
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('audio-entries')
    .getPublicUrl(fileName);
  
  return publicUrl;
}; 