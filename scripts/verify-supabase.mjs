// Verifica que el schema esté aplicado consultando la API REST (anon).
// Lee credenciales del .env.local (no las expone por línea de comandos).
import { readFile } from "node:fs/promises";

const env = await readFile(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(\S+)/)?.[1];
const anon = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(\S+)/)?.[1];

async function check(table) {
  const r = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers: { apikey: anon, Authorization: `Bearer ${anon}` },
  });
  const body = await r.text();
  console.log(`${table}: HTTP ${r.status} ${r.ok ? "OK" : body.slice(0, 120)}`);
  return r.ok;
}

await check("site_content");
await check("content_audit");
