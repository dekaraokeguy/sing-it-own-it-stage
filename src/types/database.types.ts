
import { WhereFilterOp, Timestamp, DocumentReference, DocumentData } from 'firebase/firestore';

// Generic interface for database items
export interface DbItem {
  id?: string;
  [key: string]: any;
}

export interface QueryFilter {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}
