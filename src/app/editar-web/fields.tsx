"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { uploadMedia, deleteMedia } from "@/lib/supabase";
import { Photo } from "@/components/photo";

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      <input className={inputCls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      <textarea className={inputCls} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      <input
        type="number"
        min={0}
        className={inputCls}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </label>
  );
}

// Campo de imagen: muestra la actual, permite reemplazar (subiendo a Storage y
// borrando la anterior) o quitarla.
export function MediaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      // No pasamos value como oldUrl si es un asset local del repo (no se debe borrar).
      const old = value.startsWith("http") ? value : undefined;
      const url = await uploadMedia(file, old);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    setBusy(true);
    try {
      await deleteMedia(value);
    } catch {
      /* asset base del sitio: no se borra */
    }
    onChange("");
    setBusy(false);
  }

  return (
    <div>
      {label && (
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      )}
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-zinc-200">
          {value ? (
            <Photo src={value} alt="" sizes="64px" className="!object-contain" />
          ) : (
            <ImagePlus className="h-5 w-5 text-zinc-300" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <label
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-sage-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sage-700 ${
              busy ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {value ? "Reemplazar" : "Subir imagen"}
            <input type="file" accept="image/*" className="hidden" onChange={onPick} disabled={busy} />
          </label>
          {value && value.startsWith("http") && !busy && (
            <button
              type="button"
              onClick={onRemove}
              className="ml-2 inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" /> Quitar
            </button>
          )}
          {error && <p className="mt-1 truncate text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// Editor de listas: agregar, eliminar y reordenar elementos.
export function ListEditor<T>({
  items,
  onChange,
  newItem,
  labelOf,
  render,
  addLabel = "Agregar",
}: {
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  labelOf: (item: T, i: number) => string;
  render: (item: T, i: number, setItem: (v: T) => void) => React.ReactNode;
  addLabel?: string;
}) {
  function setItem(i: number, v: T) {
    const next = [...items];
    next[i] = v;
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details key={i} className="rounded-lg border border-zinc-200 bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold text-zinc-800">
            <span className="truncate">{labelOf(item, i) || `Elemento ${i + 1}`}</span>
            <span className="flex shrink-0 items-center gap-0.5">
              <button type="button" onClick={(e) => { e.preventDefault(); move(i, -1); }} disabled={i === 0}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30" aria-label="Subir">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={(e) => { e.preventDefault(); move(i, 1); }} disabled={i === items.length - 1}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 disabled:opacity-30" aria-label="Bajar">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={(e) => { e.preventDefault(); remove(i); }}
                className="rounded p-1 text-red-500 hover:bg-red-50" aria-label="Eliminar">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </span>
          </summary>
          <div className="space-y-3 border-t border-zinc-100 p-3">{render(item, i, (v) => setItem(i, v))}</div>
        </details>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-sage-300 py-2 text-sm font-semibold text-sage-700 hover:bg-sage-50"
      >
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
}
