// Genera los assets de marca a partir del logo fuente:
//   - src/app/icon.png        (favicon, rosa, fondo transparente)
//   - src/app/apple-icon.png  (touch icon iOS, rosa sobre hueso)
//   - public/icon-512.png     (icono PWA maskable, con zona segura)
//   - public/og.jpg           (imagen para compartir / SEO, 1200x630)
//
// La rosa (isotipo) se extrae automáticamente: se recorta la banda superior del
// logo (donde está la flor, sin el texto) y se hace trim para ajustar al dibujo.
//
// Uso: node scripts/make-brand-assets.mjs

import sharp from "sharp";
import path from "node:path";

const SRC = "C:\\Users\\RAMESEBA\\Desktop\\Fotos-Homenajes-Florales\\homenajes_flores_logo_1781655211442-Photoroom.png";
const HERO_BG = path.join(process.cwd(), "public", "productos", "atril-25-mostrador-lg.webp");
const WHITE_LOGO = path.join(process.cwd(), "public", "logo-white.webp");
const BONE = { r: 251, g: 249, b: 246, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

// Cuadra una imagen en un canvas size×size con borde (padding) y fondo dado.
function squareWithPadding(buf, size, inner, background) {
  return sharp(buf)
    .resize({ width: inner, height: inner, fit: "contain", background: TRANSPARENT })
    .extend({
      top: Math.round((size - inner) / 2),
      bottom: Math.round((size - inner) / 2),
      left: Math.round((size - inner) / 2),
      right: Math.round((size - inner) / 2),
      background,
    })
    .resize(size, size);
}

async function getRose() {
  const trimmed = await sharp(SRC).trim({ threshold: 10 }).toBuffer();
  const { width, height } = await sharp(trimmed).metadata();
  // La flor ocupa la franja superior (~72%); el texto va debajo.
  const top = await sharp(trimmed)
    .extract({ left: 0, top: 0, width, height: Math.round(height * 0.72) })
    .toBuffer();
  // Trim para quedarnos exactamente con el contorno de la flor.
  return sharp(top).trim({ threshold: 10 }).toBuffer();
}

async function run() {
  const rose = await getRose();
  const rm = await sharp(rose).metadata();
  console.log(`rosa extraída: ${rm.width}x${rm.height}`);

  // Favicon (transparente)
  await squareWithPadding(rose, 512, 420, TRANSPARENT).png().toFile("src/app/icon.png");
  // Apple touch icon (opaco, hueso)
  await squareWithPadding(rose, 180, 140, BONE).png().toFile("src/app/apple-icon.png");
  // Icono PWA maskable (zona segura amplia)
  await squareWithPadding(rose, 512, 320, BONE).png().toFile("public/icon-512.png");
  console.log("favicons OK");

  // Imagen Open Graph 1200x630: foto + velo oscuro + logo blanco + bajada
  const W = 1200, H = 630;
  const overlay = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2c2a27" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#2c2a27" stop-opacity="0.78"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
      <text x="${W / 2}" y="${H - 96}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#fbf9f6" letter-spacing="2">Flores blancas de condolencias · Santiago</text>
      <text x="${W / 2}" y="${H - 52}" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#fbf9f6" opacity="0.85" letter-spacing="6">COTIZA POR WHATSAPP</text>
    </svg>`
  );
  const whiteLogo = await sharp(WHITE_LOGO).resize({ width: 540 }).toBuffer();
  const wl = await sharp(whiteLogo).metadata();

  await sharp(HERO_BG)
    .resize(W, H, { fit: "cover", position: "centre" })
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: whiteLogo, top: Math.round(H / 2 - wl.height / 2 - 40), left: Math.round(W / 2 - wl.width / 2) },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile("public/og.jpg");
  console.log("og.jpg OK");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
