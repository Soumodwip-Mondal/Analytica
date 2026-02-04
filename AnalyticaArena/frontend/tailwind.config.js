/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                secondary: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ec4899',
                    600: '#db2777',
                    700: '#be185d',
                    800: '#9f1239',
                    900: '#831843',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'mesh-gradient': 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.05) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(15, 90%, 55%, 0.15) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(339, 49%, 30%, 0.09) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(15, 70%, 40%, 0.1) 0px, transparent 50%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                glow: {
                    '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.3))' },
                    '50%': { filter: 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.6))' },
                },
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(249, 115, 22, 0.2)',
                'glow-md': '0 0 20px rgba(249, 115, 22, 0.3)',
                'glow-lg': '0 0 30px rgba(249, 115, 22, 0.4)',
            },
        },
    },
    plugins: [],
}
