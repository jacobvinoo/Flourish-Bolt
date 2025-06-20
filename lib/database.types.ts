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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          user_role: string
          display_mode: string
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          user_role?: string
          display_mode?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          user_role?: string
          display_mode?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          user_id: string
          rc_customer_id: string | null
          active_entitlement: string | null
          analyses_remaining: number | null
          period_ends_at: string | null
        }
        Insert: {
          user_id: string
          rc_customer_id?: string | null
          active_entitlement?: string | null
          analyses_remaining?: number | null
          period_ends_at?: string | null
        }
        Update: {
          user_id?: string
          rc_customer_id?: string | null
          active_entitlement?: string | null
          analyses_remaining?: number | null
          period_ends_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      exercises: {
        Row: {
          id: number
          title: string
          description: string | null
          level: number
          font_style: string | null
          worksheet_pdf_url: string
          created_at: string | null
        }
        Insert: {
          title: string
          description?: string | null
          level: number
          font_style?: string | null
          worksheet_pdf_url: string
          created_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          level?: number
          font_style?: string | null
          worksheet_pdf_url?: string
          created_at?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          id: number
          user_id: string
          exercise_id: number
          submitted_at: string | null
          image_url: string
          status: string
        }
        Insert: {
          user_id: string
          exercise_id: number
          submitted_at?: string | null
          image_url: string
          status?: string
        }
        Update: {
          id?: number
          user_id?: string
          exercise_id?: number
          submitted_at?: string | null
          image_url?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          }
        ]
      }
      analysis_results: {
        Row: {
          id: number
          submission_id: number
          overall_score: number | null
          formation_score: number | null
          spacing_score: number | null
          consistency_score: number | null
          alignment_score: number | null
          feedback_json: Json | null
          created_at: string | null
        }
        Insert: {
          submission_id: number
          overall_score?: number | null
          formation_score?: number | null
          spacing_score?: number | null
          consistency_score?: number | null
          alignment_score?: number | null
          feedback_json?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: number
          submission_id?: number
          overall_score?: number | null
          formation_score?: number | null
          spacing_score?: number | null
          consistency_score?: number | null
          alignment_score?: number | null
          feedback_json?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          }
        ]
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

// Type exports for convenience
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];