export interface User {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  dob: string;
}

export interface Activity {
  id: string;
  time: string;
  name: string;
  image?: string;
  completed: boolean;
  type?: 'food' | 'movement' | 'mentalHealth' | 'sleep' | 'recommendation';
  durationOptions?: string[];
  activityOptions?: string[];
  details?: string;
  recipe?: Recipe;
}

export interface Recipe {
  title: string;
  tags?: string[];
  description: string;
  ingredients: string[];
  instructions: string[];
  whyItWorks?: string;
}

export interface CareSection {
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  textColorClass: string;
  bgColorLightClass: string;
  colorHex: string;
  baseColorName: string;
  items: Activity[];
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  type: 'text' | 'audio';
  mood?: 'Very Poor' | 'Bad' | 'Average' | 'Good' | 'Excellent';
  content: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'companion';
  text: string;
}

export interface ChatSession {
  id: string;
  title: string;
  startTime: number;
  durationMinutes: number;
  messages: ChatMessage[];
}

export interface AppSettings {
  allowNotifications: boolean;
  allowSms: boolean;
  appleHealthConnected: boolean;
  ouraConnected: boolean;
  fitbitConnected: boolean;
  garminConnected: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  navIcon?: React.ReactNode;
  actionKey?: string;
  isSelectable?: boolean;
  viewId: string;
}

export interface MoodOption {
  label: 'Very Poor' | 'Bad' | 'Average' | 'Good' | 'Excellent';
  color: string;
  icon: React.ReactNode;
}

export interface BodyPart {
  id: string;
  name: string;
  cx: number;
  cy: number;
  r: number;
  issues: Issue[];
}

export interface Issue {
  id: string;
  label: string;
} 