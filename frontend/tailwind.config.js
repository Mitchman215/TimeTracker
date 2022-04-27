module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brown': '#583000',
        'orange': {
          'lighter': '#ffdaaf',
          'light': '#f2c894',
          'medium': '#ffb347',
          'dark': '#ff985a'
        },
        'blue': {
          'light': '#9fc0de',
          'medium': '#779ecc',
          'dark': '#024089'
        },
        'purple': {
          'light': '#A37AC2',
          'medium': '#8b5cf6',
          'dark': '#6d28d9'
        },
        'silver': '#e1e3e7'

      },
    },
  },
  plugins: [],
}
