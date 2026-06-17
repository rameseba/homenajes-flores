"use client";

import { Mail, MessageCircle } from "lucide-react";
import { useContent } from "@/components/content-provider";
import { waLink } from "@/lib/site";

export function Footer() {
  const { footer, identity } = useContent();
  const year = new Date().getFullYear();

  return (
    <footer data-section="footer" className="border-t border-hairline bg-bone">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={identity.logo}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-hairline"
              />
              <span className="font-display text-lg text-ink">{identity.nombre}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{footer.nota}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-semibold text-ink">Navegación</p>
              <ul className="mt-3 space-y-2 text-muted">
                <li><a href="#arreglos" className="hover:text-ink">Arreglos</a></li>
                <li><a href="#galeria" className="hover:text-ink">Galería</a></li>
                <li><a href="#confianza" className="hover:text-ink">Nosotros</a></li>
                <li><a href="#contacto" className="hover:text-ink">Contacto</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-ink">Contacto</p>
              <ul className="mt-3 space-y-2 text-muted">
                <li>
                  <a
                    href={waLink(`Hola ${identity.nombre}, quisiera cotizar un arreglo floral.`, identity.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-ink"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {identity.whatsappDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${identity.email}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {identity.email}
                  </a>
                </li>
                <li className="text-muted">{identity.ciudad}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-hairline pt-6 text-xs text-muted sm:flex-row">
          <p>© {year} {footer.copyright}. Todos los derechos reservados.</p>
          <a href="/editar-web" className="text-muted/70 transition-colors hover:text-sage-600">
            Administrar sitio
          </a>
        </div>
      </div>
    </footer>
  );
}
