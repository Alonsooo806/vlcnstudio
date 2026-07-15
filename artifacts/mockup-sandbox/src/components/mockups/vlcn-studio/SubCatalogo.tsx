import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, CheckCircle2, XCircle, Star, ShoppingCart, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cartStore } from './cartStore';
import { navTo } from './navigate';

const BASE = import.meta.env.BASE_URL;
const TALLAS = ['S', 'M', 'L', 'XL', '2XL'] as const;
type Talla = typeof TALLAS[number];

const formatCLP = (n: number) =>
  '$' + n.toLocaleString('es-CL') + ' CLP';

// ─────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────
interface Producto {
  id: string;
  titulo: string;
  precio: number;
  stock: boolean;
  stockQty?: number;
  imagen?: string;
  placeholderBg?: string;
  placeholderEmoji?: string;
  tag?: string;
}

// ─────────────────────────────────────────
// CATÁLOGOS DE PRODUCTOS
// ─────────────────────────────────────────
const CATALOGO_DEPORTE: Producto[] = [
  { id: 'd1', titulo: 'Copa del Mundo Qatar 2022', precio: 15000, stock: true,  stockQty: 8,  placeholderBg: '#052e16', placeholderEmoji: '🏆', tag: 'NUEVO' },
  { id: 'd2', titulo: 'Lionel Messi — La Pulga',   precio: 15000, stock: true,  stockQty: 5,  placeholderBg: '#0c1a3a', placeholderEmoji: '⚽', tag: 'TOP' },
  { id: 'd3', titulo: 'Cristiano Ronaldo — CR7',   precio: 15000, stock: true,  stockQty: 3,  placeholderBg: '#1a0a00', placeholderEmoji: '🔥' },
  { id: 'd4', titulo: 'Michael Jordan — Bulls 23', precio: 15000, stock: true,  stockQty: 6,  placeholderBg: '#1a0000', placeholderEmoji: '🏀', tag: 'TOP' },
  { id: 'd5', titulo: 'Neymar Jr — NJR',           precio: 15000, stock: false,             placeholderBg: '#0f1f0f', placeholderEmoji: '⚡' },
  { id: 'd6', titulo: 'UFC — Fight Night',         precio: 15000, stock: true,  stockQty: 4,  placeholderBg: '#1a1a00', placeholderEmoji: '🥊' },
  { id: 'd7', titulo: 'Selección Chilena — La Roja', precio: 15000, stock: true, stockQty: 10, placeholderBg: '#2d0000', placeholderEmoji: '🇨🇱', tag: 'POPULAR' },
  { id: 'd8', titulo: 'NBA — All-Star',            precio: 15000, stock: true,  stockQty: 2,  placeholderBg: '#0a0a2e', placeholderEmoji: '🌟' },
];

