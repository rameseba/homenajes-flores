// Imagen optimizada. Para fotos locales ("/productos/...") arma el srcset con los
// tamaños sm/md/lg generados por scripts/optimize-images.mjs. Para imágenes
// subidas desde el editor (URL de Supabase Storage) usa la URL tal cual.
//
// Llena su contenedor (h-full w-full object-cover): el contenedor define la
// relación de aspecto para mantener CLS = 0.

export function Photo({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const local = src.startsWith("/productos/");
  const imgSrc = local ? `${src}-md.webp` : src;
  const srcSet = local
    ? `${src}-sm.webp 600w, ${src}-md.webp 1200w, ${src}-lg.webp 1800w`
    : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- export estático: <img> nativo
    <img
      src={imgSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      draggable={false}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
