# Homenajes Florales

Sitio web tipo galería + editor de contenido para una florería de arreglos fúnebres.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar con credenciales de Supabase
npm run dev                  # http://localhost:3000
```

## Optimización de imágenes

Las fotos fuente viven fuera del repo. Para regenerar los WebP optimizados:

```bash
npm run optimize:images
```

## Build y deploy (Cloudflare Pages)

```bash
npm run build                # genera ./out (estático)
npx wrangler pages deploy out
```

## Editor

El panel de administración está en `/editar-web` (login único de Supabase Auth).
