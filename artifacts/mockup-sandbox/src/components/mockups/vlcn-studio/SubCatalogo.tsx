import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, CheckCircle2, XCircle, Star } from 'lucide-react';

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
  /** URL de imagen — reemplaza con tus propios diseños */
  imagen?: string;
  /** Color de fondo del placeholder cuando no hay imagen */
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
  { id: 'a1', titulo: 'Bad Bunny — Un Verano Sin Ti', precio: 15000, stock: true,  stockQty: 7,  placeholderBg: '#1a0033', placeholderEmoji: '🐰', tag: 'TOP' },
  { id: 'a2', titulo: 'The Weeknd — Starboy',         precio: 15000, stock: true,  stockQty: 5,  placeholderBg: '#1a0008', placeholderEmoji: '⭐', tag: 'POPULAR' },
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
        {/* neon glow lines */}
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
      { texto: '"Yo le hice una oferta que no pudo rechazar."', autor: 'El Padrino, 1972' },
      { texto: '"Soy quien llama a la puerta."', autor: 'Breaking Bad' },
      { texto: '"¿Por qué tan serio?"', autor: 'The Dark Knight, 2008' },
    ],
  },
};

// ─────────────────────────────────────────
// CARD DE PRODUCTO
// ─────────────────────────────────────────
function ProductoCard({
  producto,
  accentHex,
  accentColor,
}: {
  producto: Producto;
  accentHex: string;
  accentColor: string;
}) {
  const [talla, setTalla] = useState<Talla | null>(null);

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
          /* ── PLACEHOLDER — reemplaza `imagen` en el array de productos ── */
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

        {/* BOTÓN */}
        <button
          disabled={!producto.stock || !talla}
          className={`mt-auto flex items-center justify-center gap-2 py-3 font-mono text-xs font-bold tracking-wider transition-all
            ${producto.stock && talla
              ? 'text-black hover:brightness-90'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
          style={producto.stock && talla ? { background: accentHex } : {}}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {!producto.stock ? 'AGOTADO' : !talla ? 'ELIGE UNA TALLA' : 'AGREGAR AL PEDIDO'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────
export default function SubCatalogo() {
  // Detecta la categoría desde la URL: /categorias/deporte → 'deporte'
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const rawCat = pathParts[pathParts.length - 1] as CatId;
  const tema = TEMAS[rawCat] ?? TEMAS.deporte;

  return (
    <div className={`min-h-screen ${tema.bgClass} text-white font-sans relative`}>
      {/* DECORACIÓN DE FONDO */}
      {tema.deco}

      {/* HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${tema.headerBg} px-6 py-4 flex items-center justify-between`}>
        <button
          onClick={() => { window.location.href = `${BASE}categorias`; }}
          className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          CATEGORÍAS
        </button>
        <div className="flex items-center gap-3">
          <img src={`${BASE}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-7 w-auto object-contain opacity-90" />
          <span className="font-bold tracking-tighter text-lg">VLCN STUDIO</span>
        </div>
        <span className={`hidden md:block font-mono text-xs ${tema.accentColor}`}>
          {tema.tagline}
        </span>
      </header>

      {/* HERO DE SECCIÓN */}
      <div className="relative px-6 md:px-16 py-10 border-b border-white/5">
        <p className="font-mono text-xs text-zinc-500 tracking-widest mb-2">
          CATEGORÍA / {tema.label}
        </p>
        <h1 className={`text-4xl md:text-6xl font-bold tracking-tighter mb-3 ${tema.accentColor}`}>
          {tema.label}
        </h1>
        <p className="font-mono text-xs text-zinc-500 tracking-widest">{tema.tagline}</p>

        {/* CITAS — solo Películas & Series */}
        {tema.citas && tema.citas.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4">
            {tema.citas.map((c, i) => (
              <blockquote
                key={i}
                className="border-l-2 border-amber-500/40 pl-3 max-w-xs"
              >
                <p className="text-amber-200/70 text-xs italic leading-relaxed">{c.texto}</p>
                <cite className="font-mono text-[10px] text-zinc-600 not-italic">— {c.autor}</cite>
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
            />
          ))}
        </div>
      </main>

      {/* FOOTER STRIP */}
      <footer className="px-6 md:px-16 py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-zinc-600 tracking-widest text-center md:text-left">
          TODAS LAS PRENDAS SON CAMISETA MANGA CORTA 100% ALGODÓN · ESTAMPADO INDUSTRIAL
        </p>
        <button
          onClick={() => { window.location.href = `${BASE}categorias`; }}
          className="flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          VOLVER A CATEGORÍAS
        </button>
      </footer>
    </div>
  );
}
