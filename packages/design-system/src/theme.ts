import { colors, motion, radius, shadows, spacing, typography } from "./tokens";

export const tailwindThemeExtension = {
  colors: {
    brand: colors.brand,
    neutral: colors.neutral
  },
  fontFamily: typography.fontFamily,
  borderRadius: radius,
  boxShadow: shadows,
  spacing,
  transitionDuration: motion
} as const;

export type TailwindThemeExtension = typeof tailwindThemeExtension;
