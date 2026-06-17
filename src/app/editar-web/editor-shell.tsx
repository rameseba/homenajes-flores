"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Clock, Loader2, LogOut, Monitor, Smartphone } from "lucide-react";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/content-schema";
import { mergeContent, PREVIEW_CHANNEL, PREVIEW_KEY } from "@/components/content-provider";
import {
  fetchSiteContent,
  fetchAuditLog,
  saveSiteContent,
  supabase,
  type AuditEntry,
} from "@/lib/supabase";
import { SECTIONS } from "./sections";

const DESKTOP_W = 1280;
const PHONE_W = 390;
const PHONE_H = 812;

// Set inmutable por ruta de punto ("hero.titulo" o "productos.items").
function setByPath(obj: unknown, path: string, value: unknown): unknown {
  const keys = path.split(".");
  const root = Array.isArray(obj) ? [...obj] : { ...(obj as Record<string, unknown>) };
  let cur: Record<string, unknown> | unknown[] = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const child = (cur as Record<string, unknown>)[k];
    const cloned = Array.isArray(child) ? [...child] : { ...(child as Record<string, unknown>) };
    (cur as Record<string, unknown>)[k] = cloned;
    cur = cloned;
  }
  (cur as Record<string, unknown>)[keys[keys.length - 1]] = value;
  return root;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function EditorShell({ email }: { email: string }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [active, setActive] = useState<string>("identidad");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [log, setLog] = useState<AuditEntry[]>([]);
  const [box, setBox] = useState({ w: 1000, h: 700 });

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const contentRef = useRef(content);
  const activeRef = useRef(active);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const set = useCallback((path: string, value: unknown) => {
    setContent((prev) => setByPath(prev, path, value) as SiteContent);
  }, []);

  // Carga inicial: contenido guardado + historial
  useEffect(() => {
    fetchSiteContent().then((o) => setContent(mergeContent(o)));
    fetchAuditLog().then(setLog);
  }, []);

  // Canal mismo-origen con el iframe de preview
  useEffect(() => {
    const bc = new BroadcastChannel(PREVIEW_CHANNEL);
    bcRef.current = bc;
    bc.onmessage = (e) => {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "clickSection" && d.section && SECTIONS.some((s) => s.key === d.section)) {
        setActive(d.section);
        cardRefs.current[d.section]?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (d.type === "ready") {
        bc.postMessage({ type: "content", content: contentRef.current });
        bc.postMessage({ type: "setActive", section: activeRef.current });
      }
    };
    return () => bc.close();
  }, []);

  // Cada cambio → localStorage (lo lee el iframe al cargar) + canal
  useEffect(() => {
    try {
      localStorage.setItem(PREVIEW_KEY, JSON.stringify(content));
    } catch {
      /* cuota llena: el canal igual sincroniza */
    }
    bcRef.current?.postMessage({ type: "content", content });
  }, [content]);

  // Medir el área de preview para auto-escalar
  useEffect(() => {
    const el = previewBoxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      if (r.width > 0) setBox({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function selectSection(key: string) {
    setActive(key);
    bcRef.current?.postMessage({ type: "setActive", section: key });
  }

  async function handleSave() {
    setSaving(true);
    const ok = await saveSiteContent(content);
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      fetchAuditLog().then(setLog);
    } else {
      alert("No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.");
    }
  }

  async function handleDiscard() {
    if (!confirm("¿Descartar los cambios no guardados y volver a la última versión guardada?")) return;
    const o = await fetchSiteContent();
    setContent(mergeContent(o));
  }

  const dScale = Math.min(1, box.w > 0 ? box.w / DESKTOP_W : 0.7);
  const mScale = Math.min((box.h - 24) / (PHONE_H + 24), (box.w - 24) / (PHONE_W + 24), 1);
  const lastEdit = log[0];

  const sidebar = useMemo(
    () =>
      SECTIONS.map((s) => {
        const isActive = active === s.key;
        return (
          <div
            key={s.key}
            ref={(el) => {
              cardRefs.current[s.key] = el;
            }}
            className={`overflow-hidden rounded-xl border bg-white transition-colors ${
              isActive ? "border-sage-400 ring-2 ring-sage-100" : "border-zinc-200"
            }`}
          >
            <button
              type="button"
              onClick={() => selectSection(s.key)}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-zinc-800"
            >
              {s.label}
              <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${isActive ? "rotate-180" : ""}`} />
            </button>
            {isActive && <div className="space-y-3 border-t border-zinc-100 px-4 py-4">{s.render(content, set)}</div>}
          </div>
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active, content]
  );

  return (
    <div className="flex h-screen flex-col bg-zinc-100">
      <header className="z-20 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-600 text-sm font-black text-white">H</div>
          <div>
            <h1 className="font-display text-base leading-none text-zinc-900">Editor Web en Vivo</h1>
            <p className="text-[11px] text-zinc-500">Homenajes Florales · {email}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-zinc-100 p-1">
          <button
            onClick={() => setViewport("desktop")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${viewport === "desktop" ? "bg-white text-sage-700 shadow-sm" : "text-zinc-500"}`}
          >
            <Monitor className="h-3.5 w-3.5" /> PC
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${viewport === "mobile" ? "bg-white text-sage-700 shadow-sm" : "text-zinc-500"}`}
          >
            <Smartphone className="h-3.5 w-3.5" /> Móvil
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleDiscard} className="rounded-lg px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100">
            Descartar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-black text-white transition-colors ${saved ? "bg-emerald-500" : "bg-sage-600 hover:bg-sage-700"} disabled:opacity-60`}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
            {saving ? "Guardando…" : saved ? "¡Guardado!" : "Guardar cambios"}
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100"
            title="Cerrar sesión"
          >
            <LogOut className="h-3.5 w-3.5" /> Salir
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-full max-w-[420px] shrink-0 flex-col border-r border-zinc-200 bg-zinc-50">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">{sidebar}</div>
          {lastEdit && (
            <div className="flex items-center gap-2 border-t border-zinc-200 bg-white px-4 py-2.5 text-[11px] text-zinc-500">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Última edición: <b className="text-zinc-700">{lastEdit.editor_email}</b> · {formatDate(lastEdit.created_at)}
              </span>
            </div>
          )}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col bg-zinc-200">
          <div className="flex items-center justify-center gap-2 border-b border-zinc-300 bg-white/60 py-2">
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 shadow-sm">
              Vista {viewport === "desktop" ? "escritorio" : "móvil"}
            </span>
            <span className="text-[10px] text-zinc-400">Clic en una sección para editarla</span>
          </div>

          <div ref={previewBoxRef} className="relative flex min-h-0 flex-1 items-start justify-center overflow-hidden p-4">
            {viewport === "mobile" ? (
              <div
                className="relative shrink-0"
                style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${mScale})`, transformOrigin: "top center" }}
              >
                <div className="absolute inset-0 rounded-[48px] bg-zinc-950 p-3 shadow-2xl ring-1 ring-zinc-700">
                  <div className="relative h-full w-full overflow-hidden rounded-[38px] bg-white">
                    <div className="absolute left-1/2 top-2 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-zinc-950" />
                    <iframe src="/?preview=1" title="Vista móvil" className="h-full w-full border-0" />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-2xl"
                style={{ width: DESKTOP_W * dScale, height: Math.max(0, box.h - 16) }}
              >
                <iframe
                  src="/?preview=1"
                  title="Vista escritorio"
                  className="border-0 bg-white"
                  style={{
                    width: DESKTOP_W,
                    height: dScale > 0 ? (box.h - 16) / dScale : box.h,
                    transform: `scale(${dScale})`,
                    transformOrigin: "top left",
                  }}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
