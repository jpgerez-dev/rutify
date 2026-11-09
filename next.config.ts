import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desactivado a propósito: todas las páginas dependen de la sesión (no hay nada
  // que prerenderizar) y Cache Components exige runtime Node, lo que complica el
  // deploy en Cloudflare Workers. Ver CLAUDE.md.
  cacheComponents: false,
  partialPrefetching: false,
  images: {
    // Sin optimizador de imágenes de Next (portabilidad Cloudflare/Netlify).
    // Las imágenes ya se guardan redimensionadas en Supabase Storage.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      // Fotos de ejercicios/logo se suben directo a Storage desde el navegador;
      // las Server Actions solo reciben datos de formularios.
      bodySizeLimit: "1mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
