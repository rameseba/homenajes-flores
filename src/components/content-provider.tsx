"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/content-schema";
import { fetchSiteContent } from "@/lib/supabase";

// Clave compartida (mismo origen) entre el editor y el iframe de preview.
export const PREVIEW_KEY = "homenajes:preview-content";
export const PREVIEW_CHANNEL = "homenajes-preview";

// ── Merge profundo: objetos se combinan; arrays y valores simples se reemplazan.
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : override) as T;
  }
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const o = (override as Record<string, unknown>)[key];
    if (o === undefined) continue;
    const b = (base as Record<string, unknown>)[key];
    out[key] = isPlainObject(b) && isPlainObject(o) ? deepMerge(b, o) : o;
  }
  return out as T;
}

export function mergeContent(override: Partial<SiteContent> | null | undefined): SiteContent {
  return override ? deepMerge(DEFAULT_CONTENT, override) : DEFAULT_CONTENT;
}

const ContentContext = createContext<SiteContent>(DEFAULT_CONTENT);

export function useContent(): SiteContent {
  return useContext(ContentContext);
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    const isPreview = new URLSearchParams(window.location.search).has("preview");

    // ── Sitio público: aplica los cambios guardados sobre los defaults ──
    if (!isPreview) {
      let active = true;
      fetchSiteContent()
        .then((o) => active && o && setContent(mergeContent(o)))
        .catch(() => {});
      return () => {
        active = false;
      };
    }

    // ── Modo preview (iframe del editor) — mismo origen: localStorage + canal ──
    document.documentElement.setAttribute("data-preview", "1");

    let draft: string | null = null;
    try {
      draft = localStorage.getItem(PREVIEW_KEY);
    } catch {
      /* sin acceso a localStorage */
    }
    if (draft) {
      const parsed = draft;
      queueMicrotask(() => {
        try {
          setContent(mergeContent(JSON.parse(parsed)));
        } catch {
          /* json inválido */
        }
      });
    }

    const bc = new BroadcastChannel(PREVIEW_CHANNEL);
    bc.onmessage = (e) => {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "content" && d.content) {
        setContent(mergeContent(d.content as Partial<SiteContent>));
      } else if (d.type === "setActive" && d.section) {
        document
          .querySelector(`[data-section="${d.section}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === PREVIEW_KEY && e.newValue) {
        try {
          setContent(mergeContent(JSON.parse(e.newValue)));
        } catch {
          /* json inválido */
        }
      }
    };
    window.addEventListener("storage", onStorage);

    // Click-to-edit: bloquea navegación dentro del preview y avisa al editor.
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest("a, button, [role='button'], input, textarea, select, label")) {
        e.preventDefault();
        e.stopPropagation();
      }
      const sectionEl = el.closest("[data-section]");
      if (sectionEl) {
        bc.postMessage({ type: "clickSection", section: sectionEl.getAttribute("data-section") });
      }
    };
    document.addEventListener("click", onClick, true);

    bc.postMessage({ type: "ready" });

    return () => {
      bc.close();
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
