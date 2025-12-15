/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                glass: {
                    light: 'rgba(255, 255, 255, 0.1)',
                    medium: 'rgba(255, 255, 255, 0.15)',
                    dark: 'rgba(0, 0, 0, 0.2)',
                },
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                accent: {
                    purple: '#a855f7',
                    pink: '#ec4899',
                    orange: '#f97316',
                    green: '#10b981',
                }
            },
            backdropBlur: {
                xs: '2px',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gradient-accent': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.45)',
                'neon': '0 0 20px rgba(14, 165, 233, 0.5)',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-in',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.8)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
