// Aplica supabase/schema.sql vía el pooler IPv4 de Supabase, probando regiones
// hasta encontrar la del proyecto. Uso interno (no se commitea con secretos).
import { Client } from "pg";
import { readFile } from "node:fs/promises";

// Lee credenciales del .env.local (no se exponen por línea de comandos).
const env = await readFile(".env.local", "utf8");
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=https:\/\/([a-z0-9]+)\.supabase\.co/i);
const pwMatch = env.match(/Database password\s+(\S+)/i);
const REF = urlMatch?.[1];
const PASSWORD = pwMatch?.[1];

if (!REF || !PASSWORD) {
  console.error("No encontré el ref del proyecto o la contraseña de BD en .env.local");
  process.exit(1);
}
const REGIONS = [
  "sa-east-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ca-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "eu-central-2",
  "eu-north-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-south-1",
];

const sql = await readFile("supabase/schema.sql", "utf8");

async function tryRegion(hostBase) {
  const client = new Client({
    host: hostBase,
    port: 5432,
    user: `postgres.${REF}`,
    password: PASSWORD,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    statement_timeout: 60000,
  });
  await client.connect();
  return client;
}

const PREFIXES = ["aws-1", "aws-0"];
let client = null;
let used = null;
outer: for (const region of REGIONS) {
  for (const prefix of PREFIXES) {
    const host = `${prefix}-${region}.pooler.supabase.com`;
    try {
      process.stdout.write(`probando ${host}... `);
      client = await tryRegion(host);
      used = host;
      console.log("CONECTADO");
      break outer;
    } catch (e) {
      console.log(`no (${e.code || ""} ${e.message || ""})`.trim());
    }
  }
}

if (!client) {
  console.error("\nNo se pudo conectar a ninguna región del pooler.");
  process.exit(2);
}

try {
  await client.query(sql);
  console.log(`\n✅ schema.sql aplicado correctamente (región ${used}).`);
} catch (e) {
  console.error("\n❌ Error ejecutando schema:", e.message);
  process.exitCode = 3;
} finally {
  await client.end();
}
