import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Clock } from 'lucide-react';
import { navTo } from './navigate';
import Footer from './Footer';

const WA_URL = 'https://wa.me/56965536529';

export default function Inicio() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-white"
      style={{ background: 'linear-gradient(160deg, #0d0020 0%, #07080f 55%, #00101a 100%)' }}>

      {/* HEADER */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-white/10"
        style={{ background: 'rgba(13,0,32,0.7)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-8 w-auto" />
          <span className="font-bold tracking-tighter text-xl">VLCN STUDIO</span>
        </div>
        <span className="font-mono text-xs text-white/30 hidden md:block">TEMUCO · CHILE</span>
      </header>

      {/* HERO */}
      <section className="flex-1 flex flex-col lg:flex-row">

        {/* LEFT */}
        <div className="flex flex-col justify-center px-8 md:px-20 py-20 lg:w-1/2 lg:min-h-screen">
          <p className="font-mono text-xs tracking-widest mb-6" style={{ color: '#c084fc' }}>
            PERSONALIZACIÓN PREMIUM · TEMUCO
          </p>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
            TU DISEÑO
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #a855f7, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              EN NUESTRA
            </span>
            <br />
            PRENDA.
          </h1>

          <p className="text-white/55 text-lg leading-relaxed max-w-sm mb-12">
            Personajes, series, artistas, logos — o sube tu propio archivo.
            Elegimos el estampado, tú elijes el diseño.
          </p>

          {/* CTA PRINCIPAL */}
          <button
            onClick={() => navTo('categorias')}
            className="inline-flex items-center gap-4 px-10 py-5 font-mono font-bold tracking-wider text-base w-fit transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff', boxShadow: '0 0 40px rgba(168,85,247,0.35)' }}
          >
            SEGUIR
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* MINI TRUST */}
          <div className="flex gap-8 mt-12">
            <div className="flex items-center gap-2 text-white/40">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="font-mono text-xs">DTF + SERIGRAFÍA</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs">50 LAVADOS</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <Clock className="w-4 h-4 text-pink-400" />
              <span className="font-mono text-xs">4–5 DÍAS</span>
            </div>
          </div>
        </div>

        {/* RIGHT: IMAGE */}
        <div className="lg:w-1/2 relative overflow-hidden min-h-[50vh] lg:min-h-screen">
          <img
            src={`${import.meta.env.BASE_URL}generated_images/vlcn-inicio-slide-1.jpg`}
            alt="Camiseta personalizada VLCN Studio"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(13,0,32,0.6) 0%, transparent 40%), linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)'
          }} />
        </div>
      </section>

      {/* WHATSAPP STRIP */}
      <section className="px-8 md:px-20 py-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div>
          <p className="font-bold text-lg text-white mb-1">¿Tienes dudas?</p>
          <p className="text-white/50 text-sm">Te atendemos por WhatsApp — respuesta en minutos.</p>
        </div>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-7 py-4 font-mono text-sm font-bold tracking-wide shrink-0 transition-all hover:brightness-110 hover:scale-105"
          style={{ background: '#25D366', color: '#fff' }}
        >
          <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white shrink-0">
            <path d="M16.003 3C9.376 3 4 8.376 4 15.003c0 2.18.587 4.218 1.607 5.97L4 29l8.267-1.585A12.003 12.003 0 0 0 16.003 28c6.624 0 12-5.376 12-12.003C28.003 9.376 22.627 4 16.003 4zm.001 21.84c-1.863 0-3.594-.503-5.083-1.376l-.363-.216-4.908.94.957-4.802-.236-.374A9.845 9.845 0 0 1 5.17 15c0-5.426 4.411-9.838 9.835-9.838 5.424 0 9.835 4.412 9.835 9.838 0 5.426-4.41 9.84-9.836 9.84zm5.39-7.372c-.296-.148-1.748-.86-2.02-.958-.27-.098-.466-.148-.66.148-.195.297-.757.958-.928 1.154-.17.197-.34.222-.636.074-.296-.148-1.25-.46-2.38-1.47-.88-.784-1.473-1.752-1.645-2.048-.17-.295-.018-.455.13-.602.132-.133.296-.347.444-.52.148-.173.198-.297.297-.494.099-.197.05-.37-.025-.52-.074-.147-.66-1.59-.904-2.177-.238-.572-.48-.494-.66-.503l-.562-.01c-.197 0-.518.074-.79.37-.27.296-1.03 1.005-1.03 2.45 0 1.443 1.055 2.84 1.203 3.037.148.197 2.075 3.167 5.03 4.44.702.302 1.25.483 1.677.618.705.224 1.347.192 1.855.116.565-.085 1.748-.715 1.995-1.405.247-.69.247-1.28.173-1.403-.074-.124-.27-.197-.566-.345z"/>
          </svg>
          ESCRÍBENOS
        </a>
      </section>

      <Footer />
    </div>
  );
}
