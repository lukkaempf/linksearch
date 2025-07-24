/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Folder colors - diese Klassen sollen immer verfügbar sein
    'bg-blue-500',
    'bg-purple-500', 
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-gray-500'
  ],
  theme: { extend: {} },
  plugins: [],
}
