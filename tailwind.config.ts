import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
        'tajawal': ['Tajawal', 'sans-serif'],
      },
      colors: {
        darkGreen: '#151252',
        gold: '#C63D00',
        teal: '#C63D00',
        surface: '#E8E7E8',
        'primary-teal': '#151252',
        'gold-dark': '#A43300',
        'light-section': '#E8E7E8',
        footer: '#1E1D31',
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#e8e8f5',
          100: '#cccceb',
          200: '#a3a3d8',
          300: '#7a7ac4',
          400: '#4f4fae',
          500: '#2f2f8f',
          600: '#242470',
          700: '#1d1d5d',
          800: '#151252',
          900: '#0f0d3e',
          DEFAULT: '#151252',
        },
        secondary: {
          50: '#fbece5',
          100: '#f2c9b3',
          500: '#C63D00',
          600: '#ae3600',
          700: '#8f2d00',
          800: '#732400',
          900: '#581b00',
          DEFAULT: '#C63D00',
        },
        accent: {
          50: '#fbece5',
          100: '#f2c9b3',
          200: '#e9a67f',
          300: '#e0824c',
          400: '#d7631f',
          500: '#C63D00',
          600: '#a93400',
          700: '#8b2b00',
          800: '#6f2200',
          900: '#541900',
          DEFAULT: '#C63D00',
        },
        light: {
          50: '#f9f8f9',
          100: '#f3f2f3',
          200: '#ecebec',
          300: '#e8e7e8',
          400: '#dddcdc',
          500: '#c5c3c5',
          600: '#a4a2a4',
          700: '#838083',
          800: '#625f62',
          900: '#423f42',
          DEFAULT: '#E8E7E8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scroll': 'scroll 30s linear infinite',
        'scroll-reverse': 'scrollReverse 25s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },

    },
  },
  plugins: [
    require('tailwindcss-rtl')
  ],
};

export default config;