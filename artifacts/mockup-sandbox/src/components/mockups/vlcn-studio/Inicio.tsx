import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ShieldCheck, Ruler, Droplets } from 'lucide-react';

const SLIDES = [
  `${import.meta.env.BASE_URL}generated_images/vlcn-inicio-slide-1.jpg`,
  `${import.meta.env.BASE_URL}generated_images/vlcn-inicio-slide-2.jpg`,
  `${import.meta.env.BASE_URL}generated_images/vlcn-inicio-slide-3.png`,
];

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

      {/* Blob 4 — naranja bottom-left */}
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[350px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Blob 5 — amarillo bottom-right */}
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #eab308 0%, transparent 65%)', filter: 'blur(60px)' }} />

      {/* Formas geométricas flotantes */}
      {/* Círculo grande outline violeta */}
      <div className="absolute top-20 left-[8%] w-48 h-48 rounded-full opacity-10"
        style={{ border: '2px solid #a855f7' }} />
      {/* Círculo mediano outline cyan */}
      <div className="absolute top-40 right-[12%] w-28 h-28 rounded-full opacity-15"
        style={{ border: '2px solid #22d3ee' }} />
      {/* Cuadrado rotado rosa */}
      <div className="absolute top-[55%] left-[6%] w-20 h-20 opacity-10 rotate-45"
        style={{ border: '2px solid #f472b6' }} />
      {/* Cuadrado rotado naranja */}
      <div className="absolute top-[30%] right-[6%] w-14 h-14 opacity-10 rotate-12"
        style={{ border: '2px solid #fb923c' }} />
      {/* Triángulo SVG amarillo */}
      <svg className="absolute bottom-[20%] left-[15%] opacity-10 w-16 h-16" viewBox="0 0 64 64" fill="none">
        <polygon points="32,4 60,60 4,60" stroke="#fde047" strokeWidth="2" />
      </svg>
      {/* Triángulo SVG cyan */}
      <svg className="absolute top-[15%] right-[20%] opacity-10 w-10 h-10 -rotate-12" viewBox="0 0 64 64" fill="none">
        <polygon points="32,4 60,60 4,60" stroke="#67e8f9" strokeWidth="2" />
      </svg>

      {/* Grid de puntos */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Línea de luz horizontal */}
      <div className="absolute top-[38%] left-0 right-0 h-px opacity-10"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #a855f7 20%, #06b6d4 50%, #ec4899 80%, transparent 100%)' }} />
      <div className="absolute top-[38%] left-0 right-0 h-4 opacity-5"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #a855f7 20%, #06b6d4 50%, #ec4899 80%, transparent 100%)', filter: 'blur(8px)' }} />

      {/* Línea de luz diagonal */}
      <div className="absolute top-0 left-[40%] w-px h-full opacity-5 rotate-[15deg] origin-top"
        style={{ background: 'linear-gradient(180deg, transparent 0%, #7c3aed 30%, #06b6d4 70%, transparent 100%)' }} />

      {/* Puntos decorativos sueltos */}
      <div className="absolute top-[22%] left-[28%] w-2 h-2 rounded-full opacity-40" style={{ background: '#a855f7' }} />
      <div className="absolute top-[60%] left-[55%] w-3 h-3 rounded-full opacity-30" style={{ background: '#22d3ee' }} />
      <div className="absolute top-[45%] right-[25%] w-2 h-2 rounded-full opacity-35" style={{ background: '#f472b6' }} />
      <div className="absolute bottom-[25%] right-[35%] w-2.5 h-2.5 rounded-full opacity-30" style={{ background: '#fb923c' }} />
      <div className="absolute top-[10%] left-[55%] w-1.5 h-1.5 rounded-full opacity-40" style={{ background: '#fde047' }} />
      <div className="absolute bottom-[40%] left-[32%] w-2 h-2 rounded-full opacity-25" style={{ background: '#67e8f9' }} />

      {/* Pequeños cuadrados llenos */}
      <div className="absolute top-[18%] right-[30%] w-3 h-3 rotate-45 opacity-20" style={{ background: '#c084fc' }} />
      <div className="absolute bottom-[30%] left-[20%] w-2 h-2 rotate-45 opacity-25" style={{ background: '#34d399' }} />
      <div className="absolute top-[70%] right-[15%] w-3 h-3 rotate-45 opacity-20" style={{ background: '#f59e0b' }} />

      {/* Viñeta oscura para legibilidad */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
    </div>
  );
}

