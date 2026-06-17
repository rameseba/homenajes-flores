import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { waLink } from "@/lib/site";

type Variant = "solid" | "outline" | "soft";

const styles: Record<Variant, string> = {
  solid:
    "bg-whats text-white hover:bg-whats-dark shadow-sm shadow-sage-900/10",
  outline:
    "border border-sage-300 text-sage-700 hover:bg-sage-50",
  soft: "bg-sage-500 text-white hover:bg-sage-600 shadow-sm shadow-sage-900/10",
};

// Botón/enlace que abre WhatsApp con un mensaje prellenado.
export function WhatsAppButton({
  message,
  phone,
  children,
  variant = "solid",
  className = "",
}: {
  message: string;
  phone?: string;
  children?: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <a
      href={waLink(message, phone)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500 ${styles[variant]} ${className}`}
    >
      <WhatsAppIcon className="h-[1.05em] w-[1.05em]" />
      {children ?? "Cotizar por WhatsApp"}
    </a>
  );
}
