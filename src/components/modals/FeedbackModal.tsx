'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bug, Lightbulb, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
}

type FeedbackType = 'bug' | 'suggestion'

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [type, setType] = useState<FeedbackType>('suggestion')
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || ''

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) return

        if (!formspreeEndpoint) {
            console.error('NEXT_PUBLIC_FORMSPREE_ENDPOINT not configured')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email || 'anonymous@sambat.in',
                    _subject: `[SAMBAT.IN] ${type === 'bug' ? 'Bug Report' : 'Saran'}`,
                    jenis: type === 'bug' ? 'Bug Report' : 'Saran/Masukan',
                    pesan: message,
                }),
            })

            if (response.ok) {
                setIsSuccess(true)
                setTimeout(() => {
                    handleClose()
                }, 2000)
            } else {
                console.error('Formspree error:', response.status)
            }
        } catch (error) {
            console.error('Error submitting feedback:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setMessage('')
        setEmail('')
        setType('suggestion')
        setIsSuccess(false)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="glass rounded-2xl overflow-hidden w-full max-w-md">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h2 className="font-heading font-bold text-lg text-text-primary">
                                    Kirim Feedback
                                </h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-text-muted" />
                                </button>
                            </div>

                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 text-center"
                                >
                                    <CheckCircle className="w-16 h-16 text-accent-green mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-text-primary mb-2">
                                        Terima Kasih!
                                    </h3>
                                    <p className="text-text-secondary">
                                        Feedback kamu sudah terkirim
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                    {/* Type selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Jenis Feedback
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setType('suggestion')}
                                                className={cn(
                                                    "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                                                    type === 'suggestion'
                                                        ? "border-accent-purple bg-accent-purple/20 text-accent-purple"
                                                        : "border-white/10 text-text-muted hover:border-white/20"
                                                )}
                                            >
                                                <Lightbulb className="w-5 h-5" />
                                                <span>Saran</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setType('bug')}
                                                className={cn(
                                                    "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                                                    type === 'bug'
                                                        ? "border-accent-red bg-accent-red/20 text-accent-red"
                                                        : "border-white/10 text-text-muted hover:border-white/20"
                                                )}
                                            >
                                                <Bug className="w-5 h-5" />
                                                <span>Bug</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            {type === 'bug' ? 'Jelaskan bug yang kamu temukan' : 'Apa saran kamu?'}
                                        </label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={type === 'bug'
                                                ? "Ceritakan apa yang terjadi..."
                                                : "Ide atau saran untuk membuat app ini lebih baik..."
                                            }
                                            rows={4}
                                            className="w-full bg-bg-tertiary border border-white/10 rounded-xl p-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple resize-none"
                                            required
                                        />
                                    </div>

                                    {/* Email (optional) */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Email <span className="text-text-muted">(opsional)</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Jika mau dihubungi balik"
                                            className="w-full bg-bg-tertiary border border-white/10 rounded-xl p-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple"
                                        />
                                    </div>

                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !message.trim()}
                                        className={cn(
                                            "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all",
                                            message.trim()
                                                ? "bg-gradient-to-r from-accent-purple to-accent-red text-white hover:opacity-90"
                                                : "bg-bg-tertiary text-text-muted cursor-not-allowed"
                                        )}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Kirim Feedback
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
