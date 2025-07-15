import { db } from '@/firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import type { FolderType } from '@/context/types';

const foldersCol = collection(db, 'folders');

/**
 * Fetch all folders from Firestore.
 */
export async function fetchFolders(): Promise<FolderType[]> {
  const snapshot = await getDocs(foldersCol);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FolderType, 'id'>) }));
}

/**
 * Create a new folder in Firestore.
 */
export async function createFolder(folder: Omit<FolderType, 'id'>): Promise<void> {
  await addDoc(foldersCol, folder);
}

/**
 * Update an existing folder by ID.
 */
export async function updateFolder(id: string, data: Partial<FolderType>): Promise<void> {
  const ref = doc(db, 'folders', id);
  await updateDoc(ref, data as any);
}

/**
 * Delete a folder by ID.
 */
export async function deleteFolder(id: string): Promise<void> {
  const ref = doc(db, 'folders', id);
  await deleteDoc(ref);
}
