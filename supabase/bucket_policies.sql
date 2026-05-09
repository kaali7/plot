-- Allow authenticated users to read files from their own folder
-- (Previously this was fully public; hardened for better privacy)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Users can view own files" ON storage.objects FOR SELECT
USING (
  bucket_id = 'resources' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to upload files to their own folder
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'resources' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE
USING (
  bucket_id = 'resources' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);