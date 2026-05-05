-- Allow public access to read files
CREATE POLICY "Public Access" ON storage.objects FOR
SELECT USING (bucket_id = 'resources');

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'resources' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE
USING (
  bucket_id = 'resources' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);