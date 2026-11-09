import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Proveedores } from "@/components/proveedores";

import "./globals.css";

const fuenteSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fuenteMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rutify",
    template: "%s · Rutify",
  },
  description: "Gestión de alumnos y rutinas de entrenamiento.",
  applicationName: "Rutify",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      suppressHydrationWarning
      className={`${fuenteSans.variable} ${fuenteMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Proveedores>{children}</Proveedores>
      </body>
    </html>
  );
}
