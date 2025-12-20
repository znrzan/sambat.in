export type Sentiment = 'angry' | 'sad' | 'happy' | 'neutral'

// Kata-kata untuk deteksi sentiment sederhana (client-side)
const angryWords = [
    'kesel', 'marah', 'benci', 'sebel', 'goblok', 'tolol', 'bodoh', 'bangsat',
    'anjir', 'anjing', 'bego', 'idiot', 'nyebelin', 'jengkel', 'emosi', 'murka',
    'geram', 'dongkol', 'sebal', 'sialan', 'kampret', 'bacot', 'tai', 'kontol',
    '!!', '!!!', 'wtf', 'fck', 'fuck', 'shit', 'damn', 'hell',
]

const sadWords = [
    'sedih', 'galau', 'nangis', 'patah hati', 'sakit hati', 'kecewa', 'menyesal',
    'sepi', 'kesepian', 'sendiri', 'hampa', 'kosong', 'down', 'depresi', 'stress',
    'capek', 'lelah', 'bosan', 'jenuh', 'mati rasa', 'hopeless', 'putus asa',
    'gagal', 'rugi', 'kehilangan', 'rindu', 'kangen', 'baper', ':(', 'T_T', 'huhu',
]

const happyWords = [
    'senang', 'gembira', 'bahagia', 'ceria', 'seru', 'asik', 'mantap', 'keren',
    'bagus', 'hebat', 'wow', 'amazing', 'luar biasa', 'sukses', 'menang', 'berhasil',
    'lucu', 'ngakak', 'wkwk', 'haha', 'lol', 'rofl', 'xD', ':D', ':)', '^^',
    'yeay', 'horee', 'asyik', 'gokil', 'mantul', 'josss', 'gas', 'semangat',
]

// Escape special regex characters
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function countWordMatches(text: string, wordList: string[]): number {
    const lowerText = text.toLowerCase()
    return wordList.reduce((count, word) => {
        const escaped = escapeRegex(word.toLowerCase())
        const regex = new RegExp(escaped, 'g')
        const matches = lowerText.match(regex)
        return count + (matches ? matches.length : 0)
    }, 0)
}

export function analyzeSentiment(text: string): Sentiment {
    const angryCount = countWordMatches(text, angryWords)
    const sadCount = countWordMatches(text, sadWords)
    const happyCount = countWordMatches(text, happyWords)

    // Also check for excessive caps (angry indicator)
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length
    const adjustedAngryCount = angryCount + (capsRatio > 0.5 ? 2 : 0)

    const max = Math.max(adjustedAngryCount, sadCount, happyCount)

    if (max === 0) return 'neutral'
    if (adjustedAngryCount === max) return 'angry'
    if (sadCount === max) return 'sad'
    if (happyCount === max) return 'happy'

    return 'neutral'
}

export function getSentimentColor(sentiment: Sentiment): string {
    switch (sentiment) {
        case 'angry': return 'accent-red'
        case 'sad': return 'accent-blue'
        case 'happy': return 'accent-yellow'
        default: return 'accent-purple'
    }
}

export function getSentimentGlow(sentiment: Sentiment): string {
    switch (sentiment) {
        case 'angry': return 'sentiment-red'
        case 'sad': return 'sentiment-blue'
        case 'happy': return 'sentiment-yellow'
        default: return 'sentiment-purple'
    }
}

export function getSentimentEmoji(sentiment: Sentiment): string {
    switch (sentiment) {
        case 'angry': return '🔴'
        case 'sad': return '🔵'
        case 'happy': return '🟡'
        default: return '🟣'
    }
}
