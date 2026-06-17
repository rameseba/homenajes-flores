import { createClient } from "@supabase/supabase-js";
import type { SiteContent } from "@/lib/content-schema";

// La URL y la clave publicable (anon) son seguras en el navegador: la escritura
// está protegida por RLS (solo sesiones autenticadas). Se leen de variables de
// entorno públicas (NEXT_PUBLIC_*), que se compilan en el build estático.
// Cuando aún no hay credenciales (build local sin .env) usamos un placeholder
// válido para que createClient no falle; las llamadas se cortan con HAS_SUPABASE.
export const HAS_SUPABASE = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export const MEDIA_BUCKET = "media";
const PUBLIC_PREFIX = `/storage/v1/object/public/${MEDIA_BUCKET}/`;

// ── Contenido ────────────────────────────────────────────────────────────────

// Lee los overrides guardados (puede no existir la fila todavía).
export async function fetchSiteContent(): Promise<Partial<SiteContent> | null> {
  if (!HAS_SUPABASE) return null;
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return null;
  return data.content as Partial<SiteContent>;
}

// Guarda el contenido (requiere sesión) y registra cuándo en el log.
export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  const { error } = await supabase
    .from("site_content")
    .upsert({ id: 1, content, updated_at: new Date().toISOString() });
  if (error) {
    console.error("Error al guardar contenido:", error.message);
    return false;
  }
  const email = (await supabase.auth.getUser()).data.user?.email ?? "admin";
  await supabase.from("content_audit").insert({ editor_email: email, action: "Guardó cambios" });
  return true;
}

export type AuditEntry = { editor_email: string; action: string; created_at: string };

export async function fetchAuditLog(limit = 5): Promise<AuditEntry[]> {
  const { data } = await supabase
    .from("content_audit")
    .select("editor_email, action, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as AuditEntry[]) ?? [];
}

// ── Medios (Storage) ──────────────────────────────────────────────────────────

// ¿La URL apunta a un archivo subido por el panel (no a un asset del repo)?
function storagePathFromUrl(url: string): string | null {
  const idx = url.indexOf(PUBLIC_PREFIX);
  return idx === -1 ? null : url.slice(idx + PUBLIC_PREFIX.length);
}

// Borra de Storage un archivo subido por el panel. Ignora rutas locales
// (/productos/..., /logo.webp) para no romper los assets base del sitio.
export async function deleteMedia(url: string | undefined | null): Promise<void> {
  if (!url) return;
  const path = storagePathFromUrl(url);
  if (!path) return;
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}

// Comprime/redimensiona imágenes en el navegador antes de subir (ahorra Storage
// y acelera la carga). PNG conserva transparencia; el resto se reexporta a WebP.
async function compressIfImage(file: File): Promise<{ blob: Blob; ext: string }> {
  const type = file.type;
  const isRaster = type === "image/png" || type === "image/jpeg" || type === "image/webp";
  if (!isRaster) return { blob: file, ext: (file.name.split(".").pop() || "bin").toLowerCase() };

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return { blob: file, ext: (file.name.split(".").pop() || "bin").toLowerCase() };

  const MAX = 1600;
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { blob: file, ext: (file.name.split(".").pop() || "bin").toLowerCase() };
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/webp", 0.82));
  if (!blob) return { blob: file, ext: (file.name.split(".").pop() || "bin").toLowerCase() };
  return { blob, ext: "webp" };
}

// Sube un archivo y devuelve su URL pública. `oldUrl` (si se pasa) se borra después.
export async function uploadMedia(file: File, oldUrl?: string): Promise<string> {
  const { blob, ext } = await compressIfImage(file);
  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { contentType: blob.type || file.type || "application/octet-stream", upsert: false });
  if (error) throw new Error(error.message);
  if (oldUrl) await deleteMedia(oldUrl); // limpia el anterior para no acumular basura
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
