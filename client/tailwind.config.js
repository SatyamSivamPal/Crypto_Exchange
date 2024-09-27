/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-bg':'#0e0f14',
        'rewards': '#4d2766',
        'rewards-text':'#df77f9',
        greenBackgroundTransparent: 'rgba(0,194,120,.12)',
        redBackgroundTransparent: 'rgba(234,56,59,.12)',
        baseBackgroundL2: "rgb(32,33,39)",
        baseBackgroundL3: "rgb(32,33,39)",
        greenPrimaryButtonBackground: "rgb(0,194,120)",
        portfolioBackground: "#14151b",
        buy: "#0d1d1b",
        sell: "#281419",
        spot:"#0d1f3a",
      },
      borderColor: {
        redBorder: 'rgba(234,56,59,.5)',
        greenBorder: 'rgba(0,194,120,.4)',
        baseBorderMed: '#cccccc',
        accentBlue: "rgb(76,148,255)",
        baseBorderLight: "rgb(32,33,39)",
        baseTextHighEmphasis: "rgb(244,244,246)"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      textColor: {
        greenPrimaryButtonText: "rgb(20,21,27)"
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
