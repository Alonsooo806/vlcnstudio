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
          <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-8 w-auto invert" />
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

      {/* PÁGINAS LEGALES / INFO */}
      <section className="px-8 md:px-20 py-8 border-t border-white/5"
        style={{ background: 'rgba(0,0,0,0.35)' }}>
        <p className="font-mono text-[10px] tracking-widest text-white/25 mb-4 text-center">INFORMACIÓN IMPORTANTE</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {/* ¿Quiénes somos? */}
          <a
            href="/quienes"
            className="group flex flex-col gap-3 rounded-lg px-5 py-4 transition-all hover:border-purple-500/40"
            style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)' }}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
              style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="rgba(192,132,252,1)" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs font-bold tracking-wider text-white/70 group-hover:text-white transition-colors">¿QUIÉNES SOMOS?</p>
              <p className="text-white/35 text-xs mt-0.5">Nuestra historia y contacto</p>
            </div>
          </a>
          {/* Términos */}
          <a
            href="/terminos"
            className="group flex items-center gap-4 rounded-lg px-5 py-4 transition-all hover:border-purple-500/40"
            style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)' }}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
              style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="rgba(192,132,252,1)" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs font-bold tracking-wider text-white/70 group-hover:text-white transition-colors">
                TÉRMINOS Y CONDICIONES
              </p>
              <p className="text-white/35 text-xs mt-0.5">Compra, garantía y devoluciones</p>
            </div>
          </a>

          {/* Cuidado */}
          <a
            href="/cuidado"
            className="group flex items-center gap-4 rounded-lg px-5 py-4 transition-all hover:border-cyan-500/40"
            style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.12)' }}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="rgba(34,211,238,1)" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs font-bold tracking-wider text-white/70 group-hover:text-white transition-colors">
                CUIDADO DE TU PRODUCTO
              </p>
              <p className="text-white/35 text-xs mt-0.5">Lavado, secado y planchado DTF</p>
            </div>
          </a>

          {/* Preguntas y Respuestas */}
          <a
            href="/faq"
            className="group flex items-center gap-4 rounded-lg px-5 py-4 transition-all hover:border-pink-500/40"
            style={{ background: 'rgba(236,72,153,0.04)', border: '1px solid rgba(236,72,153,0.12)' }}
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
              style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="rgba(236,72,153,1)" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-xs font-bold tracking-wider text-white/70 group-hover:text-white transition-colors">
                PREGUNTAS Y RESPUESTAS
              </p>
              <p className="text-white/35 text-xs mt-0.5">DTF, compra, garantía y envíos</p>
            </div>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
