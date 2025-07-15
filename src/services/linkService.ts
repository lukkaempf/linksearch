import { db } from '@/firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import type { Link } from '@/context/types';

const linksCol = collection(db, 'links');

/**
 * Fetch all links from Firestore.
 */
export async function fetchLinks(): Promise<Link[]> {
  const snapshot = await getDocs(linksCol);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title as string,
      url: data.url as string,
      description: data.description as string | undefined,
      labels: data.labels as string[],
      folderId: data.folderId as string | undefined,
      createdAt: (data.createdAt as Timestamp).toDate(),
    };
  });
}

/**
 * Create a new link in Firestore.
 */
export async function createLink(link: Omit<Link, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(linksCol, {
    ...link,
    createdAt: Timestamp.fromDate(new Date()),
  });
}

/**
 * Update an existing link by ID.
 */
export async function updateLink(id: string, data: Partial<Link>): Promise<void> {
  const ref = doc(db, 'links', id);
  const payload: any = { ...data };
  if (payload.createdAt instanceof Date) {
    payload.createdAt = Timestamp.fromDate(payload.createdAt);
  }
  await updateDoc(ref, payload);
}

/**
 * Delete a link by ID.
 */
export async function deleteLink(id: string): Promise<void> {
  const ref = doc(db, 'links', id);
  await deleteDoc(ref);
}
