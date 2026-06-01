export const colors = {
  brand: {
    green: "#049A4E",
    greenLight: "#B8FAC6"
  },
  neutral: {
    offWhite: "#FAFAF8",
    lightGray: "#ECECE7",
    darkGray: "#60615A",
    black: "#0F0F0F",
    white: "#FFFFFF"
  }
} as const;

export const typography = {
  fontFamily: {
    sans: ["Inter"]
  }
} as const;

export const radius = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  "3xl": "24px",
  full: "9999px"
} as const;

export const shadows = {
  soft: "0 1px 3px rgb(15 15 15 / 8%)",
  card: "0 8px 24px rgb(15 15 15 / 8%)",
  floating: "0 18px 48px rgb(15 15 15 / 12%)"
} as const;

export const spacing = {
  0: "0",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px"
} as const;

export const motion = {
  fast: "120ms",
  base: "180ms",
  slow: "280ms"
} as const;

export const designTokens = {
  colors,
  typography,
  radius,
  shadows,
  spacing,
  motion
} as const;

export type DesignTokens = typeof designTokens;
export type AulifyColorTokens = typeof colors;
