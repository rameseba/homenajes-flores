import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ContentProvider } from "@/components/content-provider";
import { site } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Flores blancas de condolencias en Santiago`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "flores de condolencias",
    "arreglos fúnebres",
    "coronas de flores",
    "cubre urna",
    "rosas blancas",
    "flores para velatorio",
    "homenaje floral Santiago",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    siteName: site.name,
    locale: "es_CL",
    type: "website",
    url: site.url,
    title: `${site.name} — Flores blancas de condolencias`,
    description: site.description,
    images: [{ url: "/productos/pie-urna-25-mostrador-lg.webp", width: 1200, height: 1600, alt: site.name }],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Florist",
  name: site.name,
  url: site.url,
  image: `${site.url}/productos/pie-urna-25-mostrador-lg.webp`,
  description: site.description,
  slogan: site.tagline,
  telephone: `+${site.whatsapp}`,
  email: site.email,
  areaServed: { "@type": "City", name: "Santiago" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santiago",
    addressRegion: "Región Metropolitana",
    addressCountry: "CL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
