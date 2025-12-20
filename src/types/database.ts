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
            sambats: {
                Row: {
                    id: string
                    content: string
                    persona_name: string
                    is_voice: boolean
                    voice_url: string | null
                    sentiment: 'happy' | 'sad' | 'angry' | 'neutral'
                    created_at: string
                    expires_at: string | null
                    is_expired: boolean
                }
                Insert: {
                    id?: string
                    content: string
                    persona_name: string
                    is_voice?: boolean
                    voice_url?: string | null
                    sentiment?: 'happy' | 'sad' | 'angry' | 'neutral'
                    created_at?: string
                    expires_at?: string | null
                    is_expired?: boolean
                }
                Update: {
                    id?: string
                    content?: string
                    persona_name?: string
                    is_voice?: boolean
                    voice_url?: string | null
                    sentiment?: 'happy' | 'sad' | 'angry' | 'neutral'
                    created_at?: string
                    expires_at?: string | null
                    is_expired?: boolean
                }
            }
            reactions: {
                Row: {
                    id: string
                    sambat_id: string
                    reaction_type: 'fire' | 'sad' | 'laugh' | 'hug' | 'skull'
                    created_at: string
                }
                Insert: {
                    id?: string
                    sambat_id: string
                    reaction_type: 'fire' | 'sad' | 'laugh' | 'hug' | 'skull'
                    created_at?: string
                }
                Update: {
                    id?: string
                    sambat_id?: string
                    reaction_type?: 'fire' | 'sad' | 'laugh' | 'hug' | 'skull'
                    created_at?: string
                }
            }
            reports: {
                Row: {
                    id: string
                    sambat_id: string
                    reason: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    sambat_id: string
                    reason?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    sambat_id?: string
                    reason?: string | null
                    created_at?: string
                }
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
    }
}

// Helper types
export type Sambat = Database['public']['Tables']['sambats']['Row']
export type NewSambat = Database['public']['Tables']['sambats']['Insert']
export type Reaction = Database['public']['Tables']['reactions']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
