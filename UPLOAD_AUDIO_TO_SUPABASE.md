# Upload Audio Files to Supabase Storage

## Instructions:

1. **Login to Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your CIRVIA project

2. **Create Storage Bucket**
   - Click "Storage" in left sidebar
   - Click "New bucket"
   - Name: `audio-materials`
   - Public bucket: ✅ YES (check this!)
   - Click "Create bucket"

3. **Upload Audio Files**
   - Click on `audio-materials` bucket
   - Click "Upload files"
   - Select these 4 files from `public/audio/`:
     - audio-konsep-dasar-listrik.mp3
     - modul-paralel.mp3
     - modul-pengantar.mp3
     - modul-seri.mp3
   - Click "Upload"

4. **Get Public URLs**
   After upload, each file will have a public URL like:
   ```
   https://[your-project-id].supabase.co/storage/v1/object/public/audio-materials/modul-pengantar.mp3
   ```

5. **Copy Your Project URL**
   - In Supabase dashboard, go to Settings > API
   - Copy the "Project URL" (e.g., https://xxxxx.supabase.co)
   - Save it, we'll use it in the next step

## After uploading, tell me your Supabase project URL and I'll update the code.
