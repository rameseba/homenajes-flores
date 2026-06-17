"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError("Correo o contraseña incorrectos.");
  }

  const inputCls =
    "w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200";

  return (
    <div className="flex min-h-screen items-center justify-center bg-sage-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-600 text-white">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-4 font-display text-xl text-zinc-900">Editor · Homenajes Florales</h1>
          <p className="mt-1 text-sm text-zinc-500">Ingresa con tu cuenta autorizada.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">Correo</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="tu@correo.cl" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">Contraseña</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
          </label>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sage-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-sage-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
