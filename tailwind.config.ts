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
        bg: {
          DEFAULT: '#0a0a0a',
          card: '#111111',
          elevated: '#1a1a1a',
        },
        toxic: {
          DEFAULT: '#39FF14',
          dim: '#2bcc10',
          glow: 'rgba(57, 255, 20, 0.15)',
        },
        hazmat: {
          DEFAULT: '#FFD700',
          dim: '#cc9900',
        },
        danger: '#FF3333',
        neutral: {
          100: '#f5f5f5',
          200: '#e0e0e0',
          300: '#999999',
          400: '#666666',
          500: '#444444',
          600: '#2a2a2a',
          700: '#1a1a1a',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bubble': 'bubble 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-10vh) scale(1)', opacity: '0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(57, 255, 20, 0.2), 0 0 10px rgba(57, 255, 20, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(57, 255, 20, 0.4), 0 0 40px rgba(57, 255, 20, 0.2)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
