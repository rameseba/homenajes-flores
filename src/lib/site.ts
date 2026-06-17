// Constantes de marca y SEO derivadas del contenido por defecto.
// El dominio final se ajusta al conectar el .cl en Cloudflare.
export const site = {
  name: "Homenajes Florales",
  legalName: "Homenajes Florales",
  tagline: "Flores blancas para honrar y acompañar",
  description:
    "Arreglos florales de condolencias y homenaje en Santiago: coronas, cubre urnas, atriles, pies de urna y canastos de rosas blancas. Cotiza con cariño y de forma directa por WhatsApp.",
  url: "https://homenajeflorales.cl",
  whatsapp: "56956199315",
  email: "homenajeflorales@gmail.com",
  city: "Santiago, Chile",
} as const;

// Número en formato legible para mostrar.
export const WHATSAPP_DISPLAY = "+56 9 5619 9315";

// Construye un enlace de WhatsApp con mensaje prellenado.
export function waLink(message: string, phone: string = site.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
