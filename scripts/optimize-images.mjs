// Optimiza las fotos fuente del cliente a WebP responsivo para el sitio.
//
// Origen (fuera del repo): C:\Users\RAMESEBA\Desktop\Fotos-Homenajes-Florales
//   - 8 productos × 3 variantes (-real .jpg, -blanca .png, -mostrador .png)
//   - logo: homenajes_flores_logo_..._-Photoroom.png
//
// Salida: public/productos/<slug>-<variante>-<ancho>.webp  +  public/logo.webp
//
// Uso: npm run optimize:images

import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SRC_DIR = "C:\\Users\\RAMESEBA\\Desktop\\Fotos-Homenajes-Florales";
const OUT_DIR = path.join(process.cwd(), "public", "productos");
const LOGO_OUT = path.join(process.cwd(), "public", "logo.webp");

// Mapea el nombre base del archivo fuente (sin variante ni extensión) → slug.
const SLUGS = {
  "Atril de 25 rosas": "atril-25",
  "Canasto de 15 rosas sin asa": "canasto-15",
  "Cubre urna de 7 rosas": "cubre-urna-7",
  "Cubre urna de 25 rosas": "cubre-urna-25",
  "Cubre urna de 50 rosas": "cubre-urna-50",
  "Pie de urna 15 rosas": "pie-urna-15",
  "Pie de urna de 25 rosas": "pie-urna-25",
  "Segundo - Canasto de 15 rosas": "canasto-15-b",
};

const VARIANTS = ["real", "blanca", "mostrador"];
// Anchos responsivos: sm = tarjetas, md = lightbox, lg = hero/galería.
const WIDTHS = { sm: 600, md: 1200, lg: 1800 };

function parse(fileName) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  for (const variant of VARIANTS) {
    const suffix = `-${variant}`;
    if (base.endsWith(suffix)) {
      const namePart = base.slice(0, -suffix.length);
      const slug = SLUGS[namePart];
      if (slug) return { slug, variant };
    }
  }
  return null;
}

async function run() {
  if (!existsSync(SRC_DIR)) {
    console.error(`No se encontró la carpeta de fotos: ${SRC_DIR}`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const files = await readdir(SRC_DIR);
  let count = 0;

  for (const file of files) {
    const src = path.join(SRC_DIR, file);

    // Logo
    if (/logo/i.test(file)) {
      await sharp(src)
        .rotate()
        .resize({ width: 480, withoutEnlargement: true })
        .webp({ quality: 90 })
        .toFile(LOGO_OUT);
      console.log(`logo → public/logo.webp`);
      continue;
    }

    const info = parse(file);
    if (!info) continue;

    for (const [size, width] of Object.entries(WIDTHS)) {
      const out = path.join(OUT_DIR, `${info.slug}-${info.variant}-${size}.webp`);
      await sharp(src)
        .rotate() // respeta orientación EXIF de las fotos de teléfono
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(out);
      count++;
    }
    console.log(`${file} → ${info.slug}-${info.variant}-[sm|md|lg].webp`);
  }

  console.log(`\nListo: ${count} imágenes WebP generadas en public/productos/`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
