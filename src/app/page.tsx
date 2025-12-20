'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Sparkles, Clock, Users, Zap, Loader2 } from 'lucide-react'
import { usePersona } from '@/hooks/usePersona'
import { useSambats } from '@/hooks/useSambats'
import { Header } from '@/components/layout/Header'
import { FloatingSambatButton } from '@/components/layout/FloatingSambatButton'
import { SambatCard } from '@/components/sambat/SambatCard'

const features = [
    {
        icon: Sparkles,
        title: 'Identitas Unik',
        description: 'Dapat nama anonim lucu ala Indonesia seperti "Cireng Renyah" atau "Kucing Ambis"',
    },
    {
        icon: Clock,
        title: 'Konten Hangus',
        description: 'Pilih kapan sambatanmu mau auto-hangus: 24 jam, 1 minggu, atau permanen',
    },
    {
        icon: Zap,
        title: 'Real-time',
        description: 'Sambatan baru langsung muncul tanpa refresh. Reaksi instan!',
    },
    {
        icon: Users,
        title: '100% Anonim',
        description: 'Ga ada login, ga ada tracking. Curhat bebas tanpa takut ketahuan',
    },
]

export default function HomePage() {
    const { persona, isLoading } = usePersona()
    const { sambats, loading: sambatsLoading } = useSambats()

    return (
        <div className="min-h-screen bg-bg-primary">
            <Header />

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Greeting */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        {!isLoading && persona && persona.name && (
                            <p className="text-text-secondary text-lg">
                                Hai, <span className="text-accent-purple font-semibold">{persona.name}</span> 👋
                            </p>
                        )}
                    </motion.div>

                    {/* Main headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-heading font-extrabold text-4xl md:text-6xl text-text-primary mb-6"
                    >
                        <span className="bg-gradient-to-r from-accent-red via-accent-purple to-accent-blue bg-clip-text text-transparent">
                            Sambat aja dulu
                        </span>
                        <br />
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10"
                    >
                        Platform anonim buat curhat, ngeluh, atau sekadar ngoceh.
                        100% bebas, identitasmu tersembunyi, dan kontenmu bisa auto-hangus.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link href="/sambat" className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4">
                            <Flame className="w-5 h-5" />
                            Sambatan
                        </Link>
                        <button className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4">
                            <Sparkles className="w-5 h-5" />
                            Lihat Demo
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="font-heading font-bold text-2xl text-center text-text-primary mb-12"
                    >
                        Kenapa SAMBAT.IN?
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-xl p-6 text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-heading font-semibold text-text-primary mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-text-secondary text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Preview Section */}
            <section className="py-16 px-4 pb-32">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="font-heading font-bold text-2xl text-center text-text-primary mb-4"
                    >
                        Sambatan Terbaru
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-text-secondary text-center mb-8"
                    >
                        Lihat apa yang lagi orang-orang sambat-in
                    </motion.p>

                    {sambatsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-accent-purple" />
                        </div>
                    ) : sambats.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-4">
                            {sambats.slice(0, 3).map((sambat, i) => (
                                <SambatCard key={sambat.id} sambat={sambat} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-text-muted text-lg">Belum ada yang sambat nih</p>
                            <p className="text-text-muted text-sm mt-2">Jadi yang pertama sambat!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Floating CTA */}
            <FloatingSambatButton />
        </div>
    )
}
