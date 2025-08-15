export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      breath_sessions: {
        Row: {
          breath_count: number
          created_at: string
          date: string
          exercise_title: string | null
          hold_duration: number
          id: string
          repetitions: number
          total_duration: number
          user_id: string
        }
        Insert: {
          breath_count: number
          created_at?: string
          date?: string
          exercise_title?: string | null
          hold_duration: number
          id?: string
          repetitions: number
          total_duration: number
          user_id: string
        }
        Update: {
          breath_count?: number
          created_at?: string
          date?: string
          exercise_title?: string | null
          hold_duration?: number
          id?: string
          repetitions?: number
          total_duration?: number
          user_id?: string
        }
        Relationships: []
      }
      breathing_exercises: {
        Row: {
          common_mistakes: string[] | null
          created_at: string
          description: string | null
          detailed_description: string | null
          exhale_duration: number
          first_hold_duration: number
          how_it_helps: string | null
          id: string
          inhale_duration: number
          is_custom: boolean
          repetitions: number
          safety_note: string | null
          second_hold_duration: number
          slug: string
          title: string
          updated_at: string
          when_to_use: string[] | null
        }
        Insert: {
          common_mistakes?: string[] | null
          created_at?: string
          description?: string | null
          detailed_description?: string | null
          exhale_duration: number
          first_hold_duration: number
          how_it_helps?: string | null
          id?: string
          inhale_duration: number
          is_custom?: boolean
          repetitions: number
          safety_note?: string | null
          second_hold_duration: number
          slug: string
          title: string
          updated_at?: string
          when_to_use?: string[] | null
        }
        Update: {
          common_mistakes?: string[] | null
          created_at?: string
          description?: string | null
          detailed_description?: string | null
          exhale_duration?: number
          first_hold_duration?: number
          how_it_helps?: string | null
          id?: string
          inhale_duration?: number
          is_custom?: boolean
          repetitions?: number
          safety_note?: string | null
          second_hold_duration?: number
          slug?: string
          title?: string
          updated_at?: string
          when_to_use?: string[] | null
        }
        Relationships: []
      }
      daily_activity: {
        Row: {
          completed_breath_session: boolean
          created_at: string
          date: string
          id: string
          logged_in: boolean
          user_id: string
        }
        Insert: {
          completed_breath_session?: boolean
          created_at?: string
          date?: string
          id?: string
          logged_in?: boolean
          user_id: string
        }
        Update: {
          completed_breath_session?: boolean
          created_at?: string
          date?: string
          id?: string
          logged_in?: boolean
          user_id?: string
        }
        Relationships: []
      }
      notification_schedules: {
        Row: {
          created_at: string
          days: number[]
          id: string
          time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days: number[]
          id?: string
          time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days?: number[]
          id?: string
          time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string
          enabled: boolean
          frequency: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          frequency?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          frequency?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_breath_streak: number
          current_login_streak: number
          id: string
          last_breath_session_date: string | null
          last_login_date: string
          longest_breath_streak: number
          longest_login_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_breath_streak?: number
          current_login_streak?: number
          id?: string
          last_breath_session_date?: string | null
          last_login_date?: string
          longest_breath_streak?: number
          longest_login_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_breath_streak?: number
          current_login_streak?: number
          id?: string
          last_breath_session_date?: string | null
          last_login_date?: string
          longest_breath_streak?: number
          longest_login_streak?: number
          updated_at?: string
          user_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
