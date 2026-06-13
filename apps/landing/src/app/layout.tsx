import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "block", preload: true });

export const metadata: Metadata = {
  title: "Aulify",
  description: "Aulify ayuda a profesores y estudiantes a organizar clases, notas, tareas y actividades."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${inter.className}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
