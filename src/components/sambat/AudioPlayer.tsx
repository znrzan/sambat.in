'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2 } from 'lucide-react'

interface AudioPlayerProps {
    src: string
    className?: string
}

export function AudioPlayer({ src, className = '' }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleLoadedMetadata = () => {
            setDuration(audio.duration)
        }

        const handleTimeUpdate = () => {
            setProgress((audio.currentTime / audio.duration) * 100)
        }

        const handleEnded = () => {
            setIsPlaying(false)
            setProgress(0)
        }

        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('ended', handleEnded)
        }
    }, [])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return

        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current
        if (!audio) return

        const rect = e.currentTarget.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const percentage = clickX / rect.width
        audio.currentTime = percentage * audio.duration
    }

    const formatTime = (seconds: number) => {
        if (!isFinite(seconds)) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl bg-accent-purple/20 ${className}`}>
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Play/Pause button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-purple to-accent-red flex items-center justify-center text-white shrink-0"
            >
                {isPlaying ? (
                    <Pause className="w-5 h-5" />
                ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                )}
            </motion.button>

            {/* Waveform / Progress bar */}
            <div className="flex-1">
                <div
                    className="h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden"
                    onClick={handleProgressClick}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-accent-purple to-accent-red"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-xs text-text-muted">
                        {formatTime(audioRef.current?.currentTime || 0)}
                    </span>
                    <span className="text-xs text-text-muted">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Volume indicator */}
            <Volume2 className="w-4 h-4 text-accent-purple shrink-0" />
        </div>
    )
}
