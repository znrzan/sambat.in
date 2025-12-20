import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Get file extension from content type
        const contentType = file.type || 'audio/webm'
        const extension = contentType.includes('mp4') ? 'mp4' :
            contentType.includes('webm') ? 'webm' :
                contentType.includes('wav') ? 'wav' : 'mp3'

        // Upload to Cloudinary
        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video', // 'video' handles audio files
                    folder: 'voice-sambat',
                    format: extension,
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result as { secure_url: string })
                }
            ).end(buffer)
        })

        return NextResponse.json({
            success: true,
            url: result.secure_url,
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        )
    }
}
