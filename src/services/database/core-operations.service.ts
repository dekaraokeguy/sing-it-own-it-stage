
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentReference,
  DocumentData
} from 'firebase/firestore';
import { db } from '../../firebase';
import { DbItem } from '../../types/database.types';
import { convertTimestamps } from './utils';

// Get a document by ID
export const getById = async <T extends DbItem>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id,
        ...convertTimestamps(data)
      } as T;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting ${collectionName} by ID:`, error);
    return null;
  }
};

// Create a document
export const create = async <T extends DbItem>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<T | null> => {
  try {
    // Add timestamps
    const dataWithTimestamp = {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, collectionName), dataWithTimestamp);
    
    return {
      id: docRef.id,
      ...data
    } as T;
  } catch (error) {
    console.error(`Error creating ${collectionName}:`, error);
    return null;
  }
};

// Update a document
export const update = async <T extends DbItem>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    
    // Add updated_at timestamp
    const dataWithTimestamp = {
      ...data,
      updated_at: serverTimestamp()
    };
    
    await updateDoc(docRef, dataWithTimestamp);
    return true;
  } catch (error) {
    console.error(`Error updating ${collectionName}:`, error);
    return false;
  }
};

// Delete a document
export const remove = async (
  collectionName: string,
  docId: string
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting ${collectionName}:`, error);
    return false;
  }
};

// Get document reference
export const getDocRef = (
  collectionName: string,
  docId?: string
): DocumentReference<DocumentData> => {
  return docId
    ? doc(db, collectionName, docId)
    : doc(collection(db, collectionName));
};

// Helper to get server timestamp
export const getServerTimestamp = () => serverTimestamp();
