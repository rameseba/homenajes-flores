"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Flower2, X } from "lucide-react";
import { useContent } from "@/components/content-provider";
import { Photo } from "@/components/photo";
import { WhatsAppButton } from "@/components/whatsapp-button";
import type { Producto } from "@/lib/content-schema";

// Orden del carrusel: parte en la foto de catálogo (blanca).
const ORDER: (keyof Producto["img"])[] = ["blanca", "mostrador", "real"];

const VARIANT_LABELS: { key: keyof Producto["img"]; label: string }[] = [
  { key: "mostrador", label: "En el lugar" },
  { key: "blanca", label: "Catálogo" },
  { key: "real", label: "Foto real" },
];

function quoteMessage(nombre: string, brand: string) {
  return `Hola ${brand}, me gustaría cotizar el arreglo "${nombre}". ¿Me ayudan?`;
}

export function Products() {
  const { productos, identity } = useContent();
  const [selected, setSelected] = useState<Producto | null>(null);

  return (
    <section id="arreglos" data-section="productos" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600">
            Arreglos
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl md:text-[2.75rem]">
            {productos.titulo}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{productos.subtitulo}</p>
          <div className="mx-auto mt-7 h-px w-16 bg-champagne" />
        </div>

        {/* 2×2 en móvil, 3 en tablet, 4 en desktop */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {productos.items.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              brand={identity.nombre}
              phone={identity.whatsapp}
              onOpen={() => setSelected(p)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <Lightbox
          p={selected}
          brand={identity.nombre}
          phone={identity.whatsapp}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}

function ProductCard({
  p,
  brand,
  phone,
  onOpen,
}: {
  p: Producto;
  brand: string;
  phone: string;
  onOpen: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setIdx(0); // vuelve a la foto de catálogo
  }, []);

  const start = useCallback(() => {
    if (timer.current) return;
    setIdx(1);
    timer.current = setInterval(() => setIdx((i) => (i + 1) % ORDER.length), 1100);
  }, []);

  useEffect(() => () => stop(), [stop]);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card transition-all duration-300 hover:-translate-y-1 hover:border-sage-200 hover:shadow-xl hover:shadow-sage-900/10">
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={start}
        onMouseLeave={stop}
        onFocus={start}
        onBlur={stop}
        className="relative block aspect-[4/5] overflow-hidden bg-sage-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500"
        aria-label={`Ver fotos de ${p.nombre}`}
      >
        {ORDER.map((v, i) => (
          <span
            key={v}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          >
            <Photo
              src={p.img[v]}
              alt={i === 0 ? p.nombre : ""}
              sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
              className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </span>
        ))}
        <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sage-700 shadow-sm backdrop-blur">
          <Flower2 className="h-3 w-3" aria-hidden="true" />
          {p.rosas} rosas
        </span>
        {/* Indicadores del carrusel */}
        <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {ORDER.map((v, i) => (
            <span
              key={v}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-4 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sage-600 sm:text-[11px]">
          {p.categoria}
        </p>
        <h3 className="mt-0.5 line-clamp-2 font-display text-[0.95rem] leading-snug text-ink sm:mt-1 sm:text-lg">
          {p.nombre}
        </h3>
        {/* Descripción solo en pantallas medianas+ para no sobrecargar el móvil */}
        <p className="mt-2 hidden text-sm leading-relaxed text-muted sm:line-clamp-3 sm:block">
          {p.descripcion}
        </p>
        <div className="mt-auto pt-3 sm:pt-4">
          <WhatsAppButton
            message={quoteMessage(p.nombre, brand)}
            phone={phone}
            variant="solid"
            className="w-full px-3 py-2 text-xs"
          >
            Cotizar
          </WhatsAppButton>
        </div>
      </div>
    </article>
  );
}

function Lightbox({
  p,
  brand,
  phone,
  onClose,
}: {
  p: Producto;
  brand: string;
  phone: string;
  onClose: () => void;
}) {
  const [variant, setVariant] = useState<keyof Producto["img"]>("mostrador");

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onKey]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.nombre}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
      />
      <div className="relative z-10 grid max-h-[92vh] w-full max-w-4xl overflow-y-auto overflow-x-hidden rounded-2xl bg-card shadow-2xl md:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 text-ink shadow-sm transition-colors hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="aspect-[4/3] w-full overflow-hidden bg-sage-50 sm:aspect-square">
            <Photo src={p.img[variant]} alt={`${p.nombre} — ${variant}`} sizes="(min-width:768px) 50vw, 100vw" />
          </div>
          <div className="flex gap-2 p-3">
            {VARIANT_LABELS.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => setVariant(v.key)}
                className={`relative h-14 flex-1 overflow-hidden rounded-lg ring-2 transition sm:h-16 ${
                  variant === v.key ? "ring-sage-500" : "ring-transparent hover:ring-sage-200"
                }`}
                aria-label={v.label}
                aria-pressed={variant === v.key}
              >
                <Photo src={p.img[v.key]} alt="" sizes="120px" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 p-5 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-sage-600">
            {p.categoria} · {p.rosas} rosas blancas
          </p>
          <h3 className="font-display text-2xl text-ink sm:text-3xl">{p.nombre}</h3>
          <p className="text-sm leading-relaxed text-muted">{p.descripcion}</p>
          <p className="text-sm leading-relaxed text-muted">
            Coordinamos la entrega contigo, con la calma que este momento merece. Escríbenos y te
            ayudamos a elegir.
          </p>
          <div className="mt-2">
            <WhatsAppButton
              message={quoteMessage(p.nombre, brand)}
              phone={phone}
              variant="solid"
              className="w-full sm:w-auto"
            >
              Cotizar este arreglo
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
