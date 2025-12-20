'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Reply } from '@/types'
import { usePersona } from './usePersona'

interface DbReply {
    id: string
    sambat_id: string
    content: string
    persona_name: string
    created_at: string
}

export function useReplies(sambatId: string) {
    const [replies, setReplies] = useState<Reply[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const { persona } = usePersona()

    // Transform database reply to frontend Reply
    const transformReply = (dbReply: DbReply): Reply => ({
        id: dbReply.id,
        sambat_id: dbReply.sambat_id,
        content: dbReply.content,
        persona_name: dbReply.persona_name,
        created_at: new Date(dbReply.created_at),
    })

    // Fetch replies
    useEffect(() => {
        const fetchReplies = async () => {
            if (!sambatId) return

            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('replies')
                    .select('*')
                    .eq('sambat_id', sambatId)
                    .order('created_at', { ascending: true })

                if (error) throw error

                setReplies(data.map(transformReply))
            } catch (err) {
                setError(err as Error)
                console.error('Error fetching replies:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchReplies()

        // Subscribe to realtime updates
        const channel = supabase
            .channel(`replies-${sambatId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'replies',
                    filter: `sambat_id=eq.${sambatId}`,
                },
                (payload) => {
                    const newReply = transformReply(payload.new as DbReply)
                    setReplies((prev) => [...prev, newReply])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [sambatId])

    // Add new reply
    const addReply = async (content: string) => {
        if (!sambatId || !content.trim()) return

        const personaName = persona?.name || 'Anonim'

        try {
            const { error } = await supabase
                .from('replies')
                .insert({
                    sambat_id: sambatId,
                    content: content.trim(),
                    persona_name: personaName,
                })

            if (error) {
                console.error('Error adding reply:', error)
                throw error
            }
            // Realtime subscription will handle adding to state
        } catch (err) {
            console.error('Error adding reply:', err)
            throw err
        }
    }

    return {
        replies,
        loading,
        error,
        addReply,
        replyCount: replies.length,
    }
}
