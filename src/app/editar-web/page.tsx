import type { Metadata } from "next";
import { EditarWebApp } from "./app";

// Ruta privada: fuera de buscadores.
export const metadata: Metadata = {
  title: "Editor Web",
  robots: { index: false, follow: false },
};

export default function EditarWebPage() {
  return <EditarWebApp />;
}