export default function Inicio() {
  const [slide, setSlide] = useState(0);

  const goToConfigurador = () => {
    window.location.href = `${import.meta.env.BASE_URL}categorias`;
  };

  const nextSlide = () => setSlide((prev) => (prev + 1) % SLIDES.length);

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-fuchsia-500 selection:text-white overflow-x-hidden">
      <BgDecor />

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(13,0,32,0.75)' }}>
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-8 w-auto object-contain" />
          <h1 className="font-bold tracking-tighter text-xl text-white">VLCN STUDIO</h1>
        </div>
        <span className="hidden md:inline-flex text-sm font-mono text-white/40">TALLER TÉCNICO V1.0</span>
      </header>

      {/* HERO */}
      <section className="relative z-10 overflow-hidden border-b border-white/10">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2">

          {/* LEFT: COPY */}
          <div className="flex flex-col justify-center px-6 md:px-16 py-20 lg:py-0 order-2 lg:order-1">
            <span className="font-mono text-xs tracking-widest mb-6" style={{ color: '#c084fc' }}>¿QUÉ SOMOS?</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-8 text-white">
              LÍDER EN DISEÑOS
              <br />
              <span style={{ background: 'linear-gradient(90deg, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                PERSONALIZADOS
              </span>
              <br />
              DE LA ZONA.
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-md mb-4">
              Te personalizamos tu prenda con tus diseños favoritos de personajes de
              películas, series, artistas y futbolistas. También puedes subir la foto
              que quieras para que hagamos el resto.
            </p>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-md mb-10">
              Estamos ubicados en Temuco, salida norte. 📌 ¡Haz tus
              pedidos que nosotros hacemos el resto!
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
            <div className="grid grid-cols-3 gap-4 mt-16 max-w-md">
              <div className="flex flex-col gap-2">
                <Ruler className="w-4 h-4" style={{ color: '#22d3ee' }} />
                <span className="font-mono text-[11px] text-white/40 leading-tight">FICHA TÉCNICA POR PRENDA</span>
              </div>
              <div className="flex flex-col gap-2">
                <ShieldCheck className="w-4 h-4" style={{ color: '#a855f7' }} />
                <span className="font-mono text-[11px] text-white/40 leading-tight">INSPECCIÓN MANUAL</span>
              </div>
              <div className="flex flex-col gap-2">
                <Droplets className="w-4 h-4" style={{ color: '#f472b6' }} />
                <span className="font-mono text-[11px] text-white/40 leading-tight">ESTAMPADO DE ALTA DURABILIDAD</span>
              </div>
            </div>
          </div>

          {/* RIGHT: IMAGE SLIDER */}
          <div className="relative min-h-[420px] lg:min-h-screen order-1 lg:order-2 overflow-hidden">
            {/* Borde luminoso lateral */}
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
            {/* Overlay de color en esquina */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, transparent 50%)' }} />

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

      {/* BOTTOM STRIP CTA */}
      <section className="relative z-10 px-6 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-[1400px] mx-auto">
        {/* Línea decorativa arriba del strip */}
        <div className="absolute top-0 left-6 right-6 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), rgba(34,211,238,0.3), transparent)' }} />

        <p className="font-mono text-xs text-white/30 tracking-widest text-center md:text-left">
          BASES · ESTAMPADOS · UBICACIÓN · TALLAS — TODO CONFIGURABLE
        </p>
        <button
          onClick={goToConfigurador}
          className="inline-flex items-center gap-3 px-6 py-3 font-mono text-sm font-bold tracking-wide border transition-all hover:scale-105"
          style={{ borderColor: 'rgba(168,85,247,0.5)', color: '#c084fc', background: 'rgba(124,58,237,0.08)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg,#7c3aed,#ec4899)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#c084fc'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.5)'; }}
        >
          VER EL SITIO COMPLETO
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
