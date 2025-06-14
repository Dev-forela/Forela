-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for medical conditions
CREATE TYPE medical_condition AS ENUM (
    'Hashimotos',
    'Endometriosis',
    'Adenomyosis',
    'Other Autoimmune'
);

-- Update profiles table with additional fields
ALTER TABLE profiles
ADD COLUMN first_name TEXT NOT NULL,
ADD COLUMN middle_name TEXT,
ADD COLUMN last_name TEXT NOT NULL,
ADD COLUMN date_of_birth DATE NOT NULL,
ADD COLUMN email TEXT NOT NULL UNIQUE,
ADD CONSTRAINT age_check CHECK (
    date_of_birth <= CURRENT_DATE - INTERVAL '18 years'
);

-- Create medical information table
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

-- Create AI companion interactions table
CREATE TABLE ai_companion_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    interaction_type TEXT NOT NULL,
    user_input TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context_data JSONB DEFAULT '{}'::jsonb
);

-- Create function to update medical information when profile changes
CREATE OR REPLACE FUNCTION update_medical_info()
RETURNS TRIGGER AS $$
BEGIN
    -- Update medical information based on profile changes
    -- This is a placeholder for the actual logic we'll implement
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile updates
CREATE TRIGGER profile_medical_update
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_medical_info();

-- Create RLS policies for medical information
ALTER TABLE medical_information ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own medical information"
    ON medical_information FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical information"
    ON medical_information FOR UPDATE
    USING (auth.uid() = user_id);

-- Create RLS policies for AI companion interactions
ALTER TABLE ai_companion_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI interactions"
    ON ai_companion_interactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI interactions"
    ON ai_companion_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to analyze user data for AI companion
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