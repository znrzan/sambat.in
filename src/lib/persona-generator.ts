// // Daftar kata sifat lucu/unik ala Indonesia
// const adjectives = [
//     'Melow',
//     'Ambis',
//     'Santuy',
//     'Gabut',
//     'Receh',
//     'Bucin',
//     'Mager',
//     'Baper',
//     'Galau',
//     'Selo',
//     'Kepo',
//     'Gercep',
//     'Kudet',
//     'Garing',
//     'Ketar-ketir',
//     'Ngeselin',
//     'Gokil',
//     'Absurd',
//     'Random',
//     'Nyentrik',
//     'Kece',
//     'Mantul',
//     'Julid',
//     'Uwu',
//     'Sus',
//     'Cupu',
//     'Norak',
//     'Alay',
//     'Lebay',
//     'Kocak',
// ]

// // Daftar makanan & hewan khas Indonesia
// const nouns = [
//     // Makanan
//     'Cireng',
//     'Onde-onde',
//     'Seblak',
//     'Cilok',
//     'Bakso',
//     'Siomay',
//     'Ketoprak',
//     'Gado-gado',
//     'Rendang',
//     'Nasi Goreng',
//     'Sate',
//     'Pempek',
//     'Martabak',
//     'Klepon',
//     'Serabi',
//     'Lupis',
//     'Es Dawet',
//     'Cendol',
//     'Rujak',
//     'Kerak Telor',
//     // Hewan
//     'Kucing',
//     'Ayam',
//     'Bebek',
//     'Kambing',
//     'Komodo',
//     'Orangutan',
//     'Jalak',
//     'Capung',
//     'Kancil',
//     'Merpati',
// ]

// // Emoji yang cocok dengan persona
// const emojis = [
//     '🍜', '🍛', '🍝', '🍲', '🥟', '🍡', '🍢', '🍥',
//     '🐱', '🐔', '🦆', '🐐', '🦎', '🦧', '🐦', '🦗',
//     '🔥', '✨', '💫', '🌟', '⭐', '🎭', '🎪', '🎨',
// ]

// Curated persona combinations that make sense (not random)
const PERSONAS = [
    // --- Vibe Check ---
    { name: 'Si Overthinking', emoji: '🧠' },
    { name: 'Anak Healing', emoji: '🧘' },
    { name: 'Korban Ghosting', emoji: '👻' },
    { name: 'Budak Korporat', emoji: '💼' },
    { name: 'Pengangguran Aesthetic', emoji: '✨' },
    { name: 'Fresh Graduate Galau', emoji: '🎓' },
    // --- Makanan Personality ---
    { name: 'Pecinta Seblak', emoji: '🌶️' },
    { name: 'Penggila Indomie', emoji: '🍜' },
    { name: 'Anak Mixue', emoji: '🍦' },
    { name: 'Penikmat Kopi', emoji: '☕' },
    { name: 'Korban Diet', emoji: '🥗' },
    { name: 'Tanghulu Enjoyer', emoji: '🍡' },
    // --- Relationship Status ---
    { name: 'Si Bucin', emoji: '💕' },
    { name: 'Mantan Terindah', emoji: '💔' },
    { name: 'Jomblo Bahagia', emoji: '😌' },
    { name: 'Korban PHP', emoji: '🤡' },
    { name: 'Situationship Victim', emoji: '🎭' },
    { name: 'Delulu Setia', emoji: '🦋' },
    // --- Internet Persona ---
    { name: 'Admin Menfess', emoji: '📱' },
    { name: 'Warga Twitter', emoji: '🐦' },
    { name: 'TikToker Gagal', emoji: '🎬' },
    { name: 'Lurker Setia', emoji: '👀' },
    { name: 'Keyboard Warrior', emoji: '⌨️' },
    { name: 'Professional Stalker', emoji: '🔍' },
    // --- Kucing & Hewan ---
    { name: 'Pemilik Oyen', emoji: '🐱' },
    { name: 'Capybara Enthusiast', emoji: '🦫' },
    { name: 'Cat Parent', emoji: '🐈' },
    { name: 'Anabul Lover', emoji: '🐾' },
    // --- Lifestyle ---
    { name: 'Anak Kos', emoji: '🏠' },
    { name: 'Mahasiswa Abadi', emoji: '📚' },
    { name: 'Pekerja Lembur', emoji: '🌙' },
    { name: 'Weekend Warrior', emoji: '🎉' },
    { name: 'Mager Professional', emoji: '🛋️' },
    { name: 'Gabut Emperor', emoji: '👑' },
    // --- Mood ---
    { name: 'Si Baper', emoji: '😢' },
    { name: 'Drama Queen', emoji: '👸' },
    { name: 'Overthinker Pro', emoji: '💭' },
    { name: 'Anxiety Gang', emoji: '😰' },
    { name: 'Main Character', emoji: '⭐' },
    { name: 'NPC Energy', emoji: '🗿' },
    // --- Gen-Z Vibes ---
    { name: 'Era Villain', emoji: '😈' },
    { name: 'Era Healing', emoji: '🌸' },
    { name: 'Slay Bestie', emoji: '💅' },
    { name: 'Sigma Grindset', emoji: '🔥' },
    { name: 'Literally Me', emoji: '🎯' },
    { name: 'Real One', emoji: '💯' },
    // --- Pekerjaan ---
    { name: 'Ojol Legend', emoji: '🛵' },
    { name: 'Anak Startup', emoji: '🚀' },
    { name: 'Freelancer Galau', emoji: '💻' },
    { name: 'PNS Santuy', emoji: '🏛️' },
    { name: 'Pedagang Tanghulu', emoji: '🍭' },
    { name: 'Barista Indie', emoji: '🧋' },
]

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

export interface Persona {
    name: string
    emoji: string
    fullDisplay: string
}

export function generatePersona(): Persona {
    const persona = getRandomItem(PERSONAS)

    return {
        name: persona.name,
        emoji: persona.emoji,
        fullDisplay: `${persona.name} ${persona.emoji}`,
    }
}

// Storage key untuk persona
const PERSONA_KEY = 'sambatin_persona'

export function getStoredPersona(): Persona | null {
    if (typeof window === 'undefined') return null

    const stored = localStorage.getItem(PERSONA_KEY)
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch {
            return null
        }
    }
    return null
}

export function storePersona(persona: Persona): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(PERSONA_KEY, JSON.stringify(persona))
}

export function getOrCreatePersona(): Persona {
    const stored = getStoredPersona()
    if (stored) return stored

    const newPersona = generatePersona()
    storePersona(newPersona)
    return newPersona
}