const CATALOGO_ARTISTAS: Producto[] = [
  { id: 'a1', titulo: 'Billie Eilish — Happier Than Ever', precio: 15000, stock: true, stockQty: 7, placeholderBg: '#1a0033', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784044291/davinci__img1_ahora_usando_un_modelo_de_referencia_sobre_u_rzpo85.png', tag: 'TOP' },
  { id: 'a2', titulo: 'The Weeknd',                   precio: 15000, stock: true,  stockQty: 5,  placeholderBg: '#1a0008', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784043224/ChatGPT_Image_14_jul_2026_11_32_37_a.m_eev1or.png', tag: 'POPULAR' },
  { id: 'a3', titulo: 'Daddy Yankee — Gasolina',      precio: 15000, stock: true,  stockQty: 4,  placeholderBg: '#1a0d00', placeholderEmoji: '🎤' },
  { id: 'a4', titulo: 'Drake — Certified Lover Boy',  precio: 15000, stock: false,              placeholderBg: '#000d1a', placeholderEmoji: '🦉' },
  { id: 'a5', titulo: 'Rosalía — Motomami',           precio: 15000, stock: true,  stockQty: 3,  placeholderBg: '#1a001a', placeholderEmoji: '🌹', tag: 'NUEVO' },
  { id: 'a6', titulo: 'Kendrick Lamar — DAMN.',       precio: 15000, stock: true,  stockQty: 6,  placeholderBg: '#0d1a00', placeholderEmoji: '🎵' },
  { id: 'a7', titulo: 'Ozuna — Nibiru',               precio: 15000, stock: true,  stockQty: 8,  placeholderBg: '#1a1000', placeholderEmoji: '🌙' },
  { id: 'a8', titulo: 'Dua Lipa — Future Nostalgia',  precio: 15000, stock: true,  stockQty: 2,  placeholderBg: '#0d001a', placeholderEmoji: '💿', tag: 'NUEVO' },
];

const CATALOGO_PELICULAS: Producto[] = [
  { id: 'p1', titulo: 'Breaking Bad — Heisenberg',  precio: 15000, stock: true,  stockQty: 6,  placeholderBg: '#1a1200', placeholderEmoji: '⚗️', tag: 'CULTO' },
  { id: 'p2', titulo: 'The Dark Knight — Joker',    precio: 15000, stock: true,  stockQty: 5,  placeholderBg: '#0a0a0a', placeholderEmoji: '🃏', tag: 'TOP' },
  { id: 'p3', titulo: 'Pulp Fiction — Royale',      precio: 15000, stock: true,  stockQty: 3,  placeholderBg: '#1a0000', placeholderEmoji: '🎬', tag: 'CULTO' },
  { id: 'p4', titulo: 'Stranger Things — Hawkins',  precio: 15000, stock: false,              placeholderBg: '#000d1a', placeholderEmoji: '🔦' },
  { id: 'p5', titulo: 'El Padrino — The Godfather', precio: 15000, stock: true,  stockQty: 4,  placeholderBg: '#0d0d00', placeholderEmoji: '🌹', tag: 'CULTO' },
  { id: 'p6', titulo: 'Peaky Blinders — Tommy',     precio: 15000, stock: true,  stockQty: 7,  placeholderBg: '#0a0a12', placeholderEmoji: '🎩', tag: 'POPULAR' },
  { id: 'p7', titulo: 'Narcos — Escobar',           precio: 15000, stock: true,  stockQty: 2,  placeholderBg: '#0d1a00', placeholderEmoji: '💵' },
  { id: 'p8', titulo: 'Avatar — Pandora',           precio: 15000, stock: true,  stockQty: 5,  placeholderBg: '#001a12', placeholderEmoji: '🌿', tag: 'NUEVO' },
];

// ─────────────────────────────────────────
// TEMAS VISUALES POR CATEGORÍA
// ─────────────────────────────────────────
type CatId = 'deporte' | 'artistas' | 'peliculas';

const TEMAS: Record<CatId, {
  label: string;
  accentColor: string;
  accentHex: string;
  bgClass: string;
  headerBg: string;
  productos: Producto[];
  tagline: string;
  deco: React.ReactNode;
  citas?: { texto: string; autor: string }[];
}> = {
  deporte: {
    label: 'DEPORTE',
    accentColor: 'text-emerald-400',
    accentHex: '#10b981',
    bgClass: 'bg-zinc-950',
    headerBg: 'bg-zinc-950/90 border-emerald-900/30',
    productos: CATALOGO_DEPORTE,
    tagline: 'Fútbol · Básquet · UFC · Selecciones',
    deco: (
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden opacity-[0.04]">
        <span className="absolute text-[400px] -right-20 top-0 leading-none">⚽</span>
        <span className="absolute text-[200px] left-10 bottom-10 leading-none">🏆</span>
      </div>
    ),
    citas: [],
  },
  artistas: {
    label: 'ARTISTAS',
    accentColor: 'text-fuchsia-400',
    accentHex: '#e879f9',
    bgClass: 'bg-zinc-950',
    headerBg: 'bg-zinc-950/90 border-fuchsia-900/30',
    productos: CATALOGO_ARTISTAS,
    tagline: 'Urban · Reggaetón · Pop · Rock',
    deco: (
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden opacity-[0.04]">
        <span className="absolute text-[400px] -right-16 -top-10 leading-none">🎵</span>
        <span className="absolute text-[200px] left-6 bottom-6 leading-none">🎸</span>
        <div className="absolute top-0 left-0 right-0 h-px bg-fuchsia-500 blur-sm" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-violet-500 blur-sm" />
      </div>
    ),
  },
  peliculas: {
    label: 'PELÍCULAS & SERIES',
    accentColor: 'text-amber-400',
    accentHex: '#fbbf24',
    bgClass: 'bg-zinc-950',
    headerBg: 'bg-zinc-950/90 border-amber-900/30',
    productos: CATALOGO_PELICULAS,
    tagline: 'Culto · Acción · Drama · Sci-Fi',
    deco: (
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden opacity-[0.04]">
        <span className="absolute text-[400px] -right-12 -top-8 leading-none">🎬</span>
        <span className="absolute text-[200px] left-8 bottom-8 leading-none">🎞️</span>
      </div>
    ),
    citas: [
      { texto: '"Lo que hacemos en la vida tiene su eco en la eternidad."', autor: 'Gladiador' },
      { texto: '"Yo soy el que llama."', autor: 'Breaking Bad' },
    ],
  },
};

// ─────────────────────────────────────────
// FAQ DATA
// ─────────────────────────────────────────
const FAQS = [
  {
    pregunta: '⏱ ¿Cuánto demora el pedido?',
    respuesta: 'El tiempo de producción es de 3 a 5 días hábiles desde que recibimos tu pago y el diseño confirmado. Para pedidos urgentes (menos de 1 semana), consúltanos por WhatsApp antes de pagar — dependemos de disponibilidad del taller.',
  },
  {
    pregunta: '💳 ¿Cómo se paga?',
    respuesta: 'Aceptamos transferencia bancaria (Banco Estado, BCI, Santander) y pago por aplicaciones como MACH o CuentaRUT. El pedido entra a producción una vez confirmado el pago. No trabajamos contra entrega para mantener tiempos de producción eficientes.',
  },
  {
    pregunta: '📐 ¿Qué tallas tienen disponibles?',
    respuesta: 'Trabajamos con tallas S, M, L, XL y 2XL. Todas nuestras camisetas son 100% algodón peinado de 220 g/m², corte recto. Si tienes dudas sobre el tallaje, escríbenos por WhatsApp y te asesoramos según tu cuerpo y preferencia de fit (ajustado vs. holgado).',
  },
  {
    pregunta: '📤 ¿Cómo envío mi diseño?',
    respuesta: 'Tu archivo debe ser PNG a 300 DPI (píxeles por pulgada) con fondo transparente. Puedes enviarlo por WhatsApp directamente o subirlo en el configurador del sitio. No aceptamos imágenes de Google, capturas de pantalla ni JPG de baja resolución — generan estampados borrosos y no los producimos.',
  },
];

// ─────────────────────────────────────────
// COMPONENTES
// ─────────────────────────────────────────

function FAQSection({ accentHex, accentColor }: { accentHex: string; accentColor: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 md:px-16 py-14 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs text-zinc-500 tracking-widest mb-2 uppercase">SOPORTE</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter mb-8 text-white">
          Preguntas <span className={accentColor}>frecuentes</span>
        </h2>

        <div className="space-y-2">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="border border-white/10 overflow-hidden transition-all duration-200"
                style={isOpen ? { borderColor: `${accentHex}40` } : {}}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/5"
                  style={isOpen ? { background: `${accentHex}08` } : {}}
                >
                  <span className="font-mono text-sm font-bold text-white">{faq.pregunta}</span>
                  {isOpen
                    ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: accentHex }} />
                    : <ChevronDown className="w-4 h-4 shrink-0 text-zinc-500" />
                  }
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1">
                    <div className="w-8 h-px mb-3" style={{ background: accentHex }} />
                    <p className="text-sm text-zinc-300 leading-relaxed">{faq.respuesta}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA WhatsApp */}
        <div className="mt-8 p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: `${accentHex}08`, borderColor: `${accentHex}25` }}>
          <div>
            <p className="font-mono text-xs font-bold text-white mb-1">¿Tienes otra consulta?</p>
            <p className="font-mono text-[11px] text-zinc-400">Escríbenos directamente por WhatsApp y te respondemos en minutos.</p>
          </div>
          <a
            href="https://wa.me/56965536529?text=Hola%20VLCN%20Studio%2C%20tengo%20una%20consulta"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 font-mono text-xs font-bold tracking-wide shrink-0 transition-all hover:brightness-110"
            style={{ background: accentHex, color: '#000' }}
          >
            💬 ESCRIBIR POR WHATSAPP
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// CARD DE PRODUCTO
// ─────────────────────────────────────────
function ProductoCard({
  producto,
  accentHex,
  accentColor,
  categoria,
  onAdd,
}: {
  producto: Producto;
  accentHex: string;
  accentColor: string;
  categoria: string;
  onAdd: () => void;
}) {
  const [talla, setTalla] = useState<Talla | null>(null);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!talla || !producto.stock) return;
    cartStore.add({
      id: producto.id,
      titulo: producto.titulo,
      precio: producto.precio,
      talla,
      cantidad: 1,
      categoria,
      accentHex,
      emoji: producto.placeholderEmoji,
    });
    setAdded(true);
    onAdd();
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="group flex flex-col bg-zinc-900 border border-white/5 rounded-none overflow-hidden hover:border-white/20 transition-all duration-200">
      {/* IMAGEN / PLACEHOLDER */}
      <div
        className="relative aspect-square flex items-center justify-center overflow-hidden"
        style={{ background: producto.placeholderBg ?? '#18181b' }}
      >
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.titulo}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="text-7xl leading-none opacity-60 select-none">
              {producto.placeholderEmoji ?? '🖼️'}
            </span>
            <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
              IMAGEN PRÓXIMAMENTE
            </span>
          </div>
        )}

        {/* TAG BADGE */}
        {producto.tag && (
          <span
            className="absolute top-3 left-3 font-mono text-[9px] font-bold tracking-widest px-2 py-1"
            style={{ background: accentHex, color: '#000' }}
          >
            {producto.tag}
          </span>
        )}

        {/* STOCK BADGE */}
        <span className={`absolute top-3 right-3 flex items-center gap-1 font-mono text-[9px] font-bold tracking-wider px-2 py-1 rounded-full backdrop-blur-sm
          ${producto.stock ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/40' : 'bg-zinc-950/80 text-zinc-500 border border-zinc-700/40'}`}>
          {producto.stock
            ? <><CheckCircle2 className="w-2.5 h-2.5" /> STOCK {producto.stockQty ? `(${producto.stockQty})` : ''}</>
            : <><XCircle className="w-2.5 h-2.5" /> AGOTADO</>}
        </span>

        {/* BADGE "AÑADIDO" */}
        {added && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-10 h-10" style={{ color: accentHex }} />
              <span className="font-mono text-xs font-bold text-white">¡AÑADIDO!</span>
            </div>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="font-bold text-sm leading-tight tracking-tight line-clamp-2">
          {producto.titulo}
        </h3>

        <p className="font-mono text-lg font-bold" style={{ color: accentHex }}>
          {formatCLP(producto.precio)}
        </p>

        {/* SELECTOR TALLAS */}
        <div>
          <p className="font-mono text-[10px] text-zinc-500 mb-2 tracking-wider">TALLA</p>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS.map((t) => (
              <button
                key={t}
                onClick={() => setTalla(t === talla ? null : t)}
                disabled={!producto.stock}
                className={`w-9 h-9 font-mono text-xs font-bold border transition-all
                  ${!producto.stock
                    ? 'border-zinc-800 text-zinc-700 cursor-not-allowed'
                    : talla === t
                      ? 'text-black border-transparent'
                      : 'border-zinc-700 text-zinc-300 hover:border-zinc-400'}`}
                style={talla === t && producto.stock ? { background: accentHex, borderColor: accentHex } : {}}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* BOTÓN AGREGAR AL CARRITO */}
        <button
          onClick={handleAdd}
          disabled={!producto.stock || !talla || added}
          className={`mt-auto flex items-center justify-center gap-2 py-3 font-mono text-xs font-bold tracking-wider transition-all
            ${added
              ? 'text-black'
              : producto.stock && talla
                ? 'text-black hover:brightness-90 active:scale-95'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
          style={added
            ? { background: accentHex }
            : producto.stock && talla
              ? { background: accentHex }
              : {}}
        >
          {added
            ? <><CheckCircle2 className="w-3.5 h-3.5" /> AÑADIDO AL CARRITO</>
            : !producto.stock
              ? <><XCircle className="w-3.5 h-3.5" /> AGOTADO</>
              : !talla
                ? <><ShoppingBag className="w-3.5 h-3.5" /> ELIGE UNA TALLA</>
                : <><ShoppingCart className="w-3.5 h-3.5" /> AGREGAR AL CARRITO</>
          }
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────
export default function SubCatalogo() {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const rawCat = pathParts[pathParts.length - 1] as CatId;
  const tema = TEMAS[rawCat] ?? TEMAS.deporte;

  const [cartCount, setCartCount] = useState(() => cartStore.count());
  const [showCartToast, setShowCartToast] = useState(false);
  const [lastAdded, setLastAdded] = useState('');

  const handleAdd = (titulo: string) => {
    const newCount = cartStore.count();
    setCartCount(newCount);
    setLastAdded(titulo);
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 2800);
  };

  return (
    <div className={`min-h-screen ${tema.bgClass} text-white font-sans relative`}>
      {/* DECORACIÓN DE FONDO */}
      {tema.deco}

      {/* TOAST — producto añadido */}
      <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 shadow-2xl transition-all duration-300 max-w-xs
        ${showCartToast ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'}`}
        style={{ background: tema.accentHex, color: '#000' }}>
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wide leading-none">Añadido al carrito</p>
          <p className="font-mono text-[10px] truncate mt-0.5 opacity-70">{lastAdded}</p>
        </div>
      </div>

      {/* HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${tema.headerBg} px-6 py-4 flex items-center justify-between`}>
        <button
          onClick={() => navTo('categorias')}
          className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          CATEGORÍAS
        </button>
        <div className="flex items-center gap-3">
          <img src={`${BASE}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-7 w-auto object-contain opacity-90" />
          <span className="font-bold tracking-tighter text-lg">VLCN STUDIO</span>
        </div>

        {/* CARRITO */}
        <button
          onClick={() => navTo('configurador')}
          className="relative flex items-center gap-2 font-mono text-xs transition-colors hover:text-white"
          style={{ color: cartCount > 0 ? tema.accentHex : '#71717a' }}
          title="Ver carrito en el configurador"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden md:inline">CARRITO</span>
          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-black"
              style={{ background: tema.accentHex }}
            >
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>
      </header>

      {/* HERO DE SECCIÓN */}
      <div className="relative px-6 md:px-16 py-10 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <p className="font-mono text-xs text-zinc-500 tracking-widest mb-2">
              CATEGORÍA / {tema.label}
            </p>
            <h1 className={`text-4xl md:text-6xl font-bold tracking-tighter mb-3 ${tema.accentColor}`}>
              {tema.label}
            </h1>
            <p className="font-mono text-xs text-zinc-500 tracking-widest">{tema.tagline}</p>
          </div>
          <button
            onClick={() => navTo('categorias')}
            className="flex items-center gap-2 border border-white/15 px-5 py-2.5 font-mono text-xs font-bold tracking-wider text-zinc-300 hover:bg-white/10 hover:text-white transition-all w-fit shrink-0 mt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            VOLVER A CATEGORÍAS
          </button>
        </div>

        {/* CITAS — solo Películas & Series */}
        {tema.citas && tema.citas.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px border border-amber-500/15">
            {tema.citas.map((c, i) => (
              <blockquote
                key={i}
                className="flex flex-col justify-between gap-3 p-6 border-amber-500/15 bg-amber-500/[0.03]"
                style={{ borderRight: i === 0 ? '1px solid rgba(245,158,11,0.15)' : 'none' }}
              >
                <p className="text-amber-100/80 text-xl md:text-2xl italic leading-snug font-serif">
                  {c.texto}
                </p>
                <cite className="font-mono text-xs text-amber-500/60 not-italic tracking-widest">
                  — {c.autor}
                </cite>
              </blockquote>
            ))}
          </div>
        )}

        {/* DEPORTE — trofeo decorativo */}
        {rawCat === 'deporte' && (
          <div className="mt-6 flex items-center gap-6 flex-wrap">
            {['⚽', '🏀', '🏆', '🥊', '🎾', '🏋️'].map((e, i) => (
              <span key={i} className="text-2xl opacity-40 select-none">{e}</span>
            ))}
          </div>
        )}

        {/* ARTISTAS — notas musicales */}
        {rawCat === 'artistas' && (
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            {['🎵', '🎸', '🎤', '🎧', '💿', '🎶'].map((e, i) => (
              <span key={i} className="text-2xl opacity-40 select-none">{e}</span>
            ))}
            <Star className="w-5 h-5 text-fuchsia-500/40" />
          </div>
        )}
      </div>

      {/* GRID DE PRODUCTOS */}
      <main className="relative px-4 md:px-16 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {tema.productos.map((prod) => (
            <ProductoCard
              key={prod.id}
              producto={prod}
              accentHex={tema.accentHex}
              accentColor={tema.accentColor}
              categoria={rawCat}
              onAdd={() => handleAdd(prod.titulo)}
            />
          ))}
        </div>

        {/* BANNER IR AL CONFIGURADOR (si hay items en el carrito) */}
        {cartCount > 0 && (
          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border"
            style={{ borderColor: `${tema.accentHex}30`, background: `${tema.accentHex}08` }}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 shrink-0" style={{ color: tema.accentHex }} />
              <div>
                <p className="font-mono text-sm font-bold text-white">
                  {cartCount} {cartCount === 1 ? 'producto' : 'productos'} en tu carrito
                </p>
                <p className="font-mono text-[11px] text-zinc-400 mt-0.5">
                  Ve al configurador para ver el resumen completo y finalizar tu pedido
                </p>
              </div>
            </div>
            <button
              onClick={() => navTo('configurador')}
              className="flex items-center gap-2 px-5 py-3 font-mono text-xs font-bold tracking-wide shrink-0 transition-all hover:brightness-110"
              style={{ background: tema.accentHex, color: '#000' }}
            >
              IR AL CONFIGURADOR →
            </button>
          </div>
        )}
      </main>

      {/* PREGUNTAS FRECUENTES */}
      <FAQSection accentHex={tema.accentHex} accentColor={tema.accentColor} />

      {/* FOOTER STRIP */}
      <footer className="px-6 md:px-16 py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-zinc-600 tracking-widest text-center md:text-left">
          TODAS LAS PRENDAS SON CAMISETA MANGA CORTA 100% ALGODÓN · ESTAMPADO INDUSTRIAL
        </p>
        <button
          onClick={() => navTo('categorias')}
          className="flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          VOLVER A CATEGORÍAS
        </button>
      </footer>
    </div>
  );
}
