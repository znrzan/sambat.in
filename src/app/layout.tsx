import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
    title: 'SAMBAT.IN - Sambat aja dulu',
    description: 'Platform anonim untuk curhat dan keluh kesah. Tulis sambatanmu, pilih kapan mau hangus, dan share ke dunia!',
    keywords: ['sambat', 'curhat', 'anonim', 'indonesia', 'keluh kesah'],
    openGraph: {
        title: 'SAMBAT.IN',
        description: 'Sambat aja dulu',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body className="antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
