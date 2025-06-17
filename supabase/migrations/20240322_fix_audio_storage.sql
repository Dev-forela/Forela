-- Fix audio storage bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'audio-entries';

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can read their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own audio files" ON storage.objects;

-- Create new policies for public bucket with user-specific folders
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