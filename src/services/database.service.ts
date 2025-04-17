
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  Timestamp,
  DocumentReference,
  WhereFilterOp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Generic interface for database items
export interface DbItem {
  id?: string;
  [key: string]: any;
}

// Convert Firestore timestamps to JavaScript dates
const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  const result: any = { ...data };
  
  Object.keys(result).forEach(key => {
    // Check if the value is a Firestore Timestamp
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    }
    // Check if it's an object (but not an array or null) that might contain nested timestamps
    else if (
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key]) &&
      !(result[key] instanceof Date)
    ) {
      result[key] = convertTimestamps(result[key]);
    }
    // Handle arrays of objects that might contain timestamps
    else if (Array.isArray(result[key])) {
      result[key] = result[key].map((item: any) => {
        if (item && typeof item === 'object') {
          return convertTimestamps(item);
        }
        return item;
      });
    }
  });
  
  return result;
};

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

// Query documents with filtering, ordering and pagination
export const query = async <T extends DbItem>(
  collectionName: string,
  filters: Array<{ field: string; operator: WhereFilterOp; value: any }> = [],
  sortBy?: { field: string; direction: 'asc' | 'desc' },
  limitTo?: number
): Promise<T[]> => {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Add filter conditions
    filters.forEach(filter => {
      constraints.push(where(filter.field, filter.operator, filter.value));
    });
    
    // Add sorting
    if (sortBy) {
      constraints.push(orderBy(sortBy.field, sortBy.direction));
    }
    
    // Add limit
    if (limitTo) {
      constraints.push(limit(limitTo));
    }
    
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    } as T));
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    return [];
  }
};

// Get all documents from a collection
export const getAll = async <T extends DbItem>(
  collectionName: string
): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    } as T));
  } catch (error) {
    console.error(`Error getting all ${collectionName}:`, error);
    return [];
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
