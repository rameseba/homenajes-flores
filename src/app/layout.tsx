import type { Metadata, Viewport } from "next";
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
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: "Floristería",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    siteName: site.name,
    locale: "es_CL",
    type: "website",
    url: site.url,
    title: `${site.name} — Flores blancas de condolencias`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Flores blancas de condolencias`,
    description: site.description,
    images: ["/og.jpg"],
  },
  appleWebApp: { capable: true, title: site.name, statusBarStyle: "default" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#5e6650",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Florist",
  "@id": `${site.url}/#florist`,
  name: site.name,
  url: site.url,
  image: `${site.url}/og.jpg`,
  logo: `${site.url}/icon-512.png`,
  description: site.description,
  slogan: site.tagline,
  telephone: `+${site.whatsapp}`,
  email: site.email,
  priceRange: "$$",
  currenciesAccepted: "CLP",
  paymentAccepted: "Efectivo, Transferencia",
  areaServed: [
    { "@type": "City", name: "Santiago" },
    { "@type": "AdministrativeArea", name: "Región Metropolitana" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santiago",
    addressRegion: "Región Metropolitana",
    addressCountry: "CL",
  },
  geo: { "@type": "GeoCoordinates", latitude: -33.4489, longitude: -70.6693 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  sameAs: [`https://wa.me/${site.whatsapp}`],
  knowsAbout: [
    "Coronas de flores",
    "Cubre urna de rosas",
    "Pie de urna",
    "Atril floral",
    "Arreglos de condolencias",
    "Rosas blancas para velatorio",
  ],
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
