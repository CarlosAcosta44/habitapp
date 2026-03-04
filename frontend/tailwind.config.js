/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",   // Vite escanea estos archivos para purgar CSS
  ],
  theme: { extend: {} },
  plugins: [],
}
