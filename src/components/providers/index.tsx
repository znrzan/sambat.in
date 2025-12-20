'use client'

import { ThemeProvider } from './theme-provider'
import { WelcomeModal } from '@/components/modals/WelcomeModal'
import { usePersona } from '@/hooks/usePersona'

function WelcomeWrapper({ children }: { children: React.ReactNode }) {
    const { setPersona } = usePersona()

    const handleComplete = (name: string) => {
        setPersona(name)
    }

    return (
        <>
            <WelcomeModal onComplete={handleComplete} />
            {children}
        </>
    )
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <WelcomeWrapper>
                {children}
            </WelcomeWrapper>
        </ThemeProvider>
    )
}


