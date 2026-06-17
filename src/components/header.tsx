"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useContent } from "@/components/content-provider";
import { WhatsAppButton } from "@/components/whatsapp-button";

const LEFT = [
  { href: "#arreglos", label: "Arreglos" },
  { href: "#galeria", label: "Galería" },
];
const RIGHT = [
  { href: "#confianza", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const { identity } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;
  const linkCls = `text-sm font-medium uppercase tracking-[0.12em] transition-colors ${
    solid ? "text-ink/75 hover:text-ink" : "text-white/90 hover:text-white drop-shadow-sm"
  }`;

  return (
    <header
      data-section="identidad"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-hairline bg-bone/90 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-2.5">
        {/* Izquierda */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal izquierda">
          {LEFT.map((l) => (
            <a key={l.href} href={l.href} className={linkCls}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* Botón menú (móvil) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`justify-self-start rounded-full p-2 md:hidden ${solid ? "text-ink" : "text-white drop-shadow-sm"}`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo central */}
        <a href="#inicio" className="justify-self-center" aria-label={identity.nombre}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={solid ? identity.logo : "/logo-white.webp"}
            alt={identity.nombre}
            className={`w-auto object-contain transition-all duration-300 ${
              solid ? "h-16 sm:h-20" : "h-24 drop-shadow-md sm:h-28"
            }`}
          />
        </a>

        {/* Derecha */}
        <nav className="hidden items-center justify-end gap-7 md:flex" aria-label="Principal derecha">
          {RIGHT.map((l) => (
            <a key={l.href} href={l.href} className={linkCls}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* Espaciador derecho (móvil) para centrar el logo */}
        <span className="w-10 justify-self-end md:hidden" aria-hidden="true" />
      </div>

      {open && (
        <nav className="border-t border-hairline bg-bone/95 px-5 py-4 backdrop-blur-md md:hidden" aria-label="Móvil">
          <ul className="flex flex-col gap-1">
            {[...LEFT, ...RIGHT].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-base font-medium text-ink hover:bg-sage-50"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <WhatsAppButton
              message={`Hola ${identity.nombre}, quisiera cotizar un arreglo floral.`}
              phone={identity.whatsapp}
              variant="soft"
              className="w-full"
            >
              Cotizar por WhatsApp
            </WhatsAppButton>
          </div>
        </nav>
      )}
    </header>
  );
}
