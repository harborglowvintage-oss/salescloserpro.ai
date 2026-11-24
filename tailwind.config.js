/** @type {import('tailwindcss').Config} */

/*
 * LLMadvisor.ai brand tokens — the single source of truth for salescloserpro.ai colour.
 * Anchors come from the live llmadvisor.ai stylesheet (Static/exec.css) and its mark:
 *   ink #071b1f · teal #0c3a42 · teal-2 #124a53 · bone #efe9dc · paper #f7f4ed
 *   on-dark #e9e4d8 · on-dark-muted #a9bcbd · copper #8f552b (on light) / #d8b38a (on dark)
 *   mint #3fbbb0 (the teal temple of the glasses mark)
 * Components use `brand-*` (teal/cyan, primary app UI), `copper-*` (accent), `ink-*`
 * (warm teal-black neutrals; ink-100 is "bone", the primary button on dark) and `mint`.
 */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#e6f3f4',
          100: '#c7e7ea',
          200: '#98d3d9',
          300: '#5fbcc6',
          400: '#38b3c1',
          500: '#1c9fb0',
          600: '#007a8a',
          700: '#0b6370',
          800: '#124a53',
          900: '#0c3a42',
          950: '#071b1f',
        },
        copper: {
          50:  '#fbf2e9',
          100: '#f5e0cc',
          200: '#ebc29d',
          300: '#d8b38a',
          400: '#cf9a66',
          500: '#c2703a',
          600: '#a65a2b',
          700: '#8f552b',
          800: '#66351b',
          900: '#4a2714',
        },
        mint: '#3fbbb0',
        ink: {
          50:  '#f7f4ed',
          100: '#efe9dc',
          200: '#e9e4d8',
          300: '#c9cfc9',
          400: '#a9bcbd',
          500: '#7f9497',
          600: '#54666a',
          700: '#2c4549',
          800: '#15333a',
          900: '#0c252a',
          950: '#071b1f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1.5deg)' },
          '50%':      { transform: 'translateY(-10px) rotate(-0.5deg)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 6px rgba(63,187,176,0.55), 0 0 14px rgba(63,187,176,0.25)' },
          '50%':      { textShadow: '0 0 10px rgba(63,187,176,0.95), 0 0 26px rgba(63,187,176,0.55), 0 0 44px rgba(63,187,176,0.25)' },
        },
      },
      animation: {
        float: 'float 9s ease-in-out infinite',
        glow: 'glow 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
