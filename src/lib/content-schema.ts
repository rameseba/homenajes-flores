// ── Modelo de contenido editable del sitio ───────────────────────────────────
// Única fuente de verdad: tipos + valores por defecto. El editor guarda overrides
// en Supabase (JSONB) y el ContentProvider los mezcla sobre estos defaults.

// Cada variante guarda una "base" de imagen. Para fotos locales optimizadas
// (p. ej. "/productos/atril-25-blanca") el componente Photo añade el sufijo de
// tamaño (-sm/-md/-lg.webp) y arma el srcset. Para imágenes subidas desde el
// editor se guarda la URL completa de Supabase Storage y se usa tal cual.
export type ImgSet = {
  real: string;
  blanca: string;
  mostrador: string;
};

export type Producto = {
  id: string;
  nombre: string;
  rosas: number;
  categoria: string;
  descripcion: string;
  img: ImgSet;
};

export type TrustItem = { titulo: string; texto: string };

export type SiteContent = {
  identity: {
    nombre: string;
    tagline: string;
    whatsapp: string; // solo dígitos, formato wa.me
    whatsappDisplay: string;
    email: string;
    ciudad: string;
    horario: string;
    logo: string;
  };
  hero: {
    titulo: string;
    subtitulo: string;
    imagen: string; // poster (primer fotograma / respaldo del video)
    video: string; // video de fondo (mp4); si está vacío se muestra la imagen
    ctaPrimary: string;
    ctaSecondary: string;
  };
  galeria: {
    titulo: string;
    subtitulo: string;
    imagenes: string[];
  };
  productos: {
    titulo: string;
    subtitulo: string;
    items: Producto[];
  };
  confianza: {
    titulo: string;
    subtitulo: string;
    items: TrustItem[];
  };
  contacto: {
    titulo: string;
    texto: string;
    whatsappMsg: string;
  };
  footer: {
    nota: string;
    copyright: string;
  };
};

const P = "/productos";

