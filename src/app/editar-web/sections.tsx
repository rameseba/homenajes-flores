"use client";

import type { Producto, SiteContent } from "@/lib/content-schema";
import { ListEditor, MediaField, NumberField, TextArea, TextField } from "./fields";

type SetFn = (path: string, value: unknown) => void;

export type Section = {
  key: string;
  label: string;
  render: (content: SiteContent, set: SetFn) => React.ReactNode;
};

function newProducto(): Producto {
  return {
    id: `prod-${Date.now()}`,
    nombre: "Nuevo arreglo",
    rosas: 12,
    categoria: "Arreglo",
    descripcion: "Descripción breve del arreglo.",
    img: { real: "", blanca: "", mostrador: "" },
  };
}

export const SECTIONS: Section[] = [
  {
    key: "identidad",
    label: "Identidad y contacto",
    render: (c, set) => (
      <>
        <TextField label="Nombre" value={c.identity.nombre} onChange={(v) => set("identity.nombre", v)} />
        <TextField label="Frase / tagline" value={c.identity.tagline} onChange={(v) => set("identity.tagline", v)} />
        <TextField label="WhatsApp (solo dígitos)" value={c.identity.whatsapp} onChange={(v) => set("identity.whatsapp", v)} placeholder="56956199315" />
        <TextField label="WhatsApp (cómo se muestra)" value={c.identity.whatsappDisplay} onChange={(v) => set("identity.whatsappDisplay", v)} />
        <TextField label="Email" value={c.identity.email} onChange={(v) => set("identity.email", v)} />
        <TextField label="Ciudad" value={c.identity.ciudad} onChange={(v) => set("identity.ciudad", v)} />
        <TextField label="Horario" value={c.identity.horario} onChange={(v) => set("identity.horario", v)} />
        <MediaField label="Logo" value={c.identity.logo} onChange={(v) => set("identity.logo", v)} />
      </>
    ),
  },
  {
    key: "hero",
    label: "Portada (Hero)",
    render: (c, set) => (
      <>
        <TextField label="Título" value={c.hero.titulo} onChange={(v) => set("hero.titulo", v)} />
        <TextArea label="Subtítulo" value={c.hero.subtitulo} onChange={(v) => set("hero.subtitulo", v)} rows={3} />
        <TextField label="Botón principal" value={c.hero.ctaPrimary} onChange={(v) => set("hero.ctaPrimary", v)} />
        <TextField label="Botón secundario" value={c.hero.ctaSecondary} onChange={(v) => set("hero.ctaSecondary", v)} />
        <MediaField label="Imagen de portada" value={c.hero.imagen} onChange={(v) => set("hero.imagen", v)} />
      </>
    ),
  },
  {
    key: "galeria",
    label: "Galería",
    render: (c, set) => (
      <>
        <TextField label="Título" value={c.galeria.titulo} onChange={(v) => set("galeria.titulo", v)} />
        <TextArea label="Subtítulo" value={c.galeria.subtitulo} onChange={(v) => set("galeria.subtitulo", v)} rows={2} />
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Imágenes (la primera se muestra grande)
          </span>
          <ListEditor<string>
            items={c.galeria.imagenes}
            onChange={(next) => set("galeria.imagenes", next)}
            newItem={() => ""}
            labelOf={(_, i) => `Imagen ${i + 1}`}
            addLabel="Agregar imagen"
            render={(item, _i, setItem) => <MediaField label="" value={item} onChange={setItem} />}
          />
        </div>
      </>
    ),
  },
  {
    key: "productos",
    label: "Arreglos (productos)",
    render: (c, set) => (
      <>
        <TextField label="Título de la sección" value={c.productos.titulo} onChange={(v) => set("productos.titulo", v)} />
        <TextArea label="Subtítulo" value={c.productos.subtitulo} onChange={(v) => set("productos.subtitulo", v)} rows={2} />
        <ListEditor<Producto>
          items={c.productos.items}
          onChange={(next) => set("productos.items", next)}
          newItem={newProducto}
          labelOf={(p) => p.nombre}
          addLabel="Agregar arreglo"
          render={(p, _i, setItem) => (
            <>
              <TextField label="Nombre" value={p.nombre} onChange={(v) => setItem({ ...p, nombre: v })} />
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="N° de rosas" value={p.rosas} onChange={(v) => setItem({ ...p, rosas: v })} />
                <TextField label="Categoría" value={p.categoria} onChange={(v) => setItem({ ...p, categoria: v })} />
              </div>
              <TextArea label="Descripción" value={p.descripcion} onChange={(v) => setItem({ ...p, descripcion: v })} rows={3} />
              <MediaField label="Foto catálogo (tarjeta)" value={p.img.blanca} onChange={(v) => setItem({ ...p, img: { ...p.img, blanca: v } })} />
              <MediaField label="Foto en el lugar" value={p.img.mostrador} onChange={(v) => setItem({ ...p, img: { ...p.img, mostrador: v } })} />
              <MediaField label="Foto real" value={p.img.real} onChange={(v) => setItem({ ...p, img: { ...p.img, real: v } })} />
            </>
          )}
        />
      </>
    ),
  },
  {
    key: "confianza",
    label: "Nosotros / Confianza",
    render: (c, set) => (
      <>
        <TextField label="Título" value={c.confianza.titulo} onChange={(v) => set("confianza.titulo", v)} />
        <TextArea label="Subtítulo" value={c.confianza.subtitulo} onChange={(v) => set("confianza.subtitulo", v)} rows={2} />
        <ListEditor
          items={c.confianza.items}
          onChange={(next) => set("confianza.items", next)}
          newItem={() => ({ titulo: "Nuevo", texto: "" })}
          labelOf={(it) => it.titulo}
          addLabel="Agregar punto"
          render={(it, _i, setItem) => (
            <>
              <TextField label="Título" value={it.titulo} onChange={(v) => setItem({ ...it, titulo: v })} />
              <TextArea label="Texto" value={it.texto} onChange={(v) => setItem({ ...it, texto: v })} rows={2} />
            </>
          )}
        />
      </>
    ),
  },
  {
    key: "contacto",
    label: "Contacto",
    render: (c, set) => (
      <>
        <TextField label="Título" value={c.contacto.titulo} onChange={(v) => set("contacto.titulo", v)} />
        <TextArea label="Texto" value={c.contacto.texto} onChange={(v) => set("contacto.texto", v)} rows={3} />
        <TextArea label="Mensaje prellenado de WhatsApp" value={c.contacto.whatsappMsg} onChange={(v) => set("contacto.whatsappMsg", v)} rows={2} />
      </>
    ),
  },
  {
    key: "footer",
    label: "Pie de página",
    render: (c, set) => (
      <>
        <TextArea label="Nota" value={c.footer.nota} onChange={(v) => set("footer.nota", v)} rows={2} />
        <TextField label="Nombre en derechos" value={c.footer.copyright} onChange={(v) => set("footer.copyright", v)} />
      </>
    ),
  },
];
