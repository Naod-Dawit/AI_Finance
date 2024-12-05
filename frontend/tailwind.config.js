/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-linear-bg": "linear-gradient(45deg, #262222 0%, #504B4B 100%)"
      }
    },
    
  },
  plugins: [],
};
