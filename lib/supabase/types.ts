export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      artists: {
        Row: {
          created_at: string
          id: string
          manager_id: string
          name: string
          notes: string | null
          slug: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          manager_id: string
          name: string
          notes?: string | null
          slug: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          manager_id?: string
          name?: string
          notes?: string | null
          slug?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          artist_id: string
          city: string | null
          country_code: string
          created_at: string
          created_by: string | null
          event_date: string
          fee_amount: number | null
          fee_currency: string | null
          festival_name: string | null
          id: string
          notes: string | null
          promoter_email: string | null
          promoter_name: string | null
          promoter_phone: string | null
          show_time: string | null
          soundcheck_time: string | null
          status: Database["public"]["Enums"]["event_status"]
          timezone: string
          updated_at: string
          venue_name: string
        }
        Insert: {
          artist_id: string
          city?: string | null
          country_code: string
          created_at?: string
          created_by?: string | null
          event_date: string
          fee_amount?: number | null
          fee_currency?: string | null
          festival_name?: string | null
          id?: string
          notes?: string | null
          promoter_email?: string | null
          promoter_name?: string | null
          promoter_phone?: string | null
          show_time?: string | null
          soundcheck_time?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          timezone?: string
          updated_at?: string
          venue_name: string
        }
        Update: {
          artist_id?: string
          city?: string | null
          country_code?: string
          created_at?: string
          created_by?: string | null
          event_date?: string
          fee_amount?: number | null
          fee_currency?: string | null
          festival_name?: string | null
          id?: string
          notes?: string | null
          promoter_email?: string | null
          promoter_name?: string | null
          promoter_phone?: string | null
          show_time?: string | null
          soundcheck_time?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          timezone?: string
          updated_at?: string
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
    }
    Views: {
      events_view: {
        Row: {
          artist_id: string | null
          city: string | null
          country_code: string | null
          created_at: string | null
          created_by: string | null
          event_date: string | null
          fee_amount: number | null
          fee_currency: string | null
          festival_name: string | null
          id: string | null
          is_completed: boolean | null
          notes: string | null
          promoter_email: string | null
          promoter_name: string | null
          promoter_phone: string | null
          show_time: string | null
          soundcheck_time: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          timezone: string | null
          updated_at: string | null
          venue_name: string | null
        }
        Insert: {
          artist_id?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          created_by?: string | null
          event_date?: string | null
          fee_amount?: never
          fee_currency?: never
          festival_name?: string | null
          id?: string | null
          is_completed?: never
          notes?: string | null
          promoter_email?: string | null
          promoter_name?: string | null
          promoter_phone?: string | null
          show_time?: string | null
          soundcheck_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          timezone?: string | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Update: {
          artist_id?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          created_by?: string | null
          event_date?: string | null
          fee_amount?: never
          fee_currency?: never
          festival_name?: string | null
          id?: string | null
          is_completed?: never
          notes?: string | null
          promoter_email?: string | null
          promoter_name?: string | null
          promoter_phone?: string | null
          show_time?: string | null
          soundcheck_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          timezone?: string | null
          updated_at?: string | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_manager: { Args: never; Returns: boolean }
      is_my_artist: { Args: { p_artist_id: string }; Returns: boolean }
      owns_artist: { Args: { p_artist_id: string }; Returns: boolean }
    }
    Enums: {
      event_status: "possible" | "hold" | "confirmed" | "cancelled"
      user_role: "manager" | "artist"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      event_status: ["possible", "hold", "confirmed", "cancelled"],
      user_role: ["manager", "artist"],
    },
  },
} as const

