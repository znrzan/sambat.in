'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Flame, Mic, MicOff, Square, Calendar, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePersona } from '@/hooks/usePersona'
import { EXPIRY_OPTIONS, ExpiryOption } from '@/types'

interface SambatModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: SambatSubmitData) => void
    initialContent?: string
}

export interface SambatSubmitData {
    content: string
    isVoice: boolean
    voiceBlob?: Blob
    expiryOption: ExpiryOption
    customExpiry?: Date
    customName?: string
    customEmoji?: string
}

export function SambatModal({ isOpen, onClose, onSubmit, initialContent = '' }: SambatModalProps) {
    const { persona } = usePersona()
    const [mode, setMode] = useState<'text' | 'voice'>('text')
    const [content, setContent] = useState(initialContent)
    const [expiryOption, setExpiryOption] = useState<ExpiryOption>('permanent')
    const [customExpiry, setCustomExpiry] = useState<string>('')
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [customName, setCustomName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setContent('')
            setMode('text')
            setExpiryOption('permanent')
            setAudioBlob(null)
            setIsRecording(false)
            setRecordingTime(0)
            setCustomName('')
            setIsSubmitting(false)
        }
    }, [isOpen])

    // Sync content with initialContent when provided
    useEffect(() => {
        if (initialContent) {
            setContent(initialContent)
        }
    }, [initialContent])

    // Recording timer
    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime(t => t + 1)
            }, 1000)
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isRecording])

    const startRecording = async () => {
        try {
            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                }
            })

            // Use best available format
            const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                ? 'audio/webm'
                : 'audio/mp4'

            const mediaRecorder = new MediaRecorder(stream, { mimeType })
            mediaRecorderRef.current = mediaRecorder
            const chunks: BlobPart[] = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data)
                }
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType })
                setAudioBlob(blob)
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start(100) // Record in 100ms chunks
            setIsRecording(true)
            setRecordingTime(0)
        } catch (err) {
            console.error('Failed to start recording:', err)
            alert('Tidak bisa mengakses mikrofon. Pastikan izin mikrofon sudah diberikan.')
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }

    const handleSubmit = async () => {
        if (mode === 'text' && !content.trim()) return
        if (mode === 'voice' && !audioBlob) return

        setIsSubmitting(true)

        try {
            onSubmit({
                content: mode === 'text' ? content : '[Voice Message]',
                isVoice: mode === 'voice',
                voiceBlob: audioBlob || undefined,
                expiryOption,
                customExpiry: customExpiry ? new Date(customExpiry) : undefined,
                customName: customName.trim() || undefined,
                customEmoji: persona?.emoji,
            })

            onClose()
        } catch (err) {
            console.error('Submit error:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
                    >
                        <div className="glass rounded-2xl overflow-hidden w-full max-w-lg">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h2 className="font-heading font-bold text-lg text-text-primary">
                                    Sambat Baru
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center hover:bg-opacity-80 transition-colors"
                                >
                                    <X className="w-4 h-4 text-text-secondary" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-4 space-y-4">
                                {/* Persona - Editable */}
                                <div className="space-y-2">
                                    <label className="text-sm text-text-secondary">Nama anonim kamu:</label>
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        placeholder={persona?.name || 'Nama Anonim'}
                                        className="w-full px-3 py-2 rounded-lg bg-bg-tertiary text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple"
                                        maxLength={30}
                                    />
                                    <p className="text-xs text-text-muted">Kosongkan untuk pakai nama random: {persona?.name}</p>
                                </div>

                                {/* Mode toggle */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setMode('text')}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                            mode === 'text'
                                                ? "bg-gradient-to-r from-accent-red to-accent-purple text-white"
                                                : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
                                        )}
                                    >
                                        📝 Teks
                                    </button>
                                    <button
                                        onClick={() => setMode('voice')}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                            mode === 'voice'
                                                ? "bg-gradient-to-r from-accent-red to-accent-purple text-white"
                                                : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
                                        )}
                                    >
                                        🎤 Suara
                                    </button>
                                </div>

                                {/* Content input */}
                                {mode === 'text' ? (
                                    <div className="relative">
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Tulis keluh kesahmu di sini..."
                                            className={cn(
                                                "w-full h-32 p-4 rounded-xl bg-bg-tertiary text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all"
                                            )}
                                            maxLength={500}
                                        />
                                        <div className="absolute bottom-3 right-3 text-xs text-text-muted">
                                            {content.length}/500
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 py-8">
                                        {audioBlob ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-20 h-20 rounded-full bg-accent-green/20 flex items-center justify-center">
                                                    <Mic className="w-8 h-8 text-accent-green" />
                                                </div>
                                                <span className="text-text-secondary text-sm">
                                                    Rekaman siap! {formatTime(recordingTime)}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        setAudioBlob(null)
                                                        setRecordingTime(0)
                                                    }}
                                                    className="text-accent-red text-sm hover:underline"
                                                >
                                                    Hapus & Rekam Ulang
                                                </button>
                                            </div>
                                        ) : isRecording ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    className="w-20 h-20 rounded-full bg-accent-red/20 flex items-center justify-center"
                                                >
                                                    <div className="w-16 h-16 rounded-full bg-accent-red flex items-center justify-center">
                                                        <MicOff className="w-8 h-8 text-white" />
                                                    </div>
                                                </motion.div>
                                                <span className="text-accent-red font-mono">
                                                    {formatTime(recordingTime)}
                                                </span>
                                                <button
                                                    onClick={stopRecording}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-red text-white"
                                                >
                                                    <Square className="w-4 h-4" />
                                                    Stop
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <button
                                                    onClick={startRecording}
                                                    className="w-20 h-20 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 flex items-center justify-center transition-colors"
                                                >
                                                    <Mic className="w-8 h-8 text-accent-purple" />
                                                </button>
                                                <span className="text-text-secondary text-sm">
                                                    Tap untuk mulai rekam
                                                </span>
                                                <span className="text-text-muted text-xs">
                                                    Suaramu akan disamarkan otomatis
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Expiry options */}
                                <div className="space-y-2">
                                    <p className="text-sm text-text-secondary flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Hangus dalam:
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {EXPIRY_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.key}
                                                onClick={() => setExpiryOption(opt.key)}
                                                className={cn(
                                                    "py-2 px-3 rounded-lg text-left transition-all",
                                                    expiryOption === opt.key
                                                        ? "bg-gradient-to-r from-accent-red to-accent-purple text-white"
                                                        : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
                                                )}
                                            >
                                                <span className="text-sm font-medium block">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {expiryOption === 'custom' && (
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input
                                                type="datetime-local"
                                                value={customExpiry}
                                                onChange={(e) => setCustomExpiry(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/10 space-y-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        (mode === 'text' && !content.trim()) ||
                                        (mode === 'voice' && !audioBlob) ||
                                        isSubmitting
                                    }
                                    className={cn(
                                        "w-full btn-primary flex items-center justify-center gap-2",
                                        ((mode === 'text' && !content.trim()) ||
                                            (mode === 'voice' && !audioBlob) ||
                                            isSubmitting) &&
                                        "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Flame className="w-5 h-5" />
                                            Kirim Sambatan
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// Add missing Clock import alias
const Clock = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)
