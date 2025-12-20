import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Baru saja'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`

    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export function formatCountdown(expiresAt: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((expiresAt.getTime() - now.getTime()) / 1000)

    if (diffInSeconds <= 0) return 'Hangus!'
    if (diffInSeconds < 60) return `${diffInSeconds} detik lagi`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lagi`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lagi`

    return `${Math.floor(diffInSeconds / 86400)} hari lagi`
}

export function isExpiringSoon(expiresAt: Date | null): boolean {
    if (!expiresAt) return false
    const now = new Date()
    const diffInHours = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)
    return diffInHours > 0 && diffInHours < 1
}
