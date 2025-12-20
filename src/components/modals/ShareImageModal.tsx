'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Instagram, Copy, Check, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import { Sambat } from '@/types'
import { formatTimeAgo } from '@/lib/utils'

interface ShareImageModalProps {
    isOpen: boolean
    onClose: () => void
    sambat: Sambat
}

export function ShareImageModal({ isOpen, onClose, sambat }: ShareImageModalProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [copied, setCopied] = useState(false)


    // Generate image when modal opens
    useEffect(() => {
        if (isOpen && cardRef.current) {
            generateImage()
        }
    }, [isOpen])

    const generateImage = async () => {
        if (!cardRef.current) return

        setIsGenerating(true)
        try {
            // Wait for fonts to load
            await document.fonts.ready

            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                logging: false,
            })

            const url = canvas.toDataURL('image/png')
            setImageUrl(url)
        } catch (error) {
            console.error('Error generating image:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    const downloadImage = () => {
        if (!imageUrl) return

        const link = document.createElement('a')
        link.download = `sambatan-${sambat.id}.png`
        link.href = imageUrl
        link.click()
    }

    const copyImage = async () => {
        if (!imageUrl) return

        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ])
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Error copying image:', error)
        }
    }

    const shareToInstagram = () => {
        // Download the image first, then user can share to IG manually
        downloadImage()
        alert('Gambar sudah didownload! Buka Instagram dan pilih gambar ini untuk dijadikan Story atau Post.')
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
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                    >
                        <div className="bg-bg-secondary rounded-2xl overflow-hidden w-full max-w-lg">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h2 className="font-heading font-bold text-lg text-text-primary">
                                    Share ke Instagram
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-text-muted" />
                                </button>
                            </div>

                            {/* Card Preview (for generating image) */}
                            <div className="p-4">
                                <div
                                    ref={cardRef}
                                    className="relative p-8 rounded-3xl overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                        minHeight: '300px',
                                    }}
                                >
                                    {/* Decorative circles */}
                                    <div
                                        className="absolute top-0 right-0 w-32 h-32 rounded-full"
                                        style={{ background: 'rgba(255,255,255,0.1)', transform: 'translate(30%, -30%)' }}
                                    />
                                    <div
                                        className="absolute bottom-0 left-0 w-24 h-24 rounded-full"
                                        style={{ background: 'rgba(255,255,255,0.08)', transform: 'translate(-30%, 30%)' }}
                                    />

                                    {/* Quote icon */}
                                    <div className="mb-4">
                                        <span className="text-5xl text-white/30">&ldquo;</span>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-6 relative z-10">
                                        <p
                                            className="text-white text-xl font-medium leading-relaxed"
                                            style={{
                                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: sambat.content.replace(/ /g, '&nbsp;')
                                            }}
                                        />
                                    </div>

                                    {/* Divider */}
                                    <div className="w-16 h-1 bg-white/30 rounded-full mb-4" />

                                    {/* Footer */}
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-white font-semibold text-sm drop-shadow">
                                                {sambat.persona_name}
                                            </p>
                                            <p className="text-white/60 text-xs">
                                                {formatTimeAgo(sambat.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview */}
                                {isGenerating ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin text-accent-purple" />
                                    </div>
                                ) : imageUrl && (
                                    <div className="mt-4">
                                        <p className="text-text-muted text-sm mb-2">Preview:</p>
                                        <img
                                            src={imageUrl}
                                            alt="Preview"
                                            className="w-full rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-t border-white/10 space-y-3">
                                <button
                                    onClick={shareToInstagram}
                                    disabled={!imageUrl}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    <Instagram className="w-5 h-5" />
                                    Share ke Instagram
                                </button>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={downloadImage}
                                        disabled={!imageUrl}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-bg-tertiary text-text-primary hover:bg-white/10 transition-colors disabled:opacity-50"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download
                                    </button>
                                    <button
                                        onClick={copyImage}
                                        disabled={!imageUrl}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-bg-tertiary text-text-primary hover:bg-white/10 transition-colors disabled:opacity-50"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-5 h-5 text-accent-green" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-5 h-5" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
