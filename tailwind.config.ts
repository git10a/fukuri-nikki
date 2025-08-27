import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        spread: "980px", // 見開き閾値
      },
    },
  },
  plugins: [],
} satisfies Config;

