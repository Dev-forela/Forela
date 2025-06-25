-- =====================================
-- FORELA BUSINESS SUPABASE MIGRATION
-- =====================================
-- This script contains all database migrations for the business Supabase instance
-- Execute this in the Supabase SQL Editor for your business account

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for medical conditions
CREATE TYPE medical_condition AS ENUM (
    'Hashimotos',
    'Endometriosis',
    'Adenomyosis',
    'Other Autoimmune'
);

-- =====================================
-- 1. PROFILES TABLE
-- =====================================
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    phone_number TEXT,
    email TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{
        "dark_mode": false,
        "notifications_enabled": true,
        "health_integrations": {
            "apple_health": false,
            "google_fit": false
        }
    }'::jsonb NOT NULL,
    UNIQUE(user_id)
);

-- =====================================
-- 2. JOURNAL ENTRIES TABLE
-- =====================================
CREATE TABLE journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('text', 'audio')) NOT NULL,
    audio_url TEXT,
    mood TEXT,
    tags TEXT[] DEFAULT '{}'::text[],
    CONSTRAINT valid_audio_entry CHECK (
        (type = 'audio' AND audio_url IS NOT NULL) OR
        (type = 'text' AND audio_url IS NULL)
    )
);

-- =====================================
-- 3. MEDICAL INFORMATION TABLE
-- =====================================
CREATE TABLE medical_information (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    primary_condition medical_condition NOT NULL,
    symptoms TEXT[] DEFAULT '{}'::text[],
    pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
    mood_trends JSONB DEFAULT '[]'::jsonb,
    activity_changes JSONB DEFAULT '[]'::jsonb,
    UNIQUE(user_id)
);

-- =====================================
-- 4. AI COMPANION INTERACTIONS TABLE
-- =====================================
CREATE TABLE ai_companion_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    interaction_type TEXT NOT NULL,
    user_input TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context_data JSONB DEFAULT '{}'::jsonb
);

-- =====================================
-- 5. HEALTH INTEGRATION SETTINGS TABLE
-- =====================================
CREATE TABLE health_integration_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    apple_health_enabled BOOLEAN DEFAULT false,
    apple_health_permissions JSONB DEFAULT '{
        "steps": false,
        "heart_rate": false,
        "sleep": false,
        "workouts": false,
        "mindfulness": false,
        "body_measurements": false,
        "nutrition": false
    }'::jsonb,
    apple_health_last_sync TIMESTAMP WITH TIME ZONE,
    oura_enabled BOOLEAN DEFAULT false,
    oura_access_token TEXT,
    oura_refresh_token TEXT,
    oura_permissions JSONB DEFAULT '{
        "personal_info": false,
        "daily_sleep": false,
        "daily_activity": false,
        "daily_readiness": false,
        "heart_rate": false,
        "workouts": false,
        "sessions": false,
        "tags": false
    }'::jsonb,
    oura_last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- =====================================
-- 6. HEALTH DATA TABLE
-- =====================================
CREATE TABLE health_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    
    -- Activity & Movement
    steps INTEGER,
    distance_walked DECIMAL(10,2), -- in kilometers
    flights_climbed INTEGER,
    active_energy_burned DECIMAL(10,2), -- in calories
    resting_energy_burned DECIMAL(10,2), -- in calories
    exercise_minutes INTEGER,
    stand_hours INTEGER,
    
    -- Heart Rate
    heart_rate_resting INTEGER,
    heart_rate_average INTEGER,
    heart_rate_max INTEGER,
    heart_rate_variability DECIMAL(10,2), -- in milliseconds
    
    -- Sleep
    sleep_duration DECIMAL(5,2), -- in hours
    sleep_efficiency DECIMAL(5,2), -- percentage
    sleep_deep DECIMAL(5,2), -- in hours
    sleep_rem DECIMAL(5,2), -- in hours
    sleep_light DECIMAL(5,2), -- in hours
    sleep_awake DECIMAL(5,2), -- in hours
    sleep_score INTEGER, -- 0-100
    time_in_bed DECIMAL(5,2), -- in hours
    
    -- Body Measurements
    weight DECIMAL(6,2), -- in kg
    height DECIMAL(5,2), -- in cm
    body_mass_index DECIMAL(4,2),
    body_fat_percentage DECIMAL(5,2),
    lean_body_mass DECIMAL(6,2), -- in kg
    
    -- Vital Signs
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    respiratory_rate INTEGER,
    oxygen_saturation DECIMAL(5,2), -- percentage
    body_temperature DECIMAL(4,2), -- in celsius
    
    -- Activity Scores (Oura specific)
    activity_score INTEGER, -- 0-100
    readiness_score INTEGER, -- 0-100
    
    -- Nutrition (basic tracking)
    calories_consumed INTEGER,
    water_intake DECIMAL(6,2), -- in liters
    
    -- Workouts (JSON array of workout sessions)
    workouts JSONB,
    
    -- Mindfulness
    mindfulness_duration INTEGER, -- in minutes
    mindfulness_sessions INTEGER,
    
    -- Data source tracking
    source TEXT CHECK (source IN ('apple_health', 'oura', 'manual')) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one record per user per date per source
    UNIQUE(user_id, date, source)
);

