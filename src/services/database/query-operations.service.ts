
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { DbItem, QueryFilter, SortOption } from '../../types/database.types';
import { convertTimestamps } from './utils';

// Query documents with filtering, ordering and pagination
export const queryCollection = async <T extends DbItem>(
  collectionName: string,
  filters: QueryFilter[] = [],
  sortBy?: SortOption,
  limitTo?: number
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
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
    
    const q = query(collectionRef, ...constraints);
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
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    } as T));
  } catch (error) {
    console.error(`Error getting all ${collectionName}:`, error);
    return [];
  }
};
