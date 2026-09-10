-- Add photo_url column to houses table
ALTER TABLE public.houses
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS houses_photo_url_idx ON public.houses(photo_url);
