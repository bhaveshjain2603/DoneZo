module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your React components
    "./index.html", // Include the HTML file if required
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
      },
    },
  },
  plugins: [],
};
