import { colors, motion, radius, shadows, spacing, typography } from "./tokens";

export const cssVariableNames = {
  colors: {
    brandGreen: "--aulify-color-brand-green",
    brandGreenLight: "--aulify-color-brand-green-light",
    neutralOffWhite: "--aulify-color-neutral-off-white",
    neutralLightGray: "--aulify-color-neutral-light-gray",
    neutralDarkGray: "--aulify-color-neutral-dark-gray",
    neutralBlack: "--aulify-color-neutral-black",
    neutralWhite: "--aulify-color-neutral-white"
  },
  typography: {
    fontSans: "--aulify-font-sans"
  },
  radius: {
    sm: "--aulify-radius-sm",
    md: "--aulify-radius-md",
    lg: "--aulify-radius-lg",
    xl: "--aulify-radius-xl",
    "2xl": "--aulify-radius-2xl",
    "3xl": "--aulify-radius-3xl",
    full: "--aulify-radius-full"
  },
  shadows: {
    soft: "--aulify-shadow-soft",
    card: "--aulify-shadow-card",
    floating: "--aulify-shadow-floating"
  },
  spacing: {
    0: "--aulify-spacing-0",
    1: "--aulify-spacing-1",
    2: "--aulify-spacing-2",
    3: "--aulify-spacing-3",
    4: "--aulify-spacing-4",
    5: "--aulify-spacing-5",
    6: "--aulify-spacing-6",
    8: "--aulify-spacing-8",
    10: "--aulify-spacing-10",
    12: "--aulify-spacing-12",
    16: "--aulify-spacing-16",
    20: "--aulify-spacing-20",
    24: "--aulify-spacing-24"
  },
  motion: {
    fast: "--aulify-motion-fast",
    base: "--aulify-motion-base",
    slow: "--aulify-motion-slow"
  }
} as const;

export const cssVariables = {
  [cssVariableNames.colors.brandGreen]: colors.brand.green,
  [cssVariableNames.colors.brandGreenLight]: colors.brand.greenLight,
  [cssVariableNames.colors.neutralOffWhite]: colors.neutral.offWhite,
  [cssVariableNames.colors.neutralLightGray]: colors.neutral.lightGray,
  [cssVariableNames.colors.neutralDarkGray]: colors.neutral.darkGray,
  [cssVariableNames.colors.neutralBlack]: colors.neutral.black,
  [cssVariableNames.colors.neutralWhite]: colors.neutral.white,
  [cssVariableNames.typography.fontSans]: typography.fontFamily.sans.join(", "),
  [cssVariableNames.radius.sm]: radius.sm,
  [cssVariableNames.radius.md]: radius.md,
  [cssVariableNames.radius.lg]: radius.lg,
  [cssVariableNames.radius.xl]: radius.xl,
  [cssVariableNames.radius["2xl"]]: radius["2xl"],
  [cssVariableNames.radius["3xl"]]: radius["3xl"],
  [cssVariableNames.radius.full]: radius.full,
  [cssVariableNames.shadows.soft]: shadows.soft,
  [cssVariableNames.shadows.card]: shadows.card,
  [cssVariableNames.shadows.floating]: shadows.floating,
  [cssVariableNames.spacing[0]]: spacing[0],
  [cssVariableNames.spacing[1]]: spacing[1],
  [cssVariableNames.spacing[2]]: spacing[2],
  [cssVariableNames.spacing[3]]: spacing[3],
  [cssVariableNames.spacing[4]]: spacing[4],
  [cssVariableNames.spacing[5]]: spacing[5],
  [cssVariableNames.spacing[6]]: spacing[6],
  [cssVariableNames.spacing[8]]: spacing[8],
  [cssVariableNames.spacing[10]]: spacing[10],
  [cssVariableNames.spacing[12]]: spacing[12],
  [cssVariableNames.spacing[16]]: spacing[16],
  [cssVariableNames.spacing[20]]: spacing[20],
  [cssVariableNames.spacing[24]]: spacing[24],
  [cssVariableNames.motion.fast]: motion.fast,
  [cssVariableNames.motion.base]: motion.base,
  [cssVariableNames.motion.slow]: motion.slow
} as const;

export const cssVariablesString = `:root {
  --aulify-color-brand-green: ${colors.brand.green};
  --aulify-color-brand-green-light: ${colors.brand.greenLight};
  --aulify-color-neutral-off-white: ${colors.neutral.offWhite};
  --aulify-color-neutral-light-gray: ${colors.neutral.lightGray};
  --aulify-color-neutral-dark-gray: ${colors.neutral.darkGray};
  --aulify-color-neutral-black: ${colors.neutral.black};
  --aulify-color-neutral-white: ${colors.neutral.white};
  --aulify-font-sans: ${typography.fontFamily.sans.join(", ")};
  --aulify-radius-sm: ${radius.sm};
  --aulify-radius-md: ${radius.md};
  --aulify-radius-lg: ${radius.lg};
  --aulify-radius-xl: ${radius.xl};
  --aulify-radius-2xl: ${radius["2xl"]};
  --aulify-radius-3xl: ${radius["3xl"]};
  --aulify-radius-full: ${radius.full};
  --aulify-shadow-soft: ${shadows.soft};
  --aulify-shadow-card: ${shadows.card};
  --aulify-shadow-floating: ${shadows.floating};
  --aulify-spacing-0: ${spacing[0]};
  --aulify-spacing-1: ${spacing[1]};
  --aulify-spacing-2: ${spacing[2]};
  --aulify-spacing-3: ${spacing[3]};
  --aulify-spacing-4: ${spacing[4]};
  --aulify-spacing-5: ${spacing[5]};
  --aulify-spacing-6: ${spacing[6]};
  --aulify-spacing-8: ${spacing[8]};
  --aulify-spacing-10: ${spacing[10]};
  --aulify-spacing-12: ${spacing[12]};
  --aulify-spacing-16: ${spacing[16]};
  --aulify-spacing-20: ${spacing[20]};
  --aulify-spacing-24: ${spacing[24]};
  --aulify-motion-fast: ${motion.fast};
  --aulify-motion-base: ${motion.base};
  --aulify-motion-slow: ${motion.slow};
}`;

export type CssVariableNames = typeof cssVariableNames;
