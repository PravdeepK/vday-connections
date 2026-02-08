import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "conn-yellow": "#f9df6d",
        "conn-green": "#a0c35a",
        "conn-blue": "#b0c4ef",
        "conn-purple": "#ba81c5",
      },
      fontFamily: {
        sans: ['"Libre Franklin"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
