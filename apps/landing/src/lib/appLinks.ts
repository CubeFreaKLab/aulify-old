const appBaseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://app.aulify.org").replace(/\/$/, "");

export const appLinks = {
  login: `${appBaseUrl}/auth/login`,
  register: `${appBaseUrl}/auth/register`
} as const;
