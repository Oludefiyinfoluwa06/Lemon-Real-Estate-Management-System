module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "logo": "#96AD00",
        "darkSlateGray": "#2F4F4F",
        "charcoal": "#36454F",
        "gunmetal": "#2A3439",
        "darkGreen": "#013220",
        "ebony": "#555D50"
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

