// Utilidades Cloudflare: lee el token del .env.local (sin exponerlo por CLI),
// verifica su validez y lista las cuentas para obtener el Account ID.
// Uso: node scripts/cf.mjs verify
import { readFile } from "node:fs/promises";

const env = await readFile(".env.local", "utf8");
// Acepta el valor en CLOUDFLARE_API_TOKEN= o en una nota suelta (cfk_... / token de 40 chars).
const token =
  env.match(/CLOUDFLARE_API_TOKEN=(\S+)/)?.[1] ||
  env.match(/(cfk_[A-Za-z0-9]+)/)?.[1] ||
  env.match(/cloudflare[^\n]*?\b([A-Za-z0-9_-]{40})\b/i)?.[1];

if (!token) {
  console.error("No encontré el token de Cloudflare en .env.local");
  process.exit(1);
}

const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

const verify = await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify", { headers: H });
const vj = await verify.json();
console.log("verify:", verify.status, JSON.stringify(vj.result ?? vj.errors));

const accs = await fetch("https://api.cloudflare.com/client/v4/accounts", { headers: H });
const aj = await accs.json();
if (aj.success) {
  for (const a of aj.result) console.log(`account: ${a.name}  id=${a.id}`);
} else {
  console.log("accounts error:", JSON.stringify(aj.errors));
}
