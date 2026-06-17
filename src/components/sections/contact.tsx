"use client";

import { Clock, Mail, MessageCircle } from "lucide-react";
import { useContent } from "@/components/content-provider";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function Contact() {
  const { contacto, identity } = useContent();

  return (
    <section id="contacto" data-section="contacto" className="scroll-mt-20 bg-ink py-20 text-bone sm:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-champagne">
          Contacto
        </span>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          {contacto.titulo}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-bone/80">
          {contacto.texto}
        </p>

        <div className="mt-9 flex justify-center">
          <WhatsAppButton
            message={contacto.whatsappMsg}
            phone={identity.whatsapp}
            variant="solid"
            className="px-8 py-4 text-base"
          >
            {identity.whatsappDisplay}
          </WhatsAppButton>
        </div>

        <dl className="mt-10 flex flex-col items-center justify-center gap-4 text-sm text-bone/80 sm:flex-row sm:gap-10">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-champagne" aria-hidden="true" />
            <dt className="sr-only">WhatsApp</dt>
            <dd>{identity.whatsappDisplay}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-champagne" aria-hidden="true" />
            <dt className="sr-only">Email</dt>
            <dd>
              <a href={`mailto:${identity.email}`} className="hover:text-bone">
                {identity.email}
              </a>
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-champagne" aria-hidden="true" />
            <dt className="sr-only">Horario</dt>
            <dd>{identity.horario}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
