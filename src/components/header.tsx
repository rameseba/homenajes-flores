"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useContent } from "@/components/content-provider";
import { WhatsAppButton } from "@/components/whatsapp-button";

const LINKS = [
  { href: "#arreglos", label: "Arreglos" },
  { href: "#galeria", label: "Galería" },
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

  return (
    <header
      data-section="identidad"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-hairline bg-bone/90 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:py-4">
        <a href="#inicio" className="flex items-center gap-2.5" aria-label={identity.nombre}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={identity.logo}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-hairline"
          />
          <span className="font-display text-lg leading-tight tracking-tight text-ink sm:text-xl">
            {identity.nombre}
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppButton
            message={`Hola ${identity.nombre}, quisiera cotizar un arreglo floral.`}
            phone={identity.whatsapp}
            variant="soft"
            className="px-5 py-2.5"
          >
            Cotizar
          </WhatsAppButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-ink md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-hairline bg-bone/95 px-5 py-4 backdrop-blur md:hidden" aria-label="Móvil">
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
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
