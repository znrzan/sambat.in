'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Infinity, Mic, Share2, Flag, MoreHorizontal, X, Copy, Check, Instagram } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatTimeAgo, formatCountdown, isExpiringSoon } from '@/lib/utils'
import { Sambat, REACTIONS, ReactionCounts } from '@/types'
import { ShareImageModal } from '@/components/modals/ShareImageModal'
import { AudioPlayer } from '@/components/sambat/AudioPlayer'

interface SambatCardProps {
    sambat: Sambat
    index?: number
    onReport?: (id: string) => void
    onReact?: (sambatId: string, key: keyof ReactionCounts) => void
}

export function SambatCard({ sambat, index = 0, onReport, onReact }: SambatCardProps) {
    const expiringSoon = isExpiringSoon(sambat.expires_at)
    const [showMenu, setShowMenu] = useState(false)
    const [copied, setCopied] = useState(false)
    const [reported, setReported] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const url = `${window.location.origin}/sambat/${sambat.id}`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'SAMBAT.IN',
                    text: `"${sambat.content.slice(0, 100)}..." - ${sambat.persona_name}`,
                    url,
                })
            } catch {
                // User cancelled
            }
        } else {
            // Fallback to copy
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleReport = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setReported(true)
        setShowMenu(false)
        onReport?.(sambat.id)
    }

    const toggleMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowMenu(!showMenu)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                style={{ transition: 'transform 0.05s ease-out, box-shadow 0.05s ease-out' }}
                className={cn(
                    "relative glass rounded-xl p-5 cursor-pointer overflow-hidden",
                    expiringSoon && "animate-burning"
                )}
            >
                <Link href={`/sambat/${sambat.id}`} className="block">
                    {/* Header: Persona & Time & Actions */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="font-medium text-text-primary text-sm">
                            {sambat.persona_name}
                        </span>
                        <span className="text-text-muted text-xs">•</span>
                        <span className="text-text-muted text-xs">
                            {formatTimeAgo(sambat.created_at)}
                        </span>
                        {sambat.is_voice && (
                            <div className="flex items-center gap-1 text-accent-purple">
                                <Mic className="w-3 h-3" />
                                <span className="text-xs">Voice</span>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="ml-auto flex items-center gap-1">
                            {/* Share button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleShare}
                                className="p-1.5 rounded-lg hover:bg-bg-tertiary transition-colors"
                                title="Share"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-accent-green" />
                                ) : (
                                    <Share2 className="w-4 h-4 text-text-muted hover:text-text-primary" />
                                )}
                            </motion.button>

                            {/* More menu */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleMenu}
                                    className="p-1.5 rounded-lg hover:bg-bg-tertiary transition-colors"
                                >
                                    <MoreHorizontal className="w-4 h-4 text-text-muted hover:text-text-primary" />
                                </motion.button>

                                {/* Dropdown menu */}
                                <AnimatePresence>
                                    {showMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                            className="absolute right-0 top-8 z-50 w-40 py-1 glass rounded-lg shadow-xl"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={handleReport}
                                                disabled={reported}
                                                className={cn(
                                                    "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                                                    reported
                                                        ? "text-text-muted cursor-not-allowed"
                                                        : "text-accent-red hover:bg-accent-red/10"
                                                )}
                                            >
                                                <Flag className="w-4 h-4" />
                                                {reported ? "Dilaporkan" : "Laporkan"}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setShowMenu(false)
                                                    setShowShareModal(true)
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-white/10 transition-colors"
                                            >
                                                <Instagram className="w-4 h-4" />
                                                Share ke IG
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {sambat.is_voice && sambat.voice_url ? (
                        <div className="mb-4">
                            <AudioPlayer src={sambat.voice_url} />
                        </div>
                    ) : (
                        <p className="text-text-primary text-base leading-relaxed mb-4 line-clamp-3 break-words overflow-hidden">
                            &ldquo;{sambat.content}&rdquo;
                        </p>
                    )}

                    {/* Footer: Reactions & Expiry */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* Quick reactions */}
                        <div className="flex items-center gap-1 flex-wrap">
                            {REACTIONS.slice(0, 4).map(({ key, emoji }) => (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.3, transition: { duration: 0.1 } }}
                                    whileTap={{ scale: 0.8, rotate: [0, -10, 10, 0], transition: { duration: 0.2 } }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        onReact?.(sambat.id, key)
                                    }}
                                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-bg-tertiary hover:bg-opacity-80"
                                >
                                    <motion.span
                                        className="text-xs"
                                        whileTap={{ scale: 1.5, transition: { duration: 0.1 } }}
                                    >
                                        {emoji}
                                    </motion.span>
                                    <span className="text-xs text-text-secondary">
                                        {sambat.reactions[key]}
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Expiry badge */}
                        <div className={cn(
                            "flex items-center gap-1 text-xs whitespace-nowrap",
                            sambat.expires_at
                                ? expiringSoon
                                    ? "text-accent-red"
                                    : "text-text-muted"
                                : "text-accent-green"
                        )}>
                            {sambat.expires_at ? (
                                <>
                                    <Clock className="w-3 h-3 flex-shrink-0" />
                                    <span>{formatCountdown(sambat.expires_at)}</span>
                                </>
                            ) : (
                                <>
                                    <Infinity className="w-3 h-3 flex-shrink-0" />
                                    <span>Permanen</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Sticker badges */}
                    {sambat.stickers.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/5">
                            {sambat.stickers.slice(0, 5).map((sticker, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-0.5 text-xs rounded-full bg-bg-tertiary text-text-secondary"
                                >
                                    {sticker.sticker_id}
                                </span>
                            ))}
                            {sambat.stickers.length > 5 && (
                                <span className="text-xs text-text-muted">
                                    +{sambat.stickers.length - 5} more
                                </span>
                            )}
                        </div>
                    )}
                </Link>

                {/* Reported overlay */}
                {reported && (
                    <div className="absolute inset-0 bg-bg-primary/80 flex items-center justify-center rounded-xl">
                        <p className="text-text-muted text-sm">Terima kasih atas laporannya</p>
                    </div>
                )}
            </motion.div>

            {/* Share Image Modal */}
            <ShareImageModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                sambat={sambat}
            />
        </>
    )
}
