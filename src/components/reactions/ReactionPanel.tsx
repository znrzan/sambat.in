'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { ReactionCounts, REACTIONS } from '@/types'
import { cn } from '@/lib/utils'

interface ReactionPanelProps {
    reactions: ReactionCounts
    onReact: (key: keyof ReactionCounts) => void
}

interface Particle {
    id: number
    emoji: string
    x: number
    y: number
}

export function ReactionPanel({ reactions, onReact }: ReactionPanelProps) {
    const [particles, setParticles] = useState<Particle[]>([])
    const [fireKey, setFireKey] = useState<string | null>(null)
    const particleIdRef = useRef(0)
    const clickCountRef = useRef(0)
    const clickTimerRef = useRef<NodeJS.Timeout | null>(null)
    const lastKeyRef = useRef<string>('')

    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0)

    const handleReact = (key: keyof ReactionCounts, emoji: string, e: React.MouseEvent) => {
        onReact(key)

        // Track clicks for fire effect
        if (lastKeyRef.current === key) {
            clickCountRef.current++
        } else {
            clickCountRef.current = 1
            lastKeyRef.current = key
        }

        // Reset counter after 1 second of no clicks
        if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current)
        }
        clickTimerRef.current = setTimeout(() => {
            clickCountRef.current = 0
        }, 1000)

        // Trigger fire effect at 8 clicks
        if (clickCountRef.current >= 8 && fireKey !== key) {
            setFireKey(key)
            clickCountRef.current = 0
            // Remove fire effect after 2 seconds
            setTimeout(() => {
                setFireKey(null)
            }, 2000)
        }

        // Get button position for particle effect
        const rect = e.currentTarget.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top

        // Create particles
        const newParticles: Particle[] = Array.from({ length: 5 }, () => ({
            id: particleIdRef.current++,
            emoji,
            x: x + (Math.random() - 0.5) * 40,
            y: y - Math.random() * 20,
        }))

        setParticles(prev => [...prev, ...newParticles])

        // Clean up particles after animation
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
        }, 500)
    }

    return (
        <div className="bg-bg-tertiary/50 p-4">
            {/* Total count */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-text-secondary">Reaksi</span>
                <span className="text-sm font-medium text-text-primary">{totalReactions}</span>
            </div>

            {/* Reaction buttons */}
            <div className="flex flex-wrap gap-2">
                {REACTIONS.map(({ key, emoji, label }) => (
                    <motion.button
                        key={key}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleReact(key, emoji, e)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl relative",
                            reactions[key] > 0
                                ? "bg-bg-secondary"
                                : "bg-bg-tertiary hover:bg-bg-secondary",
                            fireKey === key && "animate-fire-glow"
                        )}
                    >
                        <motion.span
                            className="text-xl"
                            animate={fireKey === key ? {
                                scale: [1, 1.3, 1.1, 1.2, 1],
                                rotate: [0, -5, 5, -3, 0],
                            } : {}}
                            transition={{ duration: 0.3, repeat: fireKey === key ? Infinity : 0 }}
                        >
                            {emoji}
                        </motion.span>
                        <span className="text-sm font-medium text-text-primary">
                            {reactions[key]}
                        </span>
                        {/* Fire particles */}
                        {fireKey === key && (
                            <>
                                <span className="absolute -top-1 left-1/4 text-sm animate-bounce">🔥</span>
                                <span className="absolute -top-2 right-1/4 text-sm animate-bounce" style={{ animationDelay: '0.1s' }}>🔥</span>
                            </>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Particle effects */}
            {particles.map((particle) => (
                <motion.span
                    key={particle.id}
                    initial={{
                        position: 'fixed',
                        left: particle.x,
                        top: particle.y,
                        scale: 1,
                        opacity: 1,
                    }}
                    animate={{
                        top: particle.y - 60,
                        scale: 0,
                        opacity: 0,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="text-xl pointer-events-none z-50"
                    style={{ position: 'fixed' }}
                >
                    {particle.emoji}
                </motion.span>
            ))}

            {/* Fire glow CSS */}
            <style jsx>{`
                @keyframes fire-glow {
                    0%, 100% { 
                        box-shadow: 0 0 10px #ff4d6a, 0 0 20px #ff6b35, 0 0 30px #ff4d6a;
                    }
                    50% { 
                        box-shadow: 0 0 20px #ff6b35, 0 0 40px #ff4d6a, 0 0 50px #ff6b35;
                    }
                }
                .animate-fire-glow {
                    animation: fire-glow 0.3s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

