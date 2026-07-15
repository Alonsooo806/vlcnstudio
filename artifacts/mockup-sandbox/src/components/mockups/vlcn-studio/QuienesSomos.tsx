import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { navTo } from './navigate';

const WA_URL = 'https://wa.me/56965536529';

export default function QuienesSomos() {
  return (
    <div
      className="min-h-screen font-sans text-white"
      style={{ background: 'linear-gradient(160deg, #0d0020 0%, #07080f 55%, #00101a 100%)' }}
    >
      {/* HEADER */}
      <header
        className="px-6 py-5 flex items-center gap-4 border-b border-white/10 sticky top-0 z-40"
        style={{ background: 'rgba(13,0,32,0.85)', backdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={() => navTo('home')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          INICIO
        </button>
        <span className="text-white/20">|</span>
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}generated_images/vlcn-logo.png`}
            alt="VLCN Studio"
            className="h-7 w-auto opacity-80"
          />
          <span className="font-bold tracking-tighter text-lg">VLCN STUDIO</span>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        {/* Title */}
        <div className="mb-12">
          <p className="font-mono text-xs tracking-widest mb-4" style={{ color: '#c084fc' }}>
            NUESTRA HISTORIA
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-4">
            ¿QUIÉNES{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SOMOS?
            </span>
          </h1>
          <p className="text-white/40 text-sm font-mono">
            Personalización textil de grado industrial · Temuco, Chile
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-12"
          style={{ background: 'linear-gradient(90deg, #a855f7 0%, transparent 100%)' }}
        />

        {/* Body */}
        <div
          className="rounded-xl p-8 mb-8"
          style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.2)' }}
        >
          <p className="text-white/70 text-base leading-relaxed">
            Somos VLCN Studio, una tienda de personalización textil en Temuco. Gestionamos todo el proceso con tecnología DTF industrial, desde la selección del textil hasta el estampado final. Garantizamos prendas únicas, duraderas y de alta calidad listas para ti.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="font-mono text-[10px] tracking-widest text-white/30 mb-2">CORREO</p>
            <a
              href="mailto:alonsoovalentino@gmail.com"
              className="text-white/70 text-sm hover:text-purple-300 transition-colors break-all"
            >
              alonsoovalentino@gmail.com
            </a>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="font-mono text-[10px] tracking-widest text-white/30 mb-2">CONTACTO</p>
            <p className="text-white/70 text-sm">
              09:00–18:00 hrs. ·{' '}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors"
              >
                +56 9 6553 6529
              </a>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/30 text-xs font-mono text-center leading-relaxed">
            VLCN STUDIO · Temuco, Chile
            <br />
            Tecnología DTF Industrial · Estampado de alta densidad
          </p>
        </div>
      </main>
    </div>
  );
}
