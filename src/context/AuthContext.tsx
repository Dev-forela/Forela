import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

interface SignUpData {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  primaryCondition: 'Hashimotos' | 'Endometriosis' | 'Adenomyosis' | 'Other Autoimmune';
}

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  avatar_url?: string;
  preferences: {
    dark_mode: boolean;
    notifications_enabled: boolean;
    health_integrations: {
      apple_health: boolean;
      google_fit: boolean;
    };
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: SignUpData) => {
    try {
      console.log('Starting sign up process for:', email);
      
      // First, try to sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('No user returned from sign up');
      }

      console.log('User created successfully:', authData.user.id);

      // Check if we need to confirm email
      if (!authData.session) {
        throw new Error('Please check your email to confirm your account before signing in.');
      }

      // Create profile
      console.log('Creating profile for user:', authData.user.id);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          first_name: userData.firstName,
          middle_name: userData.middleName,
          last_name: userData.lastName,
          date_of_birth: userData.dateOfBirth,
          email: email,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      console.log('Profile created successfully');

      // Create medical information
      console.log('Creating medical information for user:', authData.user.id);
      const { error: medicalError } = await supabase
        .from('medical_information')
        .insert({
          user_id: authData.user.id,
          primary_condition: userData.primaryCondition,
        });

      if (medicalError) {
        console.error('Medical information creation error:', medicalError);
        throw new Error(`Medical information creation failed: ${medicalError.message}`);
      }

      console.log('Medical information created successfully');
      console.log('Sign up process completed successfully');

    } catch (error) {
      console.error('Error in signUp function:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before signing in.');
        } else {
          throw new Error(`Sign in failed: ${error.message}`);
        }
      }

      if (!data.user) {
        throw new Error('No user data returned from sign in');
      }

      console.log('Sign in successful for user:', data.user.id);

    } catch (error) {
      console.error('Error in signIn function:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 