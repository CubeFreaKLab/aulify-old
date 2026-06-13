const appBaseUrl = (process.env.NEXT_PUBLIC_WEB_APP_URL || "http://localhost:3001").replace(/\/$/, "");

export const appLinks = {
  login: `${appBaseUrl}/auth/login`,
  register: `${appBaseUrl}/auth/register`
} as const;
