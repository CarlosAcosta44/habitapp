// ⚠️ Este archivo es un stub temporal.
// Reemplazar con los tipos reales ejecutando:
//   npx supabase gen types typescript --project-id <id> > src/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: Record<string, {
      Row: Record<string, unknown>
      Insert: Record<string, unknown>
      Update: Record<string, unknown>
      Relationships: unknown[]
    }>
    Views: Record<string, {
      Row: Record<string, unknown>
    }>
    Functions: Record<string, {
      Args: Record<string, unknown>
      Returns: unknown
    }>
    Enums: Record<string, string[]>
    CompositeTypes: Record<string, Record<string, unknown>>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

