'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Mic, Clock, Infinity, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatTimeAgo, formatCountdown, isExpiringSoon } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { StickerCanvas } from '@/components/stickers/StickerCanvas'
import { ReactionPanel } from '@/components/reactions/ReactionPanel'
import { ReplySection } from '@/components/sambat/ReplySection'
import { useSambat, useSambats } from '@/hooks/useSambats'
import { REACTIONS, ReactionCounts } from '@/types'

export default function SambatDetailPage() {
    const params = useParams()
    const id = params.id as string
    const { sambat, loading, error } = useSambat(id)
    const { addReaction } = useSambats()
    const [showStickerPicker, setShowStickerPicker] = useState(false)
    const [localReactions, setLocalReactions] = useState<Record<string, number>>({})

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary">
                <Header />
                <main className="pt-20 pb-16 px-4">
                    <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-accent-purple" />
                    </div>
                </main>
            </div>
        )
    }

    if (error || !sambat) {
        return (
            <div className="min-h-screen bg-bg-primary">
                <Header />
                <main className="pt-20 pb-16 px-4">
                    <div className="max-w-2xl mx-auto text-center py-20">
                        <p className="text-text-muted text-lg">Sambatan tidak ditemukan</p>
                        <Link href="/sambat" className="btn-primary mt-4 inline-block">
                            Kembali ke Sambatan
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    const expiringSoon = isExpiringSoon(sambat.expires_at)

    // Combine database reactions with local reactions
    const reactions = {
        fire: sambat.reactions.fire + (localReactions.fire || 0),
        sad: sambat.reactions.sad + (localReactions.sad || 0),
        laugh: sambat.reactions.laugh + (localReactions.laugh || 0),
        hug: sambat.reactions.hug + (localReactions.hug || 0),
        skull: sambat.reactions.skull + (localReactions.skull || 0),
    }

    const handleReaction = (key: keyof typeof reactions) => {
        // Update local state for immediate feedback
        setLocalReactions(prev => ({
            ...prev,
            [key]: (prev[key] || 0) + 1,
        }))
        // Save to database
        addReaction(id, key as keyof ReactionCounts)
    }

    const handleStickerPlace = (stickerId: string, x: number, y: number) => {
        // TODO: Save sticker to database
        setShowStickerPicker(false)
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <Header />

            <main className="pt-20 pb-16 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Back button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6"
                    >
                        <Link
                            href="/sambat"
                            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Kembali ke Sambatan</span>
                        </Link>
                    </motion.div>

                    {/* Main card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "relative glass rounded-2xl overflow-hidden",
                            expiringSoon && "animate-burning"
                        )}
                    >

                        {/* Content section */}
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div>
                                    <p className="font-semibold text-text-primary">
                                        {sambat.persona_name}
                                    </p>
                                    <p className="text-sm text-text-muted">
                                        {formatTimeAgo(sambat.created_at)}
                                    </p>
                                </div>
                                {sambat.is_voice && (
                                    <div className="ml-auto flex items-center gap-1 px-3 py-1 rounded-full bg-accent-purple/20 text-accent-purple">
                                        <Mic className="w-4 h-4" />
                                        <span className="text-sm font-medium">Voice</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <blockquote className="text-lg text-text-primary leading-relaxed mb-6">
                                &ldquo;{sambat.content}&rdquo;
                            </blockquote>

                            {/* Sticker canvas */}
                            <StickerCanvas
                                stickers={sambat.stickers}
                                onStickerPlace={handleStickerPlace}
                                showPicker={showStickerPicker}
                                onTogglePicker={() => setShowStickerPicker(!showStickerPicker)}
                            />

                            {/* Expiry badge */}
                            <div className={cn(
                                "flex items-center gap-2 mt-6 pt-4 border-t border-white/10",
                                sambat.expires_at
                                    ? expiringSoon
                                        ? "text-accent-red"
                                        : "text-text-muted"
                                    : "text-accent-green"
                            )}>
                                {sambat.expires_at ? (
                                    <>
                                        <Clock className="w-5 h-5" />
                                        <span className="font-medium">
                                            Hangus dalam {formatCountdown(sambat.expires_at)}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Infinity className="w-5 h-5" />
                                        <span className="font-medium">Permanen</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Reactions */}
                        <ReactionPanel
                            reactions={reactions}
                            onReact={handleReaction}
                        />
                    </motion.div>

                    {/* Replies Section */}
                    <ReplySection sambatId={id} />
                </div>
            </main>
        </div>
    )
}

