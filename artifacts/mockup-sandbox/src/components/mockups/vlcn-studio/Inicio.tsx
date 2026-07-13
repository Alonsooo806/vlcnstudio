import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ShieldCheck, Ruler, Droplets } from 'lucide-react';

const SLIDES = [
  `${import.meta.env.BASE_URL}generated_images/vlcn-inicio-slide-1.jpg`,
  `${import.meta.env.BASE_URL}generated_images/vlcn-inicio-slide-2.jpg`,
  `${import.meta.env.BASE_URL}generated_images/vlcn-inicio-slide-3.png`,
];

export default function Inicio() {
  const [slide, setSlide] = useState(0);

  const goToConfigurador = () => {
    window.location.href = `${import.meta.env.BASE_URL}categorias`;
  };

  const nextSlide = () => setSlide((prev) => (prev + 1) % SLIDES.length);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-8 w-auto object-contain" />
          <h1 className="font-bold tracking-tighter text-xl">VLCN STUDIO</h1>
        </div>
        <span className="hidden md:inline-flex text-sm font-mono text-muted-foreground">TALLER TÉCNICO V1.0</span>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2">

          {/* LEFT: COPY */}
          <div className="flex flex-col justify-center px-6 md:px-16 py-20 lg:py-0 order-2 lg:order-1">
            <span className="font-mono text-xs text-accent tracking-widest mb-6">¿QUÉ SOMOS?</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-8">
              LÍDER EN DISEÑOS
              <br />
              PERSONALIZADOS
              <br />
              DE LA ZONA.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mb-4">
              Te personalizamos tu prenda con tus diseños favoritos de personajes de
              películas, series, artistas y futbolistas. También puedes subir la foto
              que quieras para que hagamos el resto.
            </p>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mb-10">
              Estamos ubicados en Temuco, salida norte. 📌 ¡Haz tus
              pedidos que nosotros hacemos el resto!
            </p>

            <button
              onClick={goToConfigurador}
              className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-sm font-bold tracking-wide w-fit hover:bg-accent transition-colors"
            >
              PERSONALIZA AQUÍ
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* MINI SPECS */}
            <div className="grid grid-cols-3 gap-4 mt-16 max-w-md">
              <div className="flex flex-col gap-2">
                <Ruler className="w-4 h-4 text-accent" />
                <span className="font-mono text-[11px] text-muted-foreground leading-tight">FICHA TÉCNICA POR PRENDA</span>
              </div>
              <div className="flex flex-col gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="font-mono text-[11px] text-muted-foreground leading-tight">INSPECCIÓN MANUAL</span>
              </div>
              <div className="flex flex-col gap-2">
                <Droplets className="w-4 h-4 text-accent" />
                <span className="font-mono text-[11px] text-muted-foreground leading-tight">ESTAMPADO DE ALTA DURABILIDAD</span>
              </div>
            </div>
          </div>

          {/* RIGHT: IMAGE SLIDER */}
          <div className="relative min-h-[420px] lg:min-h-screen order-1 lg:order-2 overflow-hidden">
            {SLIDES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Personalización VLCN Studio ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-background/60 via-transparent to-transparent pointer-events-none" />

            {/* NEXT ARROW */}
            <button
              onClick={nextSlide}
              aria-label="Siguiente imagen"
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* DOTS */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Ir a la imagen ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-6 bg-accent' : 'w-1.5 bg-background/70'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM STRIP CTA */}
      <section className="px-6 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-[1400px] mx-auto">
        <p className="font-mono text-xs text-muted-foreground tracking-widest text-center md:text-left">
          BASES · ESTAMPADOS · UBICACIÓN · TALLAS — TODO CONFIGURABLE
        </p>
        <button
          onClick={goToConfigurador}
          className="inline-flex items-center gap-3 border border-foreground px-6 py-3 font-mono text-sm font-bold tracking-wide hover:bg-foreground hover:text-background transition-colors"
        >
          VER EL SITIO COMPLETO
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
