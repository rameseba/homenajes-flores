@AGENTS.md

# Homenajes Florales — sitio + editor

Sitio de galería minimalista para una florería de arreglos fúnebres/condolencias
(hoy principalmente rosas blancas). Sin carrito ni login de clientes: todo el recorrido
termina en WhatsApp (+56 9 5619 9315) o email (homenajeflorales@gmail.com).

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript, **static export** (`output: "export"`).
- Tailwind CSS 4 (tokens en `@theme` dentro de `src/app/globals.css`).
- Supabase: contenido en JSONB (`site_content`, fila id=1) con RLS + Storage (`media`).
- Deploy: Cloudflare Pages (`pages_build_output_dir: ./out`).

## Patrones clave (heredados de servinel-net)
- `src/lib/content-schema.ts`: tipo `SiteContent` + `DEFAULT_CONTENT` (única fuente de verdad).
- `src/components/content-provider.tsx`: web pública mergea overrides de Supabase sobre
  defaults; en `?preview=1` escucha BroadcastChannel para vista previa en vivo.
- `src/app/editar-web/`: editor con login único (sin roles), vista previa en vivo, ListEditor
  de productos y subida de imágenes a Storage.

## Comandos
- `npm run dev` — desarrollo.
- `npm run build` — export estático a `./out`.
- `npm run optimize:images` — regenera WebP en `public/productos/` desde las fotos fuente.
