-- Supabase Database Setup für Link Manager
-- Führe diese SQL-Befehle in deinem Supabase SQL Editor aus

-- 1. Erstelle Tabelle für Links mit JSONB-Speicherung
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data JSONB NOT NULL,
  search_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Erstelle Tabelle für Folders mit JSONB-Speicherung
CREATE TABLE IF NOT EXISTS folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Erstelle Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_links_search_content ON links USING GIN (to_tsvector('german', search_content));
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_folders_created_at ON folders (created_at DESC);

-- 4. Erstelle eine Funktion für Full-Text Search
CREATE OR REPLACE FUNCTION search_links_fulltext(search_query TEXT)
RETURNS TABLE (
  id UUID,
  data JSONB,
  search_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.data,
    l.search_content,
    l.created_at,
    l.updated_at,
    ts_rank(to_tsvector('german', l.search_content), plainto_tsquery('german', search_query)) as rank
  FROM links l
  WHERE to_tsvector('german', l.search_content) @@ plainto_tsquery('german', search_query)
  ORDER BY rank DESC, l.created_at DESC;
END;
$$;

-- 5. Aktiviere Row Level Security (RLS)
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- 6. Erstelle Policies für anonymen Zugriff (für Entwicklung)
-- ACHTUNG: In Produktion solltest du Authentication einrichten!
CREATE POLICY "Allow anonymous read access on links" ON links
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous write access on links" ON links
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access on links" ON links
  FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete access on links" ON links
  FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access on folders" ON folders
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous write access on folders" ON folders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access on folders" ON folders
  FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete access on folders" ON folders
  FOR DELETE USING (true);

-- 7. Erstelle Trigger für automatische updated_at Aktualisierung
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_links_updated_at 
  BEFORE UPDATE ON links 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at 
  BEFORE UPDATE ON folders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Erstelle Test-Daten (optional)
INSERT INTO folders (data) VALUES 
  ('{"name": "Entwicklung", "color": "#3B82F6"}'),
  ('{"name": "Design", "color": "#EF4444"}'),
  ('{"name": "Persönlich", "color": "#10B981"}');

INSERT INTO links (data, search_content) VALUES 
  (
    '{"title": "React Documentation", "url": "https://react.dev", "description": "Official React documentation", "labels": ["react", "javascript", "frontend"], "folderId": null}',
    'react documentation official react documentation react javascript frontend'
  ),
  (
    '{"title": "Supabase Docs", "url": "https://supabase.com/docs", "description": "Supabase documentation and guides", "labels": ["supabase", "database", "backend"], "folderId": null}',
    'supabase docs supabase documentation and guides supabase database backend'
  );
