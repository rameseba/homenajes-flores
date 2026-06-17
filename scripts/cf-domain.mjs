// Conecta el dominio personalizado al proyecto de Cloudflare Pages.
// Lee token/account del .env.local (sin exponerlos por CLI).
import { readFile } from "node:fs/promises";

const env = await readFile(".env.local", "utf8");
const TOKEN = env.match(/CLOUDFLARE_API_TOKEN=(\S+)/)?.[1];
const ACCOUNT = env.match(/CLOUDFLARE_ACCOUNT_ID=(\S+)/)?.[1];
const PROJECT = "homenajes-florales";
const APEX = "homenajeflorales.cl";
const DOMAINS = [APEX, `www.${APEX}`];
// Dominios agregados por error (plural) que hay que quitar.
const WRONG = ["homenajesflorales.cl", "www.homenajesflorales.cl"];

const api = (path, init = {}) =>
  fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });

// Estado de la zona (depende de la propagación de nameservers en nic.cl)
const zr = await api(`/zones?name=${APEX}`);
const zj = await zr.json();
if (zj.success && zj.result.length) {
  const z = zj.result[0];
  console.log(`zona: ${z.name}  status=${z.status}  id=${z.id}`);
} else {
  console.log(`zona: no visible aún (${zr.status}) ${JSON.stringify(zj.errors || "")}`);
}

// Quitar dominios equivocados
for (const name of WRONG) {
  const r = await api(`/accounts/${ACCOUNT}/pages/projects/${PROJECT}/domains/${name}`, { method: "DELETE" });
  console.log(`- ${name}: ${r.ok ? "eliminado" : "no estaba"}`);
}

// Adjuntar dominios al proyecto Pages
for (const name of DOMAINS) {
  const r = await api(`/accounts/${ACCOUNT}/pages/projects/${PROJECT}/domains`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  const j = await r.json();
  if (j.success) {
    console.log(`+ ${name}: agregado (status=${j.result?.status || "?"})`);
  } else {
    const msg = JSON.stringify(j.errors);
    console.log(`+ ${name}: ${msg.includes("already") || r.status === 409 ? "ya estaba" : msg}`);
  }
}

// Listar dominios actuales del proyecto
const list = await api(`/accounts/${ACCOUNT}/pages/projects/${PROJECT}/domains`);
const lj = await list.json();
if (lj.success) {
  console.log("\nDominios del proyecto:");
  for (const d of lj.result) console.log(`  ${d.name} — ${d.status}`);
}
