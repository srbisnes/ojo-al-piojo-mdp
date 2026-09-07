import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ojo al Piojo | Inteligencia Inmobiliaria Mar del Plata",
  description:
    "Plataforma de inteligencia inmobiliaria para inversores en Mar del Plata. Clasificación IA, rentabilidad estacional y CRM integrado.",
  keywords: [
    "Mar del Plata",
    "inmobiliaria",
    "inversión",
    "alquiler temporario",
    "ROI",
    "MDP",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100 min-h-screen`}>
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
