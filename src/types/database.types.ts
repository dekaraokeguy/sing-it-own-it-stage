
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string | null
          whatsapp_number: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          username?: string | null
          whatsapp_number?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          whatsapp_number?: string | null
          created_at?: string | null
        }
      }
      performances: {
        Row: {
          id: string
          user_id: string | null
          video_url: string | null
          thumbnail_url: string | null
          song_title: string | null
          uploader_name: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          song_title?: string | null
          uploader_name?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          song_title?: string | null
          uploader_name?: string | null
          created_at?: string | null
        }
      }
      votes: {
        Row: {
          id: string
          performance_id: string | null
          user_id: string | null
          rating: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          performance_id?: string | null
          user_id?: string | null
          rating?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          performance_id?: string | null
          user_id?: string | null
          rating?: number | null
          created_at?: string | null
        }
      }
    }
    Views: {
      vote_summary: {
        Row: {
          performance_id: string | null
          total_votes: number | null
          average_rating: number | null
        }
      }
    }
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']
