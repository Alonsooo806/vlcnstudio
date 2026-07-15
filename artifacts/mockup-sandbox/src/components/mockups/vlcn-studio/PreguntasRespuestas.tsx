import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { navTo } from './navigate';

const faqs = [
  {
    q: '¿Qué es la tecnología DTF que utilizan?',
    a: 'Es una técnica de impresión digital de grado industrial que permite transferir diseños de alta densidad a las prendas. Ofrece colores vivos, gran definición en diseños complejos y una durabilidad superior a métodos tradicionales como la sublimación o serigrafía.',
  },
  {
    q: '¿Cómo funciona la compra?',
    bullets: [
      {
        label: 'Gestión',
        text: 'Cada prenda se fabrica a pedido. Por ello, el plazo estimado de preparación es de 1 a 2 semanas, dependiendo de la demanda.',
      },
      {
        label: 'Entrega',
        text: 'En Temuco realizamos entregas presenciales en puntos de encuentro coordinados. Para otras zonas del país, utilizamos empresa de envío, con costos de despacho a cargo del cliente.',
      },
    ],
  },
  {
    q: '¿Qué garantías y cambios tienen?',
    bullets: [
      {
        label: 'Garantía Legal',
        text: 'Cumplimos con la Ley N° 19.496. Si tu producto presenta fallas de origen o defectos de fabricación, tienes 6 meses para ejercer tu derecho a garantía. Nos hacemos responsables de gestionar la reparación, cambio o restitución según corresponda.',
      },
      {
        label: 'Política de Devoluciones',
        text: 'Al ser productos personalizados y fabricados exclusivamente para ti, no aplica el derecho a retracto por razones de gusto personal o error en la elección de tallas. Te recomendamos revisar bien las medidas antes de confirmar tu pedido.',
      },
    ],
  },
  {
    q: '¿Cómo cuidar mi prenda y el estampado?',
    a: 'Para garantizar que tu diseño DTF mantenga su calidad industrial, sigue estas instrucciones técnicas:',
    bullets: [
      { label: 'Lavado', text: 'Siempre del revés, con agua fría (máx. 30°C) y ciclo suave.' },
      { label: 'Prohibiciones', text: 'No usar cloro, blanqueadores ni secadora.' },
      { label: 'Planchado', text: 'Nunca planchar directamente sobre el estampado. Hazlo por el revés o usando un paño de protección.' },
    ],
  },
  {
    q: '¿Mis datos son privados?',
    a: 'Sí, tus datos (nombre, dirección, teléfono) son utilizados exclusivamente para la gestión y despacho de tus productos. VLCN Studio garantiza la confidencialidad de tu información conforme a la normativa vigente.',
  },
  {
    q: 'Contacto',
    a: '¿Tienes dudas? Escríbenos a nuestro correo oficial: alonsoovalentino@gmail.com. Estamos aquí para asegurar que tu experiencia sea excelente. Puedes hacer sugerencias para mejorar nuestro servicio.',
  },
  {
    q: '¿Cómo puedo enviar mi diseño?',
    a: 'Puedes mandarlo a nuestro correo alonsoovalentino@gmail.com respetando siempre que la imagen sea de alta calidad, formato PNG (fondo transparente), y 300 DPI (píxeles por pulgada).',
  },
];

function FaqItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: open ? 'rgba(168,85,247,0.07)' : 'rgba(255,255,255,0.03)',
        border: open ? '1px solid rgba(168,85,247,0.3)' : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
      >
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-xs font-bold shrink-0 w-5 text-right"
            style={{ color: '#a855f7' }}
          >
            {index + 1}.
          </span>
          <span className="font-semibold text-white/85 text-sm md:text-base leading-snug">
            {faq.q}
          </span>
        </div>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform duration-200"
          style={{
            color: '#a855f7',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div className="px-6 pb-6 pl-[3.75rem] space-y-3">
          {faq.a && (
            <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
          )}
          {faq.bullets && (
            <ul className="space-y-3 mt-1">
              {faq.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: '#a855f7' }}
                  />
                  <span>
                    <span className="font-semibold text-white/75">{b.label}: </span>
                    <span className="text-white/55">{b.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function PreguntasRespuestas() {
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
            SOPORTE
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-4">
            PREGUNTAS{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FRECUENTES
            </span>
          </h1>
          <p className="text-white/40 text-sm font-mono">
            Todo lo que necesitas saber antes de hacer tu pedido
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-10"
          style={{ background: 'linear-gradient(90deg, #a855f7 0%, transparent 100%)' }}
        />

        {/* FAQ accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/30 text-xs font-mono text-center leading-relaxed">
            VLCN STUDIO · alonsoovalentino@gmail.com · +56 9 6553 6529
            <br />
            Atención de 09:00 a 18:00 hrs.
          </p>
        </div>
      </main>
    </div>
  );
}
