'use client'

import { useState, useEffect, useCallback } from 'react'
import { Persona, generatePersona } from '@/lib/persona-generator'

const SESSION_KEY = 'sambatin_session_persona'

export function usePersona() {
    const [persona, setPersonaState] = useState<Persona | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check session storage first
        const stored = sessionStorage.getItem(SESSION_KEY)
        if (stored) {
            try {
                setPersonaState(JSON.parse(stored))
            } catch {
                // If parse fails, generate new
                const newPersona = generatePersona()
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(newPersona))
                setPersonaState(newPersona)
            }
        }
        // Don't auto-generate, wait for WelcomeModal
        setIsLoading(false)
    }, [])

    const setPersona = useCallback((name: string) => {
        const newPersona: Persona = {
            name,
            emoji: '',
            fullDisplay: name,
        }
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(newPersona))
        setPersonaState(newPersona)
    }, [])

    const regeneratePersona = useCallback(() => {
        const newPersona = generatePersona()
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(newPersona))
        setPersonaState(newPersona)
        return newPersona
    }, [])

    return {
        persona,
        isLoading,
        setPersona,
        regeneratePersona,
    }
}

