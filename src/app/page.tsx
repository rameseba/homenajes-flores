import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatWhatsApp } from "@/components/float-whatsapp";
import { Hero } from "@/components/sections/hero";
import { Gallery } from "@/components/sections/gallery";
import { Products } from "@/components/sections/products";
import { Trust } from "@/components/sections/trust";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Products />
        <Gallery />
        <Trust />
        <Contact />
      </main>
      <Footer />
      <FloatWhatsApp />
    </>
  );
}
