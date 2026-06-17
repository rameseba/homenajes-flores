// Crea los registros DNS (CNAME → pages.dev) para activar el dominio en Pages.
import { readFile } from "node:fs/promises";

const env = await readFile(".env.local", "utf8");
const TOKEN = env.match(/CLOUDFLARE_API_TOKEN=(\S+)/)?.[1];
const ZONE = "07bfc621a75eaa2110d957eea60e268d";
const TARGET = "homenajes-florales.pages.dev";
const RECORDS = [
  { type: "CNAME", name: "homenajeflorales.cl", content: TARGET, proxied: true },
  { type: "CNAME", name: "www", content: TARGET, proxied: true },
];

const api = (path, init = {}) =>
  fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });

for (const rec of RECORDS) {
  const r = await api(`/zones/${ZONE}/dns_records`, { method: "POST", body: JSON.stringify(rec) });
  const j = await r.json();
  if (j.success) console.log(`+ ${rec.name}: creado (${rec.type} → ${rec.content})`);
  else console.log(`+ ${rec.name}: ${JSON.stringify(j.errors)}`);
}
