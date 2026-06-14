import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@blocknote/mantine/style.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "block", preload: true });

export const metadata: Metadata = {
  title: "Aulify App",
  description: "Authenticated app for Aulify"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${inter.className}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
