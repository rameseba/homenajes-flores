"use client";

import { Heart, MapPin, Sprout } from "lucide-react";
import { useContent } from "@/components/content-provider";

const ICONS = [MapPin, Sprout, Heart];

export function Trust() {
  const { confianza } = useContent();

  return (
    <section id="confianza" data-section="confianza" className="scroll-mt-24 bg-sage-50 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-500">
            Nosotros
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            {confianza.titulo}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{confianza.subtitulo}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {confianza.items.map((it, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={it.titulo + i}
                className="rounded-2xl border border-hairline bg-card p-6 text-center"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg text-ink">{it.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{it.texto}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
