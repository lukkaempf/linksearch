import { supabase } from '@/supabase/config';
import type { FolderType } from '@/context/types';

const FOLDERS_TABLE = 'folders';

/**
 * Fetch all folders from Supabase.
 */
export async function fetchFolders(): Promise<FolderType[]> {
  const { data, error } = await supabase
    .from(FOLDERS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch folders: ${error.message}`);
  }

  
  console.log('Raw folder data from Supabase:', data);

  if (!data || data.length === 0) {
    console.log('No folders found in database');
    return [];
  }

  const mappedFolders = data.map((row) => {
    console.log('Processing folder row:', row);
    const folder = {
      id: row.id,
      ...row.data,
    } as FolderType;
    console.log('Mapped folder:', folder);
    return folder;
  });

  console.log('Final mapped folders:', mappedFolders);
  return mappedFolders;
}

/**
 * Create a new folder in Supabase.
 */
export async function createFolder(folder: Omit<FolderType, 'id'>): Promise<void> {
  const { error } = await supabase
    .from(FOLDERS_TABLE)
    .insert({
      data: folder,
      created_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(`Failed to create folder: ${error.message}`);
  }
}

/**
 * Update an existing folder by ID.
 */
export async function updateFolder(id: string, data: Partial<FolderType>): Promise<void> {
  // Hole die aktuellen Daten
  const { data: current, error: fetchError } = await supabase
    .from(FOLDERS_TABLE)
    .select('data')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch current folder: ${fetchError.message}`);
  }

  // Merge die Änderungen
  const updatedData = { ...current.data, ...data };

  const { error } = await supabase
    .from(FOLDERS_TABLE)
    .update({
      data: updatedData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update folder: ${error.message}`);
  }
}

/**
 * Delete a folder by ID.
 */
export async function deleteFolder(id: string): Promise<void> {
  const { error } = await supabase
    .from(FOLDERS_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete folder: ${error.message}`);
  }
}
