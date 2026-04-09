import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0d1a0d', card: '#121f12', elevated: '#1a2a1a' },
        stink: { DEFAULT: '#7CFC00', dim: '#5cbf00', glow: 'rgba(124,252,0,0.15)' },
        gas: { DEFAULT: '#ADFF2F', dim: '#8BCB23' },
        fart: { brown: '#8B6914', tan: '#C49B2F', cloud: 'rgba(139,105,20,0.2)' },
        danger: '#FF4444',
      },
      fontFamily: {
        bungee: ['Bungee', 'cursive'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'wobble': 'wobble 3s ease-in-out infinite',
        'float-up': 'floatUp 12s ease-in-out infinite',
        'stink-pulse': 'stinkPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(-2deg) scale(1)' },
          '50%': { transform: 'rotate(2deg) scale(1.02)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(100vh) scale(0.5)', opacity: '0' },
          '10%': { opacity: '0.4' },
          '90%': { opacity: '0.2' },
          '100%': { transform: 'translateY(-10vh) scale(1.2)', opacity: '0' },
        },
        stinkPulse: {
          '0%': { boxShadow: '0 0 10px rgba(124,252,0,0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(124,252,0,0.3), 0 0 60px rgba(124,252,0,0.1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
