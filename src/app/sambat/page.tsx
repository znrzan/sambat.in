'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Clock as ClockIcon, Skull, Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { FloatingSambatButton } from '@/components/layout/FloatingSambatButton'
import { SambatCard } from '@/components/sambat/SambatCard'
import { SambatModal, SambatSubmitData } from '@/components/sambat/SambatModal'
import { useSambats } from '@/hooks/useSambats'
import { usePersona } from '@/hooks/usePersona'

type FilterTab = 'hot' | 'new' | 'expiring'

const TABS: { key: FilterTab; label: string; icon: typeof Flame }[] = [
    { key: 'hot', label: 'Hot', icon: Flame },
    { key: 'new', label: 'Baru', icon: ClockIcon },
    { key: 'expiring', label: 'Mau Hangus', icon: Skull },
]

export default function WallPage() {
    const [activeTab, setActiveTab] = useState<FilterTab>('hot')
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [initialContent, setInitialContent] = useState('')

    // Use Supabase hook
    const { sambats, loading, createSambat, addReaction, reportSambat } = useSambats()
    const { persona } = usePersona()

    const filteredSambats = useMemo(() => {
        let result = [...sambats]

        // Filter by search
        if (searchQuery) {
            result = result.filter(s =>
                s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.persona_name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Sort by tab
        switch (activeTab) {
            case 'hot':
                result.sort((a, b) => {
                    const aTotal = a.reactions.fire + a.reactions.sad + a.reactions.laugh + a.reactions.hug + a.reactions.skull
                    const bTotal = b.reactions.fire + b.reactions.sad + b.reactions.laugh + b.reactions.hug + b.reactions.skull
                    return bTotal - aTotal
                })
                break
            case 'new':
                result.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
                break
            case 'expiring':
                result = result
                    .filter(s => s.expires_at !== null)
                    .sort((a, b) => {
                        if (!a.expires_at || !b.expires_at) return 0
                        return a.expires_at.getTime() - b.expires_at.getTime()
                    })
                break
        }

        return result
    }, [sambats, activeTab, searchQuery])

    const handleSubmit = async (data: SambatSubmitData) => {
        try {
            // Calculate expiry date
            let expiresAt: Date | null = null
            if (data.expiryOption === '24h') {
                expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
            } else if (data.expiryOption === '1w') {
                expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            } else if (data.expiryOption === 'custom' && data.customExpiry) {
                expiresAt = data.customExpiry
            }

            await createSambat({
                content: data.content,
                persona_name: data.customName || persona?.name || 'Anonim',
                is_voice: data.isVoice,
                expires_at: expiresAt,
                voiceBlob: data.voiceBlob,
            })
        } catch (err) {
            console.error('Failed to create sambat:', err)
        }
    }

    const handleReport = (id: string) => {
        reportSambat(id)
    }

    const handleReact = (sambatId: string, key: string) => {
        addReaction(sambatId, key as keyof typeof sambats[0]['reactions'])
    }



    return (
        <div className="min-h-screen bg-bg-primary">
            <Header />

            {/* Main content */}
            <main className="pt-20 pb-32 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Search bar */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari sambatan..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-bg-secondary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Filter tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex gap-2 mb-6 overflow-x-auto pb-2"
                    >
                        {TABS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap",
                                    activeTab === key
                                        ? "bg-gradient-to-r from-accent-red to-accent-purple text-white"
                                        : "bg-bg-secondary text-text-secondary hover:text-text-primary"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </motion.div>


                    {/* Sambat list */}
                    <div className="space-y-4">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center py-16"
                            >
                                <Loader2 className="w-8 h-8 animate-spin text-accent-purple" />
                            </motion.div>
                        ) : filteredSambats.length > 0 ? (
                            filteredSambats.map((sambat, i) => (
                                <SambatCard
                                    key={sambat.id}
                                    sambat={sambat}
                                    index={i}
                                    onReport={handleReport}
                                    onReact={handleReact}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <p className="text-text-muted text-lg mb-2">Belum ada yang sambat nih</p>
                                <p className="text-text-muted text-sm">Jadi yang pertama sambat!</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Load more */}
                    {filteredSambats.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mt-8"
                        >
                            <button className="btn-secondary">
                                Muat lebih banyak...
                            </button>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Floating button */}
            <FloatingSambatButton onClick={() => setIsModalOpen(true)} />

            {/* Create modal */}
            <SambatModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setInitialContent('')
                }}
                onSubmit={handleSubmit}
                initialContent={initialContent}
            />
        </div>
    )
}
