'use client'

import { supabase } from '@/lib/supabase'
import { useState, useEffect, useCallback } from 'react'
import type { Sambat as DbSambat, NewSambat } from '@/types/database'
import type { Sambat, ReactionCounts } from '@/types'

// Transform database sambat to frontend sambat
function transformSambat(dbSambat: DbSambat, reactions: ReactionCounts): Sambat {
    return {
        id: dbSambat.id,
        content: dbSambat.content,
        persona_name: dbSambat.persona_name,
        persona_emoji: '', // No longer using emoji
        sentiment: dbSambat.sentiment,
        created_at: new Date(dbSambat.created_at),
        expires_at: dbSambat.expires_at ? new Date(dbSambat.expires_at) : null,
        is_voice: dbSambat.is_voice,
        voice_url: dbSambat.voice_url || undefined,
        reactions,
        stickers: [],
    }
}

export function useSambats() {
    const [sambats, setSambats] = useState<Sambat[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchSambats = useCallback(async () => {
        try {
            setLoading(true)

            // Fetch sambats that are not expired
            const { data: sambatsData, error: sambatsError } = await supabase
                .from('sambats')
                .select('*')
                .eq('is_expired', false)
                .order('created_at', { ascending: false })
                .limit(50)

            if (sambatsError) throw sambatsError

            if (!sambatsData) {
                setSambats([])
                return
            }

            // Fetch reaction counts for each sambat
            const sambatsWithReactions = await Promise.all(
                sambatsData.map(async (sambat) => {
                    const { data: reactionsData } = await supabase
                        .from('reactions')
                        .select('reaction_type')
                        .eq('sambat_id', sambat.id)

                    const reactionCounts: ReactionCounts = {
                        fire: 0,
                        sad: 0,
                        laugh: 0,
                        hug: 0,
                        skull: 0,
                    }

                    reactionsData?.forEach((r) => {
                        const type = r.reaction_type as keyof ReactionCounts
                        reactionCounts[type]++
                    })

                    return transformSambat(sambat, reactionCounts)
                })
            )

            setSambats(sambatsWithReactions)
        } catch (err) {
            setError(err as Error)
            console.error('Error fetching sambats:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    const createSambat = async (data: {
        content: string
        persona_name: string
        is_voice: boolean
        expires_at: Date | null
        voiceBlob?: Blob
    }) => {
        try {
            let voice_url: string | null = null

            // Upload voice to Cloudinary if present
            if (data.is_voice && data.voiceBlob) {
                // Determine file extension from blob type
                const blobType = data.voiceBlob.type || 'audio/webm'
                const extension = blobType.includes('mp4') ? 'mp4' :
                    blobType.includes('webm') ? 'webm' :
                        blobType.includes('wav') ? 'wav' : 'mp3'

                const formData = new FormData()
                formData.append('file', data.voiceBlob, `voice.${extension}`)

                const uploadResponse = await fetch('/api/upload-voice', {
                    method: 'POST',
                    body: formData,
                })

                if (!uploadResponse.ok) {
                    const errorText = await uploadResponse.text()
                    console.error('Voice upload error:', errorText)
                    throw new Error('Failed to upload voice: ' + errorText)
                }

                const uploadResult = await uploadResponse.json()
                voice_url = uploadResult.url
            }

            const newSambat: NewSambat = {
                content: data.content,
                persona_name: data.persona_name,
                is_voice: data.is_voice,
                voice_url: voice_url,
                sentiment: 'neutral',
                expires_at: data.expires_at?.toISOString() || null,
                is_expired: false,
            }

            const { data: created, error } = await supabase
                .from('sambats')
                .insert(newSambat)
                .select()
                .single()

            if (error) throw error

            // Note: Don't add to local state here
            // Realtime subscription will automatically add the new sambat

            return created
        } catch (err) {
            console.error('Error creating sambat:', err)
            throw err
        }
    }

    const addReaction = async (sambatId: string, reactionType: keyof ReactionCounts) => {
        // Note: No optimistic update here - realtime subscription handles it
        try {
            const { error } = await supabase
                .from('reactions')
                .insert({
                    sambat_id: sambatId,
                    reaction_type: reactionType,
                })

            if (error) {
                console.error('Supabase reaction error:', error)
            }
        } catch (err) {
            console.error('Error adding reaction:', err)
        }
    }

    const reportSambat = async (sambatId: string, reason?: string) => {
        try {
            const { error } = await supabase
                .from('reports')
                .insert({
                    sambat_id: sambatId,
                    reason: reason || null,
                })

            if (error) throw error
        } catch (err) {
            console.error('Error reporting sambat:', err)
        }
    }

    useEffect(() => {
        fetchSambats()

        // Subscribe to real-time updates
        const channel = supabase
            .channel('sambats-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'sambats',
                },
                (payload) => {
                    // Add new sambat to the top of the list
                    const newSambat = transformSambat(payload.new as DbSambat, {
                        fire: 0,
                        sad: 0,
                        laugh: 0,
                        hug: 0,
                        skull: 0,
                    })
                    setSambats((prev) => [newSambat, ...prev])
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'sambats',
                },
                (payload) => {
                    // Remove deleted sambat from list
                    setSambats((prev) => prev.filter((s) => s.id !== (payload.old as DbSambat).id))
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'reactions',
                },
                (payload) => {
                    // Update reaction count when new reaction is added
                    const { sambat_id, reaction_type } = payload.new as { sambat_id: string; reaction_type: keyof ReactionCounts }
                    setSambats((prev) =>
                        prev.map((s) =>
                            s.id === sambat_id
                                ? { ...s, reactions: { ...s.reactions, [reaction_type]: s.reactions[reaction_type] + 1 } }
                                : s
                        )
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchSambats])

    return {
        sambats,
        loading,
        error,
        refetch: fetchSambats,
        createSambat,
        addReaction,
        reportSambat,
    }
}

export function useSambat(id: string) {
    const [sambat, setSambat] = useState<Sambat | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        async function fetchSambat() {
            try {
                setLoading(true)

                const { data: sambatData, error: sambatError } = await supabase
                    .from('sambats')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (sambatError) throw sambatError

                // Get reactions
                const { data: reactionsData } = await supabase
                    .from('reactions')
                    .select('reaction_type')
                    .eq('sambat_id', id)

                const reactionCounts: ReactionCounts = {
                    fire: 0,
                    sad: 0,
                    laugh: 0,
                    hug: 0,
                    skull: 0,
                }

                reactionsData?.forEach((r) => {
                    const type = r.reaction_type as keyof ReactionCounts
                    reactionCounts[type]++
                })

                setSambat(transformSambat(sambatData, reactionCounts))
            } catch (err) {
                setError(err as Error)
                console.error('Error fetching sambat:', err)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchSambat()
        }

        // Subscribe to realtime reaction updates for this specific sambat
        const channel = supabase
            .channel(`sambat-${id}-reactions`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'reactions',
                    filter: `sambat_id=eq.${id}`,
                },
                (payload) => {
                    const { reaction_type } = payload.new as { reaction_type: keyof ReactionCounts }
                    setSambat((prev) =>
                        prev
                            ? {
                                ...prev,
                                reactions: {
                                    ...prev.reactions,
                                    [reaction_type]: prev.reactions[reaction_type] + 1,
                                },
                            }
                            : null
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [id])

    return { sambat, loading, error }
}