export const DEFAULT_CONTENT: SiteContent = {
  identity: {
    nombre: "Homenajes Florales",
    tagline: "Flores blancas para honrar y acompañar",
    whatsapp: "56956199315",
    whatsappDisplay: "+56 9 5619 9315",
    email: "homenajeflorales@gmail.com",
    ciudad: "Santiago, Chile",
    horario: "Atención todos los días",
    logo: "/logo.webp",
  },
  hero: {
    titulo: "Flores que acompañan en el adiós",
    subtitulo:
      "Arreglos de rosas blancas para velatorios y homenajes. Sobrios, frescos y hechos con respeto, listos para llegar donde más se necesitan.",
    imagen: `${P}/pie-urna-25-mostrador`,
    video: "/hero-rosas.mp4",
    ctaPrimary: "Cotizar por WhatsApp",
    ctaSecondary: "Ver arreglos",
  },
  galeria: {
    titulo: "Hecho con delicadeza",
    subtitulo:
      "Cada arreglo se prepara con rosas blancas frescas, pensado para acompañar este momento con serenidad.",
    imagenes: [
      `${P}/atril-25-mostrador`,
      `${P}/cubre-urna-50-mostrador`,
      `${P}/cubre-urna-7-mostrador`,
      `${P}/canasto-15-mostrador`,
    ],
  },
  productos: {
    titulo: "Nuestros arreglos",
    subtitulo:
      "Todos en rosas blancas. Elige el que más te acompañe y cotiza directo por WhatsApp, sin compromiso.",
    items: [
      {
        id: "atril-25",
        nombre: "Atril de 25 rosas",
        rosas: 25,
        categoria: "Atril",
        descripcion:
          "Corona en atril de pie con 25 rosas blancas y follaje fresco. Una presencia serena para acompañar en la ceremonia.",
        img: { real: `${P}/atril-25-real`, blanca: `${P}/atril-25-blanca`, mostrador: `${P}/atril-25-mostrador` },
      },
      {
        id: "canasto-15",
        nombre: "Canasto de 15 rosas",
        rosas: 15,
        categoria: "Canasto",
        descripcion:
          "Canasto con 15 rosas blancas y gypsophila. Un gesto delicado para expresar cercanía y consuelo.",
        img: { real: `${P}/canasto-15-real`, blanca: `${P}/canasto-15-blanca`, mostrador: `${P}/canasto-15-mostrador` },
      },
      {
        id: "cubre-urna-7",
        nombre: "Cubre urna de 7 rosas",
        rosas: 7,
        categoria: "Cubre urna",
        descripcion:
          "Cubre urna íntimo con 7 rosas blancas. Sobrio y elegante para una despedida cercana.",
        img: { real: `${P}/cubre-urna-7-real`, blanca: `${P}/cubre-urna-7-blanca`, mostrador: `${P}/cubre-urna-7-mostrador` },
      },
      {
        id: "cubre-urna-25",
        nombre: "Cubre urna de 25 rosas",
        rosas: 25,
        categoria: "Cubre urna",
        descripcion:
          "Cubre urna con 25 rosas blancas que viste la urna con elegancia y respeto.",
        img: { real: `${P}/cubre-urna-25-real`, blanca: `${P}/cubre-urna-25-blanca`, mostrador: `${P}/cubre-urna-25-mostrador` },
      },
      {
        id: "cubre-urna-50",
        nombre: "Cubre urna de 50 rosas",
        rosas: 50,
        categoria: "Cubre urna",
        descripcion:
          "Cubre urna amplio de 50 rosas blancas. Un homenaje generoso y luminoso.",
        img: { real: `${P}/cubre-urna-50-real`, blanca: `${P}/cubre-urna-50-blanca`, mostrador: `${P}/cubre-urna-50-mostrador` },
      },
      {
        id: "pie-urna-15",
        nombre: "Pie de urna de 15 rosas",
        rosas: 15,
        categoria: "Pie de urna",
        descripcion:
          "Pie de urna con 15 rosas blancas y verdes naturales, para acompañar con sobriedad.",
        img: { real: `${P}/pie-urna-15-real`, blanca: `${P}/pie-urna-15-blanca`, mostrador: `${P}/pie-urna-15-mostrador` },
      },
      {
        id: "pie-urna-25",
        nombre: "Pie de urna de 25 rosas",
        rosas: 25,
        categoria: "Pie de urna",
        descripcion:
          "Pie de urna de 25 rosas blancas, sereno e imponente junto a la despedida.",
        img: { real: `${P}/pie-urna-25-real`, blanca: `${P}/pie-urna-25-blanca`, mostrador: `${P}/pie-urna-25-mostrador` },
      },
      {
        id: "canasto-15-b",
        nombre: "Canasto de 15 rosas (clásico)",
        rosas: 15,
        categoria: "Canasto",
        descripcion:
          "Canasto de 15 rosas blancas, modelo clásico, ideal para hacer llegar tu cariño.",
        img: { real: `${P}/canasto-15-b-real`, blanca: `${P}/canasto-15-b-blanca`, mostrador: `${P}/canasto-15-b-mostrador` },
      },
    ],
  },
  confianza: {
    titulo: "Acompañamos cada detalle",
    subtitulo: "Para que en un momento difícil solo tengas que pensar en lo importante.",
    items: [
      {
        titulo: "Cobertura en Santiago",
        texto: "Llegamos a velatorios, iglesias y cementerios de la Región Metropolitana.",
      },
      {
        titulo: "Rosas blancas frescas",
        texto: "Seleccionamos flores frescas y las preparamos con dedicación para cada homenaje.",
      },
      {
        titulo: "Atención cercana y directa",
        texto: "Te orientamos por WhatsApp con calma y coordinamos la entrega a tiempo.",
      },
    ],
  },
  contacto: {
    titulo: "Estamos para acompañarte",
    texto:
      "Escríbenos por WhatsApp y te ayudamos a elegir el arreglo y coordinar la entrega, con la calma que este momento merece.",
    whatsappMsg: "Hola, necesito ayuda para coordinar un arreglo floral de homenaje.",
  },
  footer: {
    nota: "Arreglos florales de condolencias y homenaje, hechos con respeto y cariño.",
    copyright: "Homenajes Florales",
  },
};
