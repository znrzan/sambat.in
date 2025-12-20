import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Token required' },
                { status: 400 }
            )
        }

        const secretKey = process.env.TURNSTILE_SECRET_KEY

        if (!secretKey) {
            console.error('TURNSTILE_SECRET_KEY not configured')
            // In development without key, allow through
            if (process.env.NODE_ENV === 'development') {
                return NextResponse.json({ success: true })
            }
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            )
        }

        const response = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    secret: secretKey,
                    response: token,
                }),
            }
        )

        const data = await response.json()

        return NextResponse.json({
            success: data.success,
            error: data.success ? undefined : 'Verification failed',
        })
    } catch (error) {
        console.error('Turnstile verification error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
