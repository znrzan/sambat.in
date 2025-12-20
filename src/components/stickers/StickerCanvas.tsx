'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { AVAILABLE_STICKERS, PlacedSticker } from '@/types'
import { cn } from '@/lib/utils'

interface StickerCanvasProps {
    stickers: PlacedSticker[]
    onStickerPlace: (stickerId: string, x: number, y: number) => void
    showPicker: boolean
    onTogglePicker: () => void
}

export function StickerCanvas({
    stickers,
    onStickerPlace,
    showPicker,
    onTogglePicker,
}: StickerCanvasProps) {
    const [selectedSticker, setSelectedSticker] = useState<string | null>(null)

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!selectedSticker) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        onStickerPlace(selectedSticker, x, y)
        setSelectedSticker(null)
    }

    return (
        <div className="relative">
            {/* Canvas area */}
            <div
                onClick={selectedSticker ? handleCanvasClick : undefined}
                className={cn(
                    "relative min-h-[120px] rounded-xl border-2 border-dashed transition-all",
                    selectedSticker
                        ? "border-accent-purple cursor-crosshair bg-accent-purple/5"
                        : "border-transparent"
                )}
            >
                {/* Placed stickers */}
                {stickers.map((sticker, i) => (
                    <motion.div
                        key={sticker.id}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="absolute text-2xl cursor-pointer hover:scale-125 transition-transform"
                        style={{
                            left: `${sticker.position_x}%`,
                            top: `${sticker.position_y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {sticker.sticker_id}
                    </motion.div>
                ))}

                {/* Instruction text */}
                {stickers.length === 0 && !selectedSticker && (
                    <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm">
                        Belum ada stiker
                    </div>
                )}

                {selectedSticker && (
                    <div className="absolute inset-0 flex items-center justify-center text-accent-purple text-sm pointer-events-none">
                        Klik di mana saja untuk tempel stiker {selectedSticker}
                    </div>
                )}
            </div>

            {/* Sticker button */}
            <button
                onClick={onTogglePicker}
                className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
            >
                🎨 Tempel Stiker
            </button>

            {/* Sticker picker */}
            <AnimatePresence>
                {showPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 p-3 glass rounded-xl z-10"
                    >
                        <p className="text-xs text-text-muted mb-2">Pilih stiker:</p>
                        <div className="flex flex-wrap gap-2 max-w-xs">
                            {AVAILABLE_STICKERS.map((sticker) => (
                                <motion.button
                                    key={sticker.id}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        setSelectedSticker(sticker.emoji)
                                        onTogglePicker()
                                    }}
                                    className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors",
                                        selectedSticker === sticker.emoji
                                            ? "bg-accent-purple"
                                            : "bg-bg-tertiary hover:bg-opacity-80"
                                    )}
                                    title={sticker.label}
                                >
                                    {sticker.emoji}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
