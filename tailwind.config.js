/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#F5F5EF',
        ink: '#171A18',
        ink2: '#555B55',
        lime: '#C8F169',
        orange: '#F18B50',
        panel: '#FFFFFF',
        divider: '#D9DDD4',
        // dark theme (applied via .dark on html)
        'canvas-dark': '#151815',
        'ink-dark': '#F1F2EA',
        'ink2-dark': '#B1B7AC',
        'panel-dark': '#20251F',
        'divider-dark': '#394037',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        editorial: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        'screen-xl2': '1440px',
      },
    },
  },
  plugins: [],
};
