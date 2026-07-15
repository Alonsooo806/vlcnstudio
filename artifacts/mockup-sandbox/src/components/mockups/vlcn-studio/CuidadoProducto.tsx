import React from 'react';
import { ArrowLeft, Droplets, FlaskConical, Wind, Thermometer } from 'lucide-react';
import { navTo } from './navigate';

const sections = [
  {
    icon: Droplets,
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.08)',
    border: 'rgba(34,211,238,0.25)',
    number: '1.',
    title: 'El Lavado: Ingeniería contra el desgaste',
    bullets: [
      {
        label: 'Volteo obligado',
        text: 'Siempre, y sin excepciones, lava la prenda al revés. Esto elimina la fricción directa con otros tejidos y con el tambor de la lavadora, que es el enemigo #1 del estampado.',
      },
      {
        label: 'Temperatura controlada',
        text: 'Utiliza agua fría (máximo 30°C). El agua caliente reblandece la base adhesiva de poliamida del DTF, lo que puede provocar que el diseño se levante o se cuartee con los ciclos de lavado.',
      },
      {
        label: 'Ciclos suaves',
        text: 'Programa tu lavadora en modo delicado. La fuerza centrífuga excesiva y el centrifugado agresivo rompen la estructura molecular del estampado a largo plazo.',
      },
    ],
  },
  {
    icon: FlaskConical,
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.08)',
    border: 'rgba(244,114,182,0.25)',
    number: '2.',
    title: 'La Química: Lo que mata tu diseño',
    bullets: [
      {
        label: 'Cero químicos agresivos',
        text: 'El cloro, la lavandina y los detergentes con blanqueadores ópticos son corrosivos. Destruyen los pigmentos de la tinta DTF y degradan la flexibilidad de la impresión, volviéndola rígida y quebradiza. Usa únicamente detergentes neutros.',
      },
    ],
  },
  {
    icon: Wind,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.25)',
    number: '3.',
    title: 'El Secado: El enemigo invisible',
    bullets: [
      {
        label: 'Prohibida la secadora',
        text: 'Jamás uses secadora. El calor seco intenso es letal para el DTF; puede derretir la resina adhesiva o hacer que el diseño se pegue sobre sí mismo. La prenda debe secarse siempre al aire libre y, preferiblemente, a la sombra para evitar que los rayos UV degraden los colores de alta densidad.',
      },
    ],
  },
  {
    icon: Thermometer,
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.25)',
    number: '4.',
    title: 'El Planchado: El riesgo de quemado',
    bullets: [
      {
        label: 'Protección técnica',
        text: 'Nunca, bajo ninguna circunstancia, pases la plancha caliente directamente sobre el estampado. El calor directo puede derretir la tinta y arruinar el cabezal de tu plancha.',
      },
      {
        label: 'La técnica correcta',
        text: 'Plancha siempre por el revés o, si es estrictamente necesario por el frente, coloca un paño de algodón limpio (o papel mantequilla/teflón) entre la plancha y el diseño. La plancha debe estar a temperatura media, sin vapor.',
      },
    ],
  },
];

export default function CuidadoProducto() {
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
          <p className="font-mono text-xs tracking-widest mb-4" style={{ color: '#22d3ee' }}>
            GUÍA TÉCNICA
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-4">
            CUIDADO DE{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #22d3ee, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TU PRODUCTO
            </span>
          </h1>
          <p className="text-white/40 text-sm font-mono">
            Instrucciones para mantener la calidad del estampado DTF al máximo
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-12" style={{ background: 'linear-gradient(90deg, #22d3ee 0%, transparent 100%)' }} />

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <section
                key={s.number}
                className="rounded-xl p-6"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                {/* Section header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}40` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-bold" style={{ color: s.color }}>
                      {s.number}
                    </span>
                    <h2 className="text-base font-bold tracking-tight text-white">
                      {s.title}
                    </h2>
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-4 pl-12">
                  {s.bullets.map((b, i) => (
                    <div key={i}>
                      <p className="font-mono text-xs font-bold mb-1" style={{ color: s.color }}>
                        • {b.label}
                      </p>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {b.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/30 text-xs font-mono text-center leading-relaxed">
            VLCN STUDIO · Tecnología DTF Industrial · Temuco, Chile
            <br />
            Siguiendo estas instrucciones, tu estampado durará más de 50 lavados
          </p>
        </div>
      </main>
    </div>
  );
}
