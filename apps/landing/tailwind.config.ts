import { tailwindThemeExtension } from "@aulify/design-system";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      ...tailwindThemeExtension,
      fontFamily: {
        sans: ["var(--font-inter)", "Inter"]
      }
    }
  },
  plugins: []
};

export default config;