-- =====================================
-- 7. CREATE INDEXES
-- =====================================
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_health_integration_settings_user_id ON health_integration_settings(user_id);
CREATE INDEX idx_health_data_user_id ON health_data(user_id);
CREATE INDEX idx_health_data_date ON health_data(date DESC);
CREATE INDEX idx_health_data_user_date ON health_data(user_id, date DESC);

-- =====================================
-- 8. CREATE FUNCTIONS
-- =====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to get user's display name
CREATE OR REPLACE FUNCTION get_user_display_name(profile_row profiles)
RETURNS TEXT AS $$
BEGIN
    IF profile_row.first_name IS NOT NULL AND profile_row.last_name IS NOT NULL THEN
        RETURN profile_row.first_name || ' ' || profile_row.last_name;
    ELSIF profile_row.full_name IS NOT NULL THEN
        RETURN profile_row.full_name;
    ELSIF profile_row.first_name IS NOT NULL THEN
        RETURN profile_row.first_name;
    ELSE
        RETURN 'User';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update medical information when profile changes
CREATE OR REPLACE FUNCTION update_medical_info()
RETURNS TRIGGER AS $$
BEGIN
    -- Update medical information based on profile changes
    -- This is a placeholder for the actual logic we'll implement
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to analyze user data for AI companion
CREATE OR REPLACE FUNCTION analyze_user_data(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    analysis JSONB;
BEGIN
    -- This is a placeholder for the actual analysis logic
    -- We'll implement this when we build out the AI companion
    RETURN '{}'::jsonb;
END;
$$ LANGUAGE plpgsql;

-- =====================================
-- 9. CREATE TRIGGERS
-- =====================================

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_integration_settings_updated_at
    BEFORE UPDATE ON health_integration_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_data_updated_at
    BEFORE UPDATE ON health_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER profile_medical_update
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_medical_info();

-- =====================================
-- 10. ENABLE ROW LEVEL SECURITY
-- =====================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_companion_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

-- =====================================
-- 11. CREATE RLS POLICIES
-- =====================================

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can view their own journal entries"
    ON journal_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
    ON journal_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
    ON journal_entries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
    ON journal_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Medical information policies
CREATE POLICY "Users can view their own medical information"
    ON medical_information FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical information"
    ON medical_information FOR UPDATE
    USING (auth.uid() = user_id);

-- AI companion interactions policies
CREATE POLICY "Users can view their own AI interactions"
    ON ai_companion_interactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI interactions"
    ON ai_companion_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Health integration settings policies
CREATE POLICY "Users can view their own health integration settings"
    ON health_integration_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health integration settings"
    ON health_integration_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health integration settings"
    ON health_integration_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Health data policies
CREATE POLICY "Users can view their own health data"
    ON health_data FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health data"
    ON health_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health data"
    ON health_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health data"
    ON health_data FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================
-- 12. STORAGE SETUP
-- =====================================

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-entries', 'audio-entries', true);

-- Create storage policies for audio files
CREATE POLICY "Anyone can view audio files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'audio-entries');

CREATE POLICY "Authenticated users can upload their own audio files"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'audio-entries' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update their own audio files"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'audio-entries' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own audio files"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'audio-entries' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- =====================================
-- MIGRATION COMPLETE
-- =====================================
-- Your business Supabase instance is now set up with:
-- ✅ All database tables and relationships
-- ✅ Row Level Security policies
-- ✅ Storage bucket for audio files
-- ✅ All functions and triggers
-- ✅ Proper indexes for performance
-- 
-- Next steps:
-- 1. Update your environment variables to point to the new Supabase instance
-- 2. Test the application with the new database
-- 3. Migrate any existing user data if needed 