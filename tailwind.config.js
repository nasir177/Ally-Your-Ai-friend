/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'chat-user': '#8B5CF6',
                'chat-ai': '#F3F4F6',
                accent: {
                    purple: '#A78BFA',
                    pink: '#F472B6',
                    blue: '#60A5FA',
                    green: '#34D399',
                },
            },
            fontFamily: {
                display: ['Quicksand', 'sans-serif'],
                body: ['Poppins', 'sans-serif'],
            },
            animation: {
                'bounce-slow': 'bounce 2s infinite',
                float: 'float 3s ease-in-out infinite',
                gradient: 'gradient 15s ease infinite',
                'spin-slow': 'spin 8s linear infinite',
                shimmer: 'shimmer 2s linear infinite',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
