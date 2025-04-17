
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

// Supabase database type definitions
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at?: string;
          phone_number: string;
          name?: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          phone_number: string;
          name?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          phone_number?: string;
          name?: string;
        };
      };
      performances: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          url: string;
          uploader_name: string;
          votes: number;
          photo_url?: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          url: string;
          uploader_name: string;
          votes?: number;
          photo_url?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          url?: string;
          uploader_name?: string;
          votes?: number;
          photo_url?: string;
          user_id?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          performance_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          performance_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          performance_id?: string;
        };
      };
    };
    Views: {
      vote_summary: {
        Row: {
          performance_id: string;
          total_votes: number;
        };
      };
    };
  };
}
