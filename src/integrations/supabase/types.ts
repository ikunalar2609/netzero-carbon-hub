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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      carbon_offsets: {
        Row: {
          category: string
          created_at: string
          credits: number
          id: string
          price_per_ton: number
          project_name: string
          quality_score: number
          selected: boolean
          updated_at: string
          user_id: string
          vintage: string | null
        }
        Insert: {
          category: string
          created_at?: string
          credits?: number
          id?: string
          price_per_ton?: number
          project_name: string
          quality_score?: number
          selected?: boolean
          updated_at?: string
          user_id: string
          vintage?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          credits?: number
          id?: string
          price_per_ton?: number
          project_name?: string
          quality_score?: number
          selected?: boolean
          updated_at?: string
          user_id?: string
          vintage?: string | null
        }
        Relationships: []
      }
      climate_settings: {
        Row: {
          baseline_year: number
          created_at: string
          id: string
          selected_scenario: string
          selected_scope: string
          target_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          baseline_year?: number
          created_at?: string
          id?: string
          selected_scenario?: string
          selected_scope?: string
          target_year?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          baseline_year?: number
          created_at?: string
          id?: string
          selected_scenario?: string
          selected_scope?: string
          target_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emission_calculations: {
        Row: {
          calculation_type: string
          created_at: string
          id: string
          input_data: Json
          result_data: Json
          total_emissions: number
          user_id: string | null
        }
        Insert: {
          calculation_type: string
          created_at?: string
          id?: string
          input_data: Json
          result_data: Json
          total_emissions: number
          user_id?: string | null
        }
        Update: {
          calculation_type?: string
          created_at?: string
          id?: string
          input_data?: Json
          result_data?: Json
          total_emissions?: number
          user_id?: string | null
        }
        Relationships: []
      }
      emissions_data: {
        Row: {
          created_at: string
          id: string
          is_projected: boolean
          scope1: number
          scope2: number
          scope3: number
          total: number
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_projected?: boolean
          scope1?: number
          scope2?: number
          scope3?: number
          total?: number
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          is_projected?: boolean
          scope1?: number
          scope2?: number
          scope3?: number
          total?: number
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      forest_cover_regions: {
        Row: {
          area_km2: number
          coordinates: Json
          coverage: number
          created_at: string
          id: string
          name: string
          region: string
        }
        Insert: {
          area_km2?: number
          coordinates: Json
          coverage?: number
          created_at?: string
          id?: string
          name: string
          region: string
        }
        Update: {
          area_km2?: number
          coordinates?: Json
          coverage?: number
          created_at?: string
          id?: string
          name?: string
          region?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string
          event: string
          id: string
          offset_dependency: number | null
          reduction_target: number | null
          standards: string[] | null
          status: string
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          offset_dependency?: number | null
          reduction_target?: number | null
          standards?: string[] | null
          status?: string
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          offset_dependency?: number | null
          reduction_target?: number | null
          standards?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      reduction_levers: {
        Row: {
          category: string
          cost: number
          created_at: string
          current_value: number
          enabled: boolean
          id: string
          impact: number
          lever_id: string
          name: string
          target_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          cost?: number
          created_at?: string
          current_value?: number
          enabled?: boolean
          id?: string
          impact?: number
          lever_id: string
          name: string
          target_value?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          cost?: number
          created_at?: string
          current_value?: number
          enabled?: boolean
          id?: string
          impact?: number
          lever_id?: string
          name?: string
          target_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          created_at: string
          fleet_electrification: number
          id: string
          investment_level: string
          name: string
          net_zero_year: number
          offset_reliance: number
          renewables_target: number
          risk_level: string
          scenario_type: string
          supplier_engagement: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fleet_electrification?: number
          id?: string
          investment_level?: string
          name: string
          net_zero_year: number
          offset_reliance?: number
          renewables_target?: number
          risk_level?: string
          scenario_type: string
          supplier_engagement?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fleet_electrification?: number
          id?: string
          investment_level?: string
          name?: string
          net_zero_year?: number
          offset_reliance?: number
          renewables_target?: number
          risk_level?: string
          scenario_type?: string
          supplier_engagement?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      standards_compliance: {
        Row: {
          created_at: string
          id: string
          standard: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          standard: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          standard?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tree_loss_hotspots: {
        Row: {
          area: string
          cause: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          loss_percentage: number
          loss_year: string
          region: string
        }
        Insert: {
          area: string
          cause: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          loss_percentage: number
          loss_year: string
          region: string
        }
        Update: {
          area?: string
          cause?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          loss_percentage?: number
          loss_year?: string
          region?: string
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
