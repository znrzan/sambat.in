'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePersona } from '@/hooks/usePersona'
import { Flame, MessageSquare } from 'lucide-react'
import { FeedbackModal } from '@/components/modals/FeedbackModal'

export function Header() {
    const { persona, isLoading } = usePersona()
    const [showFeedback, setShowFeedback] = useState(false)

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-red to-accent-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Flame className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-xl text-text-primary">
                            SAMBAT<span className="text-accent-red">.IN</span>
                        </span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-3">

                        {/* Feedback button */}
                        <button
                            onClick={() => setShowFeedback(true)}
                            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary"
                            title="Kirim Feedback"
                        >
                            <MessageSquare className="w-5 h-5" />
                        </button>

                        {/* Persona badge */}
                        {!isLoading && persona && (
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-tertiary">
                                <span className="text-lg">{persona.emoji}</span>
                                <span className="text-sm font-medium text-text-secondary">
                                    {persona.name}
                                </span>
                            </div>
                        )}

                        {/* CTA Button */}
                        <Link
                            href="/sambat"
                            className="btn-primary text-sm hidden sm:inline-flex items-center gap-2"
                        >
                            <Flame className="w-4 h-4" />
                            Lihat Sambatan
                        </Link>
                    </div>
                </div>
            </header>

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={showFeedback}
                onClose={() => setShowFeedback(false)}
            />
        </>
    )
}

