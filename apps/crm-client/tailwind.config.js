/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(236, 72, 153, 0.4)',
        'glow-lg': '0 0 40px -10px rgba(236, 72, 153, 0.5)',
        '3d': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
