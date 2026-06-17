"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "./login-form";
import { EditorShell } from "./editor-shell";

export function EditarWebApp() {
  // undefined = comprobando sesión; null = sin sesión; Session = autenticado
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sage-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!session) return <LoginForm />;

  return <EditorShell email={session.user.email ?? "—"} />;
}
