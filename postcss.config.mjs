const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Lets the whole layout scale with the root font size on large screens (see base.css).
    "postcss-pxtorem": {
      rootValue: 16,
      propList: ["*"],
      mediaQuery: false,
      minPixelValue: 2,
    },
  },
};

export default config;
