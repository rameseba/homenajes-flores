"use client";

import { useContent } from "@/components/content-provider";
import { Photo } from "@/components/photo";

export function Gallery() {
  const { galeria } = useContent();
  const imgs = galeria.imagenes.slice(0, 4);

  return (
    <section id="galeria" data-section="galeria" className="scroll-mt-24 bg-bone py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-500">
            Galería
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            {galeria.titulo}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{galeria.subtitulo}</p>
        </div>

        {/* Mosaico: en móvil 2 columnas; en desktop la primera ocupa mayor espacio */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {imgs.map((src, i) => (
            <figure
              key={src + i}
              className={`group relative aspect-square overflow-hidden rounded-2xl bg-sage-100 ring-1 ring-hairline ${
                i === 0 ? "lg:col-span-2 lg:row-span-2 lg:aspect-auto" : ""
              }`}
            >
              <Photo
                src={src}
                alt="Arreglo floral de rosas blancas"
                sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
                className="transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
