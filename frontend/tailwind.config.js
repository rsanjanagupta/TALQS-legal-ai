/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        talqsBg: '#000000',
        talqsCard: '#111111',
        talqsAccent: '#ffffff',
        talqsAccentSoft: '#f5f5f5',
      },
    },
  },
  plugins: [],
}
