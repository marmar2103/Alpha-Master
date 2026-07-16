/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        card: '#14141e',
        mint: '#7ef2c3',
        violet: '#a78bfa',
        amber: '#f59e0b',
        rose: '#fb7185',
        sky: '#38bdf8',
        emerald: '#34d399',
      },
      fontFamily: {
        syne: ['Syne_700Bold'],
        'syne-black': ['Syne_800ExtraBold'],
        sans: ['DMSans_400Regular'],
      },
    },
  },
  plugins: [],
};
