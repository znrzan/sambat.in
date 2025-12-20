'use client'

import { useEffect, useRef, useCallback } from 'react'

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: string | HTMLElement,
                options: TurnstileOptions
            ) => string
            reset: (widgetId: string) => void
            remove: (widgetId: string) => void
        }
        onTurnstileLoad?: () => void
    }
}

interface TurnstileOptions {
    sitekey: string
    callback?: (token: string) => void
    'error-callback'?: () => void
    'expired-callback'?: () => void
    theme?: 'light' | 'dark' | 'auto'
    size?: 'normal' | 'compact' | 'invisible'
}

interface TurnstileProps {
    onVerify: (token: string) => void
    onError?: () => void
    onExpire?: () => void
}

export function Turnstile({ onVerify, onError, onExpire }: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const scriptLoadedRef = useRef(false)
    const devModeCalledRef = useRef(false)
    const onVerifyRef = useRef(onVerify)

    // Keep onVerify ref updated
    useEffect(() => {
        onVerifyRef.current = onVerify
    }, [onVerify])

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

    const renderWidget = useCallback(() => {
        if (!containerRef.current || !window.turnstile || !siteKey) return
        if (widgetIdRef.current) return // Already rendered

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token) => onVerifyRef.current(token),
            'error-callback': onError,
            'expired-callback': onExpire,
            theme: 'dark',
            size: 'flexible',
        })
    }, [siteKey, onError, onExpire])

    useEffect(() => {
        // If no site key, use dev mode bypass
        if (!siteKey) {
            if (!devModeCalledRef.current) {
                devModeCalledRef.current = true
                console.warn('NEXT_PUBLIC_TURNSTILE_SITE_KEY not configured - dev mode bypass')
                // Use setTimeout to avoid calling during render
                setTimeout(() => {
                    onVerifyRef.current('dev-mode-token')
                }, 100)
            }
            return
        }

        // If Turnstile already loaded
        if (window.turnstile) {
            renderWidget()
            return
        }

        // If script already being loaded
        if (scriptLoadedRef.current) return

        // Load Turnstile script
        scriptLoadedRef.current = true
        const script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'
        script.async = true
        script.defer = true

        window.onTurnstileLoad = () => {
            renderWidget()
        }

        document.head.appendChild(script)

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current)
                widgetIdRef.current = null
            }
        }
    }, [siteKey, renderWidget])

    // Don't render container in dev mode without key
    if (!siteKey) return null

    return <div ref={containerRef} />
}

export function useTurnstile() {
    const verifyToken = async (token: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/verify-turnstile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            })

            const data = await response.json()
            return data.success
        } catch (error) {
            console.error('Turnstile verification error:', error)
            return false
        }
    }

    return { verifyToken }
}
