'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'

// Daily prompts - rotates based on date (Gen-Z/Social Media style)
const PROMPTS = [
    "Ngl hari ini tuh beneran...",
    "Literally gabisa move on dari...",
    "Kasian banget sih gue, soalnya...",
    "No bc why did I...",
    "Bestie help me, aku lagi...",
    "Bro I can't even rn...",
    "Ini tuh red flag bgt, masa...",
    "POV: lo lagi anxious gegara...",
    "Slay banget kalau aku bisa...",
    "Era healing aku tuh...",
    "Aku lg di villain era karena...",
    "It's giving burnt out vibes...",
    "Delulu is the solulu tapi...",
    "Main character syndrome ku kambuh...",
    "Periodt. Aku capek sama...",
    "Trust issues ku makin parah gara-gara...",
    "Ini bukan aku yg drama, tapi...",
    "Aku tuh cuma pengen...",
    "Not me being toxic ke diri sendiri...",
    "Fr fr aku butuh seseorang yg...",
    "Lowkey pengen bilang...",
    "Highkey frustrasi sama...",
    "Akhir-akhir ini aku sering...",
    "Rent free di kepala aku tuh...",
    "The audacity of...",
    "Pick me? No. Aku cuma...",
    "Real talk, aku takut...",
    "Spill dong, aku lg stress karena...",
    "Mental health check: aku lg...",
    "Ini bukan flexing tp...",
]

interface DailyPromptProps {
    onUsePrompt?: (prompt: string) => void
}

export function DailyPrompt({ onUsePrompt }: DailyPromptProps) {
    const [currentPrompt, setCurrentPrompt] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Get daily prompt based on date
    const getDailyPrompt = () => {
        const today = new Date()
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
        return PROMPTS[dayOfYear % PROMPTS.length]
    }

    // Get random prompt
    const getRandomPrompt = () => {
        const randomIndex = Math.floor(Math.random() * PROMPTS.length)
        return PROMPTS[randomIndex]
    }

    useEffect(() => {
        setCurrentPrompt(getDailyPrompt())
    }, [])

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => {
            setCurrentPrompt(getRandomPrompt())
            setIsRefreshing(false)
        }, 300)
    }

    const handleUsePrompt = () => {
        onUsePrompt?.(currentPrompt)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4 mb-6"
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-red flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-accent-purple font-medium">Prompt Hari Ini</span>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleRefresh}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                            title="Ganti prompt"
                        >
                            <RefreshCw
                                className={`w-3.5 h-3.5 text-text-muted ${isRefreshing ? 'animate-spin' : ''}`}
                            />
                        </motion.button>
                    </div>

                    <p className="text-text-primary text-sm leading-relaxed mb-3">
                        &ldquo;{currentPrompt}&rdquo;
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUsePrompt}
                        className="text-xs px-3 py-1.5 rounded-lg bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 transition-colors"
                    >
                        Pakai prompt ini
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}
