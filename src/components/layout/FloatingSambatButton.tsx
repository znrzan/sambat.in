'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, Plus } from 'lucide-react'

interface FloatingSambatButtonProps {
    onClick?: () => void
}

export function FloatingSambatButton({ onClick }: FloatingSambatButtonProps) {
    const ButtonContent = (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2 px-6 py-4 rounded-2xl shadow-xl"
            style={{
                boxShadow: '0 10px 40px rgba(255, 77, 106, 0.4)',
            }}
        >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Flame className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold">Sambat Sekarang</span>
            <Plus className="w-5 h-5" />
        </motion.div>
    )

    if (onClick) {
        return (
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="fixed bottom-6 right-6 z-40"
            >
                <button onClick={onClick}>
                    {ButtonContent}
                </button>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="fixed bottom-6 right-6 z-40"
        >
            <Link href="/sambat?create=true">
                {ButtonContent}
            </Link>
        </motion.div>
    )
}
