/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',      // Than chì / Slate dark
          charcoal: '#1e293b',  // Đen than thứ cấp
          slate: '#334155',
          gold: '#c59b27',      // Vàng đồng kim khí
          goldhover: '#b45309',
          goldlight: '#fef3c7',
          silver: '#f8fafc',
          border: '#e2e8f0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
