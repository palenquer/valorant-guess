const colors = require("tailwindcss/colors");

module.exports = {
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      anton: ["Anton", "sans-serif"],
      rock: ["Rock Salt", "cursive"],
      roboto: ["Roboto", "sans-serif"],
    },
    colors: {
      primary: "#FD4556",
      secondary: "#BD3944",
      wine: "#53212B",
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      green: colors.emerald,
    },
    extend: {},
  },
  variants: {
    extend: {
      brightness: ["hover", "focus"],
      opacity: ["disabled"],
      cursor: ["disabled"],
      backgroundColor: ["disabled"],
    },
  },
  plugins: [],
};
