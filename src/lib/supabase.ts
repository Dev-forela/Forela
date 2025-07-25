import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type UserMetadata = {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  phone_number?: string;
  full_name?: string;
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
export const getUserMetadata = (user: any): UserMetadata => {
  return user?.user_metadata || {};
};

export const updateUserMetadata = async (updates: UserMetadata) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });
  
  if (error) throw error;
  return data.user;
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

// Get user's display name from auth metadata
export const getUserDisplayName = (user: any): string => {
  if (!user) return 'User';
  
  const metadata = getUserMetadata(user);
  
  if (metadata.first_name && metadata.last_name) {
    return `${metadata.first_name} ${metadata.last_name}`;
  } else if (metadata.full_name) {
    return metadata.full_name;
  } else if (metadata.first_name) {
    return metadata.first_name;
  }
  
  return 'User';
};

// Get user's first name from auth metadata
export const getUserFirstName = (user: any): string => {
  if (!user) return 'there';
  
  const metadata = getUserMetadata(user);
  
  if (metadata.first_name) {
    return metadata.first_name;
  } else if (metadata.full_name) {
    return metadata.full_name.split(' ')[0];
  }
  
  return 'there';
};

// Get greeting based on time of day
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

// Format member since date
export const formatMemberSince = (createdAt: string): string => {
  const date = new Date(createdAt);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}; 