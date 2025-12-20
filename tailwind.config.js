/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'bg-primary': '#0F0F14',
                'bg-secondary': '#1A1A24',
                'bg-tertiary': '#252532',
                'accent-red': '#FF4D6A',
                'accent-blue': '#6B8AFF',
                'accent-purple': '#A855F7',
                'accent-yellow': '#FBBF24',
                'accent-green': '#34D399',
                'text-primary': '#FFFFFF',
                'text-secondary': '#A1A1B5',
                'text-muted': '#6B6B80',
            },
            fontFamily: {
                heading: ['Plus Jakarta Sans', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                'sm': '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '24px',
            },
            boxShadow: {
                'glow-red': '0 0 40px rgba(255, 77, 106, 0.3)',
                'glow-blue': '0 0 40px rgba(107, 138, 255, 0.3)',
                'glow-yellow': '0 0 40px rgba(251, 191, 36, 0.3)',
                'glow-purple': '0 0 40px rgba(168, 85, 247, 0.3)',
                'glow-green': '0 0 40px rgba(52, 211, 153, 0.3)',
            },
            animation: {
                'burning': 'burning 0.3s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                burning: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-2px)' },
                    '75%': { transform: 'translateX(2px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.5' },
                    '50%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
