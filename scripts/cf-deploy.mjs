// Crea (si falta) el proyecto de Cloudflare Pages y despliega ./out.
// Lee token y account id del .env.local (sin exponerlos por línea de comandos).
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const env = await readFile(".env.local", "utf8");
const TOKEN = env.match(/CLOUDFLARE_API_TOKEN=(\S+)/)?.[1];
const ACCOUNT = env.match(/CLOUDFLARE_ACCOUNT_ID=(\S+)/)?.[1];
const PROJECT = "homenajes-florales";
const BRANCH = "main";

if (!TOKEN || !ACCOUNT) {
  console.error("Falta CLOUDFLARE_API_TOKEN o CLOUDFLARE_ACCOUNT_ID en .env.local");
  process.exit(1);
}

const api = (path, init = {}) =>
  fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });

// 1) ¿Existe el proyecto?
const get = await api(`/accounts/${ACCOUNT}/pages/projects/${PROJECT}`);
if (get.status === 404) {
  console.log("Creando proyecto Pages…");
  const create = await api(`/accounts/${ACCOUNT}/pages/projects`, {
    method: "POST",
    body: JSON.stringify({ name: PROJECT, production_branch: BRANCH }),
  });
  const cj = await create.json();
  if (!cj.success) {
    console.error("Error creando proyecto:", JSON.stringify(cj.errors));
    process.exit(1);
  }
  console.log("Proyecto creado.");
} else if (get.ok) {
  console.log("Proyecto ya existe.");
} else {
  console.error("Error consultando proyecto:", get.status, await get.text());
  process.exit(1);
}

// 2) Desplegar ./out con wrangler
console.log("Desplegando ./out …");
const child = spawn(
  "npx",
  ["wrangler", "pages", "deploy", "out", `--project-name=${PROJECT}`, `--branch=${BRANCH}`, "--commit-dirty=true"],
  {
    shell: true,
    stdio: "inherit",
    env: { ...process.env, CLOUDFLARE_API_TOKEN: TOKEN, CLOUDFLARE_ACCOUNT_ID: ACCOUNT },
  }
);
child.on("exit", (code) => process.exit(code ?? 0));
