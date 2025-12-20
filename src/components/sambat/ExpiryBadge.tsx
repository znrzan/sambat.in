'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ExpiryBadgeProps {
    expiresAt: Date | null
    showCountdown?: boolean
}

export function ExpiryBadge({ expiresAt, showCountdown = true }: ExpiryBadgeProps) {
    const isPermanent = !expiresAt

    if (isPermanent) {
        return (
            <div className="flex items-center gap-1 text-accent-green text-xs">
                <span className="text-lg">♾️</span>
                <span>Permanen</span>
            </div>
        )
    }

    const now = new Date()
    const diffMs = expiresAt.getTime() - now.getTime()
    const isExpired = diffMs <= 0
    const isExpiringSoon = diffMs > 0 && diffMs < 60 * 60 * 1000 // < 1 hour

    if (isExpired) {
        return (
            <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="flex items-center gap-1 text-accent-red text-xs"
            >
                <span>🔥</span>
                <span>Hangus!</span>
            </motion.div>
        )
    }

    const formatTime = () => {
        const seconds = Math.floor(diffMs / 1000)
        if (seconds < 60) return `${seconds} detik`
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes} menit`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours} jam`
        const days = Math.floor(hours / 24)
        return `${days} hari`
    }

    return (
        <div className={cn(
            "flex items-center gap-1 text-xs",
            isExpiringSoon ? "text-accent-red" : "text-text-muted"
        )}>
            <span>⏰</span>
            <span>{formatTime()} lagi</span>
        </div>
    )
}
