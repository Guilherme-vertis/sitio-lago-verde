-- Criar tabela para armazenar fotos das casas
CREATE TABLE IF NOT EXISTS house_photos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  house_id BIGINT NOT NULL,
  photo_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT house_photos_house_id_fkey FOREIGN KEY (house_id) REFERENCES houses (id) ON DELETE CASCADE
);

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_house_photos_house_id ON house_photos(house_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE house_photos ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública
CREATE POLICY "Allow public read" ON house_photos
  FOR SELECT USING (true);

-- Política para inserção (requer autenticação)
CREATE POLICY "Allow authenticated insert" ON house_photos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para deleção (requer autenticação)
CREATE POLICY "Allow authenticated delete" ON house_photos
  FOR DELETE USING (auth.role() = 'authenticated');

-- Criar bucket no Storage (se não existir)
-- Nota: Isso precisa ser feito manualmente no console do Supabase
-- Nome do bucket: house-photos
-- Políticas públicas de read no bucket
