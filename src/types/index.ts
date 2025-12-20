// Re-export database types
export * from './database'

export interface Sambat {
    id: string
    content: string
    persona_name: string
    persona_emoji: string
    sentiment: string
    created_at: Date
    expires_at: Date | null
    is_voice: boolean
    voice_url?: string
    reactions: ReactionCounts
    stickers: PlacedSticker[]
}

export interface Reply {
    id: string
    sambat_id: string
    content: string
    persona_name: string
    created_at: Date
}

export interface ReactionCounts {
    fire: number   // 🔥
    sad: number    // 😢
    laugh: number  // 😂
    hug: number    // 🫂
    skull: number  // 💀
}

export interface PlacedSticker {
    id: string
    sticker_id: string
    position_x: number
    position_y: number
    placed_at: Date
}

export interface Sticker {
    id: string
    emoji: string
    label: string
}

export const AVAILABLE_STICKERS: Sticker[] = [
    { id: 'sabar', emoji: '🙏', label: 'Sabar ya' },
    { id: 'kuat', emoji: '💪', label: 'Kuat!' },
    { id: 'peluk', emoji: '🤗', label: 'Peluk virtual' },
    { id: 'lucu', emoji: '🤣', label: 'Lucu bgt' },
    { id: 'setuju', emoji: '👍', label: 'Setuju' },
    { id: 'sama', emoji: '🤝', label: 'Sama dong' },
    { id: 'semangat', emoji: '🔥', label: 'Semangat!' },
    { id: 'gabisa', emoji: '💀', label: 'Ga bisa...' },
    { id: 'waduh', emoji: '😬', label: 'Waduh' },
    { id: 'makan', emoji: '🍜', label: 'Makan dulu' },
]

export const REACTIONS = [
    { key: 'fire' as const, emoji: '🔥', label: 'Panas' },
    { key: 'sad' as const, emoji: '😢', label: 'Sedih' },
    { key: 'laugh' as const, emoji: '😂', label: 'Ngakak' },
    { key: 'hug' as const, emoji: '🫂', label: 'Peluk' },
    { key: 'skull' as const, emoji: '💀', label: 'Mati' },
]

export type ExpiryOption = 'permanent' | '24h' | '1w' | 'custom'

export interface ExpiryChoice {
    key: ExpiryOption
    label: string
    description: string
}

export const EXPIRY_OPTIONS: ExpiryChoice[] = [
    { key: 'permanent', label: 'Permanen', description: 'Tidak akan hangus' },
    { key: '24h', label: '24 Jam', description: 'Hangus besok' },
    { key: '1w', label: '1 Minggu', description: 'Hangus minggu depan' },
    { key: 'custom', label: 'Pilih Tanggal', description: 'Atur sendiri' },
]
