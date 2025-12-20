'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Sparkles } from 'lucide-react'
import { generatePersona } from '@/lib/persona-generator'

interface WelcomeModalProps {
    onComplete: (name: string) => void
}

export function WelcomeModal({ onComplete }: WelcomeModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [customName, setCustomName] = useState('')
    const [generatedName, setGeneratedName] = useState('')

    useEffect(() => {
        // Check if user has seen the modal this session
        const hasSeenModal = sessionStorage.getItem('sambatin_welcome_seen')
        if (!hasSeenModal) {
            setIsOpen(true)
            // Generate a random name as default
            const persona = generatePersona()
            setGeneratedName(persona.name)
        }
    }, [])

    const handleSubmit = () => {
        sessionStorage.setItem('sambatin_welcome_seen', 'true')
        onComplete(customName.trim() || generatedName || 'Anonim')
        setIsOpen(false)
    }

    const handleSkip = () => {
        sessionStorage.setItem('sambatin_welcome_seen', 'true')
        onComplete(generatedName || 'Anonim')
        setIsOpen(false)
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
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                    >
                        <div className="glass rounded-2xl overflow-hidden w-full max-w-md">
                            {/* Header */}
                            <div className="p-6 text-center border-b border-white/10">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-red to-accent-purple flex items-center justify-center">
                                    <Flame className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">
                                    Selamat datang di SAMBAT.IN!
                                </h2>
                                <p className="text-text-secondary text-sm">
                                    Sambat anonim, lega kemudian. 🔥
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-2">
                                        Mau dipanggil apa? (opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        placeholder={generatedName || 'Nama anonim'}
                                        className="w-full px-4 py-3 rounded-xl bg-bg-tertiary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple"
                                        maxLength={30}
                                        autoFocus
                                    />
                                    <p className="text-xs text-text-muted mt-2">
                                        Kosongkan untuk pakai nama random: <span className="text-accent-purple">{generatedName}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
                                    <Sparkles className="w-5 h-5 text-accent-purple flex-shrink-0" />
                                    <p className="text-xs text-text-secondary">
                                        Nama ini hanya untuk session ini dan tidak disimpan permanen.
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 pt-0 space-y-3">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    <Flame className="w-5 h-5" />
                                    Mulai Sambat!
                                </button>
                                <button
                                    onClick={handleSkip}
                                    className="w-full py-2 text-text-muted hover:text-text-secondary text-sm transition-colors"
                                >
                                    Pakai nama random aja
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
