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
      images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          source_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          source_url: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          source_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
