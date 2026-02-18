export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      kpi_goals: {
        Row: {
          closed_deals_target: number
          created_at: string
          discovery_calls_target: number
          outreach_target: number
          proposals_target: number
          qualified_leads_target: number
          updated_at: string
          user_id: string
        }
        Insert: {
          closed_deals_target: number
          created_at?: string
          discovery_calls_target: number
          outreach_target: number
          proposals_target: number
          qualified_leads_target: number
          updated_at?: string
          user_id: string
        }
        Update: {
          closed_deals_target?: number
          created_at?: string
          discovery_calls_target?: number
          outreach_target?: number
          proposals_target?: number
          qualified_leads_target?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_check_ins: {
        Row: {
          closed_deals_actual: number
          closed_deals_target: number
          created_at: string
          discovery_calls_actual: number
          discovery_calls_target: number
          id: string
          outreach_actual: number
          outreach_target: number
          proposals_actual: number
          proposals_target: number
          qualified_leads_actual: number
          qualified_leads_target: number
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          closed_deals_actual: number
          closed_deals_target: number
          created_at?: string
          discovery_calls_actual: number
          discovery_calls_target: number
          id?: string
          outreach_actual: number
          outreach_target: number
          proposals_actual: number
          proposals_target: number
          qualified_leads_actual: number
          qualified_leads_target: number
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          closed_deals_actual?: number
          closed_deals_target?: number
          created_at?: string
          discovery_calls_actual?: number
          discovery_calls_target?: number
          id?: string
          outreach_actual?: number
          outreach_target?: number
          proposals_actual?: number
          proposals_target?: number
          qualified_leads_actual?: number
          qualified_leads_target?: number
          updated_at?: string
          user_id?: string
          week_start?: string
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
