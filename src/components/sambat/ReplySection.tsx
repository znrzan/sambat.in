'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Loader2 } from 'lucide-react'
import { useReplies } from '@/hooks/useReplies'
import { formatTimeAgo } from '@/lib/utils'
import { Turnstile, useTurnstile } from '@/components/Turnstile'

interface ReplySectionProps {
    sambatId: string
}

export function ReplySection({ sambatId }: ReplySectionProps) {
    const { replies, loading, addReply, replyCount } = useReplies(sambatId)
    const { verifyToken } = useTurnstile()
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showReplies, setShowReplies] = useState(true)
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
    const [verificationError, setVerificationError] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || isSubmitting) return

        // Verify Turnstile token
        if (!turnstileToken) {
            setVerificationError(true)
            return
        }

        setIsSubmitting(true)
        setVerificationError(false)

        try {
            // Verify token with backend
            const isValid = await verifyToken(turnstileToken)
            if (!isValid) {
                setVerificationError(true)
                setIsSubmitting(false)
                return
            }

            await addReply(content)
            setContent('')
        } catch (error) {
            console.error('Failed to add reply:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mt-6">
            {/* Turnstile - invisible */}
            <Turnstile
                onVerify={(token) => {
                    setTurnstileToken(token)
                    setVerificationError(false)
                }}
                onError={() => setVerificationError(true)}
                onExpire={() => setTurnstileToken(null)}
            />

            {/* Header */}
            <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
            >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">
                    {replyCount} Balasan
                </span>
            </button>

            <AnimatePresence>
                {showReplies && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {/* Reply Input */}
                        <form onSubmit={handleSubmit} className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Tulis balasan anonim..."
                                    maxLength={500}
                                    className="flex-1 px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple transition-colors"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={!content.trim() || isSubmitting || !turnstileToken}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-red text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </motion.button>
                            </div>
                            <div className="flex justify-between items-center mt-1 ml-1">
                                <p className="text-xs text-text-muted">
                                    {content.length}/500 karakter
                                </p>
                                {verificationError && (
                                    <p className="text-xs text-accent-red">
                                        Verifikasi gagal, coba lagi
                                    </p>
                                )}
                            </div>
                        </form>

                        {/* Replies List */}
                        <div className="space-y-3">
                            {loading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-accent-purple" />
                                </div>
                            ) : replies.length > 0 ? (
                                replies.map((reply, index) => (
                                    <motion.div
                                        key={reply.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-4 rounded-xl bg-bg-tertiary border border-white/5"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium text-text-primary">
                                                {reply.persona_name}
                                            </span>
                                            <span className="text-xs text-text-muted">
                                                • {formatTimeAgo(reply.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-text-secondary text-sm leading-relaxed">
                                            {reply.content}
                                        </p>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-center text-text-muted text-sm py-4">
                                    Belum ada balasan. Jadilah yang pertama!
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
