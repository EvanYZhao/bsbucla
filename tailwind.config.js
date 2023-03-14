/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      neutral: colors.neutral,
      lime: colors.lime,
      sky: colors.sky,
      orange: colors.orange,
      blue: colors.blue,
      indigo: colors.indigo,
      red: colors.red,
      violet: colors.violet,
      green: colors.green,
      fuchsia: colors.fuchsia,
      yellow: colors.yellow,
      pink: colors.pink,
      teal: colors.teal,
      rose: colors.rose,
      white: colors.white
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
