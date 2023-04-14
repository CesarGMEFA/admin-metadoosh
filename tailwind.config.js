/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-doosh': '#212121',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}