/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080810',
        surface: '#0f0f1a',
        'surface-light': '#161628',
        border: 'rgba(255,255,255,0.06)',
        accent: '#7b5ea7',
        'accent-bright': '#9d7fd4',
        'accent-glow': 'rgba(123,94,167,0.25)',
        cyan: '#4fc4cf',
        'text-primary': '#f0eeff',
        'text-muted': '#8887a8',
        'text-dim': '#4a4a6a',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
