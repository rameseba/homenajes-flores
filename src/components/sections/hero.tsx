"use client";

import { useContent } from "@/components/content-provider";
import { Photo } from "@/components/photo";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function Hero() {
  const { hero, identity } = useContent();
  const poster = hero.imagen.startsWith("/productos/")
    ? `${hero.imagen}-lg.webp`
    : hero.imagen;

  return (
    <section
      id="inicio"
      data-section="hero"
      className="relative isolate flex min-h-[92svh] items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        {hero.video ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            aria-hidden="true"
          >
            <source src={hero.video} type="video/mp4" />
          </video>
        ) : (
          <Photo src={hero.imagen} alt="" priority sizes="100vw" className="scale-105" />
        )}
        {/* Velo en capas para contraste y elegancia */}
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/75" />
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-20 pt-32 text-center text-white">
        <p className="rise mb-6 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/85">
          {identity.tagline}
        </p>
        <h1 className="rise font-display text-[2.6rem] font-medium leading-[1.08] tracking-tight drop-shadow-sm sm:text-6xl md:text-7xl">
          {hero.titulo}
        </h1>
        <p className="rise mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
          {hero.subtitulo}
        </p>
        <div className="rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <WhatsAppButton
            message={`Hola ${identity.nombre}, quisiera cotizar un arreglo floral de homenaje.`}
            phone={identity.whatsapp}
            variant="solid"
            className="w-full px-7 py-3.5 sm:w-auto"
          >
            {hero.ctaPrimary}
          </WhatsAppButton>
          <a
            href="#arreglos"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto"
          >
            {hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
