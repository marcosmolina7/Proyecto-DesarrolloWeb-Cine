// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ⬅️ CAMBIO CLAVE: Habilitar modo oscuro por clases
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [],
}