/* @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",  // For Vite projects
    "./src/**/*.{js,jsx,ts,tsx}", // Include React components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        sans: ['Roboto', 'sans-serif'],
    },
    },
  },
  plugins: [],
}

