const appBaseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:5173").replace(/\/$/, "");

export const appLinks = {
  login: `${appBaseUrl}/auth/login`,
  register: `${appBaseUrl}/auth/register`
} as const;
