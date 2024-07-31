module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "chartreuse": "#BBCC13",
        "frenchGray": {
          "light": "#57606D",
          "dark": "#3D454B",
        },
        "darkBrown": "#616A60",
        "darkUmber": {
          "light": "#2B3B3C",
          "dark": "#212A2B"
        },
        transparentBlack: 'rgba(0,0,0,0.65)',
        transparentWhite: 'rgba(255,255,255,0.1)',
      },
      fontFamily: {
        rthin: ["Raleway-Thin", "sans-serif"],
        rextralight: ["Raleway-ExtraLight", "sans-serif"],
        rlight: ["Raleway-Light", "sans-serif"],
        rregular: ["Raleway-Regular", "sans-serif"],
        rmedium: ["Raleway-Medium", "sans-serif"],
        rsemibold: ["Raleway-SemiBold", "sans-serif"],
        rbold: ["Raleway-Bold", "sans-serif"],
        rextrabold: ["Raleway-ExtraBold", "sans-serif"],
        rblack: ["Raleway-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
}

