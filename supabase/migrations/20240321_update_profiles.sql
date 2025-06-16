-- Add additional fields to profiles table for user information
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the full_name column to be computed from first_name and last_name
-- We'll handle this in the application code for now

-- Create a function to get user's display name
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