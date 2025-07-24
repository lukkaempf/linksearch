import { supabase } from '@/supabase/config';
import type { Link } from '@/context/types';

const LINKS_TABLE = 'links';

/**
 * Fetch all links from Supabase.
 */
export async function fetchLinks(): Promise<Link[]> {
  const { data, error } = await supabase
    .from(LINKS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch links: ${error.message}`);
  }

  return data.map((row) => ({
    id: row.id,
    ...row.data,
    createdAt: new Date(row.created_at),
  })) as Link[];
}

/**
 * Create a new link in Supabase.
 */
export async function createLink(link: Omit<Link, 'id' | 'createdAt'>): Promise<void> {
  const now = new Date();
  
  // Erstelle Fulltext-Search-Content für bessere Suche
  const searchContent = [
    link.title,
    link.url,
    link.description || '',
    ...(link.labels || [])
  ].filter(Boolean).join(' ').toLowerCase();

  const { error } = await supabase
    .from(LINKS_TABLE)
    .insert({
      data: {
        ...link,
        createdAt: now,
      },
      search_content: searchContent,
      created_at: now.toISOString(),
    });

  if (error) {
    throw new Error(`Failed to create link: ${error.message}`);
  }
}

/**
 * Update an existing link by ID.
 */
export async function updateLink(id: string, data: Partial<Link>): Promise<void> {
  // Hole die aktuellen Daten
  const { data: current, error: fetchError } = await supabase
    .from(LINKS_TABLE)
    .select('data')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch current link: ${fetchError.message}`);
  }

  // Merge die Änderungen
  const updatedData = { ...current.data, ...data };
  
  // Aktualisiere Fulltext-Search-Content
  const searchContent = [
    updatedData.title,
    updatedData.url,
    updatedData.description || '',
    ...(updatedData.labels || [])
  ].filter(Boolean).join(' ').toLowerCase();

  const { error } = await supabase
    .from(LINKS_TABLE)
    .update({
      data: updatedData,
      search_content: searchContent,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update link: ${error.message}`);
  }
}

/**
 * Delete a link by ID.
 */
export async function deleteLink(id: string): Promise<void> {
  const { error } = await supabase
    .from(LINKS_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete link: ${error.message}`);
  }
}

/**
 * Search links using PostgreSQL full-text search.
 * This function will be available when you configure full-text search in Supabase.
 */
export async function searchLinks(query: string): Promise<Link[]> {
  if (!query.trim()) {
    return fetchLinks();
  }

  // Einfache Textsuche im search_content Feld
  const { data, error } = await supabase
    .from(LINKS_TABLE)
    .select('*')
    .ilike('search_content', `%${query.toLowerCase()}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to search links: ${error.message}`);
  }

  return data.map((row) => ({
    id: row.id,
    ...row.data,
    createdAt: new Date(row.created_at),
  })) as Link[];
}

/**
 * Advanced full-text search using PostgreSQL's to_tsvector and plainto_tsquery.
 * This requires setting up a GIN index on the search_content column.
 */
export async function searchLinksFulltext(query: string): Promise<Link[]> {
  if (!query.trim()) {
    return fetchLinks();
  }

  // PostgreSQL Full-Text Search (benötigt entsprechende Konfiguration in Supabase)
  const { data, error } = await supabase
    .rpc('search_links_fulltext', { search_query: query });

  if (error) {
    // Fallback auf einfache Suche
    console.warn('Fulltext search failed, falling back to simple search:', error.message);
    return searchLinks(query);
  }

  return data.map((row: any) => ({
    id: row.id,
    ...row.data,
    createdAt: new Date(row.created_at),
  })) as Link[];
}
