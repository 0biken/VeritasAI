import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    start: '#0EA5E9',
                    end: '#A855F7',
                },
                validation: {
                    DEFAULT: '#10B981',
                    light: '#34D399',
                    dark: '#059669',
                },
                accent: {
                    DEFAULT: '#F59E0B',
                    light: '#FCD34D',
                },
                background: {
                    primary: '#0F172A',
                    secondary: '#1E293B',
                    tertiary: '#334155',
                },
                surface: {
                    base: 'rgba(255, 255, 255, 0.03)',
                    elevated: 'rgba(255, 255, 255, 0.06)',
                    high: 'rgba(255, 255, 255, 0.10)',
                },
            },
            fontFamily: {
                display: [
                    'SF Pro Display',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'system-ui',
                    'sans-serif',
                ],
                body: ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
                mono: ['SF Mono', 'JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
            },
            fontSize: {
                'display-xl': ['72px', { lineHeight: '78px', letterSpacing: '-0.015em', fontWeight: '700' }],
                'display-lg': ['60px', { lineHeight: '66px', letterSpacing: '-0.012em', fontWeight: '700' }],
                'display-md': ['48px', { lineHeight: '54px', letterSpacing: '-0.008em', fontWeight: '600' }],
                'display-sm': ['36px', { lineHeight: '42px', letterSpacing: '-0.005em', fontWeight: '600' }],
            },
            borderRadius: {
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '20px',
            },
            backdropBlur: {
                xs: '4px',
                sm: '8px',
                DEFAULT: '12px',
                md: '16px',
                lg: '20px',
                xl: '24px',
            },
            boxShadow: {
                'glow-cyan': '0 4px 16px rgba(14, 165, 233, 0.3)',
                'glow-purple': '0 4px 16px rgba(168, 85, 247, 0.3)',
                'glow-cyan-lg': '0 8px 24px rgba(14, 165, 233, 0.4)',
                'elevation-sm': '0 1px 3px rgba(0, 0, 0, 0.12)',
                'elevation-md': '0 4px 16px rgba(0, 0, 0, 0.2)',
                'elevation-lg': '0 12px 40px rgba(0, 0, 0, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                shimmer: 'shimmer 1.5s infinite',
                'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.6' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
