"use client";

import { MessageCircle } from "lucide-react";
import { useContent } from "@/components/content-provider";
import { waLink } from "@/lib/site";

// Botón flotante de WhatsApp, siempre a mano (sobre todo en móvil).
export function FloatWhatsApp() {
  const { identity } = useContent();
  return (
    <a
      href={waLink(`Hola ${identity.nombre}, quisiera cotizar un arreglo floral de homenaje.`, identity.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whats text-white shadow-lg shadow-sage-900/20 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
