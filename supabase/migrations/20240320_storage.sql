-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-entries', 'audio-entries', false);

-- Create policy to allow authenticated users to upload their own audio files
CREATE POLICY "Users can upload their own audio files"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'audio-entries' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Create policy to allow users to read their own audio files
CREATE POLICY "Users can read their own audio files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'audio-entries' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Create policy to allow users to update their own audio files
CREATE POLICY "Users can update their own audio files"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'audio-entries' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Create policy to allow users to delete their own audio files
CREATE POLICY "Users can delete their own audio files"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'audio-entries' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    ); 