"use client";

import { useContent } from "@/components/content-provider";
import { Photo } from "@/components/photo";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function Hero() {
  const { hero, identity } = useContent();

  return (
    <section
      id="inicio"
      data-section="hero"
      className="relative isolate flex min-h-[88svh] items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <Photo
          src={hero.imagen}
          alt=""
          priority
          sizes="100vw"
          className="scale-105"
        />
        {/* Velo para legibilidad y serenidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/35 to-ink/65" />
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-28 text-center text-bone">
        <p className="rise mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-bone/80">
          {identity.tagline}
        </p>
        <h1 className="rise font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          {hero.titulo}
        </h1>
        <p className="rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-bone/90 sm:text-lg">
          {hero.subtitulo}
        </p>
        <div className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <WhatsAppButton
            message={`Hola ${identity.nombre}, quisiera cotizar un arreglo floral de homenaje.`}
            phone={identity.whatsapp}
            variant="solid"
            className="w-full sm:w-auto"
          >
            {hero.ctaPrimary}
          </WhatsAppButton>
          <a
            href="#arreglos"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-bone/40 px-6 py-3 text-sm font-semibold text-bone transition-colors hover:bg-bone/10 sm:w-auto"
          >
            {hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
