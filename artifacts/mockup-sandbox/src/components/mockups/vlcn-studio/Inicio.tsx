import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ShieldCheck, Ruler, Droplets } from 'lucide-react';
import { navTo } from './navigate';
import Footer from './Footer';

const SLIDES = [
  `${import.meta.env.BASE_URL}generated_images/vlcn-inicio-slide-1.jpg`,
  `${import.meta.env.BASE_URL}generated_images/vlcn-inicio-slide-2.jpg`,
  `${import.meta.env.BASE_URL}generated_images/vlcn-inicio-slide-3.png`,
];

const WA_URL = 'https://wa.me/56965536529';

/* ─── Decoración de fondo ─── */
function BgDecor() {
  return (
    <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #0d0020 0%, #07080f 45%, #00101a 100%)' }} />

      {/* Blob 1 — violeta grande izq */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Blob 2 — cyan derecha */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(90px)' }} />

      {/* Blob 3 — pink centro */}
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 65%)', filter: 'blur(100px)' }} />

      {/* Grid de puntos */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Viñeta oscura para legibilidad */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
    </div>
  );
}

export default function Inicio() {
  const [slide, setSlide] = useState(0);

  const goToConfigurador = () => navTo('categorias');
  const nextSlide = () => setSlide((prev) => (prev + 1) % SLIDES.length);

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-fuchsia-500 selection:text-white overflow-x-hidden flex flex-col">
      <BgDecor />

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(13,0,32,0.75)' }}>
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-8 w-auto object-contain" />
          <h1 className="font-bold tracking-tighter text-xl text-white">VLCN STUDIO</h1>
        </div>
        <span className="hidden md:inline-flex text-sm font-mono text-white/40">TEMUCO · CHILE</span>
      </header>

      {/* HERO */}
      <section className="relative z-10 overflow-hidden border-b border-white/10 flex-1">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2">

          {/* LEFT: COPY */}
          <div className="flex flex-col justify-center px-6 md:px-16 py-20 lg:py-0 order-2 lg:order-1">
            <span className="font-mono text-xs tracking-widest mb-6" style={{ color: '#c084fc' }}>PERSONALIZACIÓN PREMIUM</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-8 text-white">
              TU DISEÑO
              <br />
              <span style={{ background: 'linear-gradient(90deg, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                EN NUESTRA
              </span>
              <br />
              PRENDA.
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-md mb-10">
              Estampado de personajes, series, artistas y logos en Temuco.
              Elige tu prenda, sube tu diseño o describe tu idea — nosotros hacemos el resto.
            </p>

            <button
              onClick={goToConfigurador}
              className="group inline-flex items-center gap-3 px-8 py-4 font-mono text-sm font-bold tracking-wide w-fit transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff' }}
            >
              PERSONALIZA AQUÍ
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* MINI SPECS */}
            <div className="grid grid-cols-3 gap-4 mt-14 max-w-md">
              <div className="flex flex-col gap-2">
                <Ruler className="w-4 h-4" style={{ color: '#22d3ee' }} />
                <span className="font-mono text-[11px] text-white/40 leading-tight">TALLAS S A 2XL</span>
              </div>
              <div className="flex flex-col gap-2">
                <ShieldCheck className="w-4 h-4" style={{ color: '#a855f7' }} />
                <span className="font-mono text-[11px] text-white/40 leading-tight">GARANTÍA 50 LAVADOS</span>
              </div>
              <div className="flex flex-col gap-2">
                <Droplets className="w-4 h-4" style={{ color: '#f472b6' }} />
                <span className="font-mono text-[11px] text-white/40 leading-tight">DTF + SERIGRAFÍA</span>
              </div>
            </div>
          </div>

          {/* RIGHT: IMAGE SLIDER */}
          <div className="relative min-h-[420px] lg:min-h-screen order-1 lg:order-2 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-px z-10 hidden lg:block"
              style={{ background: 'linear-gradient(180deg, transparent, #a855f7 30%, #22d3ee 70%, transparent)', opacity: 0.4 }} />

            {SLIDES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Personalización VLCN Studio ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* NEXT ARROW */}
            <button
              onClick={nextSlide}
              aria-label="Siguiente imagen"
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(13,0,32,0.7)', borderColor: 'rgba(168,85,247,0.4)', color: '#c084fc' }}
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
                  className="h-1.5 rounded-full transition-all"
                  style={i === slide
                    ? { width: '24px', background: 'linear-gradient(90deg, #a855f7, #22d3ee)' }
                    : { width: '6px', background: 'rgba(255,255,255,0.3)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA SECTION */}
      <section className="relative z-10 px-6 md:px-16 py-16 border-b border-white/10"
        style={{ background: 'rgba(13,0,32,0.6)' }}>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-white mb-2">
              ¿Tienes dudas?
            </h3>
            <p className="text-white/60 text-base max-w-md">
              Te atendemos personalmente por WhatsApp. Preguntas sobre diseños, tallas, precios o entregas — respuesta en minutos.
            </p>
          </div>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-3 px-8 py-4 font-mono text-sm font-bold tracking-wide transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
            style={{ background: '#25D366', color: '#fff' }}
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white shrink-0">
              <path d="M16.003 3C9.376 3 4 8.376 4 15.003c0 2.18.587 4.218 1.607 5.97L4 29l8.267-1.585A12.003 12.003 0 0 0 16.003 28c6.624 0 12-5.376 12-12.003C28.003 9.376 22.627 4 16.003 4zm.001 21.84c-1.863 0-3.594-.503-5.083-1.376l-.363-.216-4.908.94.957-4.802-.236-.374A9.845 9.845 0 0 1 5.17 15c0-5.426 4.411-9.838 9.835-9.838 5.424 0 9.835 4.412 9.835 9.838 0 5.426-4.41 9.84-9.836 9.84zm5.39-7.372c-.296-.148-1.748-.86-2.02-.958-.27-.098-.466-.148-.66.148-.195.297-.757.958-.928 1.154-.17.197-.34.222-.636.074-.296-.148-1.25-.46-2.38-1.47-.88-.784-1.473-1.752-1.645-2.048-.17-.295-.018-.455.13-.602.132-.133.296-.347.444-.52.148-.173.198-.297.297-.494.099-.197.05-.37-.025-.52-.074-.147-.66-1.59-.904-2.177-.238-.572-.48-.494-.66-.503l-.562-.01c-.197 0-.518.074-.79.37-.27.296-1.03 1.005-1.03 2.45 0 1.443 1.055 2.84 1.203 3.037.148.197 2.075 3.167 5.03 4.44.702.302 1.25.483 1.677.618.705.224 1.347.192 1.855.116.565-.085 1.748-.715 1.995-1.405.247-.69.247-1.28.173-1.403-.074-.124-.27-.197-.566-.345z"/>
            </svg>
            ESCRÍBENOS POR WHATSAPP
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
