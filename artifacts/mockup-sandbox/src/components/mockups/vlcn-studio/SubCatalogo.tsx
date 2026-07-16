import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag, CheckCircle2, XCircle, ShoppingCart, X } from 'lucide-react';
import { cartStore } from './cartStore';
import { navTo } from './navigate';
import Footer from './Footer';

const BASE = import.meta.env.BASE_URL;
const TALLAS = ['S', 'M', 'L', 'XL', '2XL'] as const;
type Talla = typeof TALLAS[number];

const formatCLP = (n: number) => '$' + n.toLocaleString('es-CL') + ' CLP';

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

const CATALOGO_DEPORTE: Producto[] = [
  { id: 'd1', titulo: 'Copa del Mundo Qatar 2022', precio: 15000, stock: true,  stockQty: 8,  placeholderBg: '#052e16', placeholderEmoji: '🏆', tag: 'NUEVO' },
  { id: 'd2', titulo: 'Lionel Messi — La Pulga',   precio: 15000, stock: true,  stockQty: 5,  placeholderBg: '#0c1a3a', placeholderEmoji: '⚽', tag: 'TOP' },
  { id: 'd3', titulo: 'Cristiano Ronaldo — CR7',   precio: 15000, stock: true,  stockQty: 3,  placeholderBg: '#1a0a00', placeholderEmoji: '🔥' },
  { id: 'd4', titulo: 'Michael Jordan — Bulls 23', precio: 15000, stock: true,  stockQty: 6,  placeholderBg: '#1a0000', placeholderEmoji: '🏀', tag: 'TOP' },
  { id: 'd5', titulo: 'Neymar Jr — NJR',           precio: 15000, stock: false,              placeholderBg: '#0f1f0f', placeholderEmoji: '⚡' },
  { id: 'd6', titulo: 'UFC — Fight Night',         precio: 15000, stock: true,  stockQty: 4,  placeholderBg: '#1a1a00', placeholderEmoji: '🥊' },
  { id: 'd7', titulo: 'Selección Chilena — La Roja', precio: 15000, stock: true, stockQty: 10, placeholderBg: '#2d0000', placeholderEmoji: '🇨🇱', tag: 'POPULAR' },
  { id: 'd8', titulo: 'NBA — All-Star',            precio: 15000, stock: true,  stockQty: 2,  placeholderBg: '#0a0a2e', placeholderEmoji: '🌟' },
];

const CATALOGO_ARTISTAS: Producto[] = [
  { id: 'a1', titulo: 'Billie Eilish — Happier Than Ever', precio: 15000, stock: true, stockQty: 7, placeholderBg: '#1a0033', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784044291/davinci__img1_ahora_usando_un_modelo_de_referencia_sobre_u_rzpo85.png', tag: 'TOP' },
  { id: 'a2', titulo: 'The Weeknd',                   precio: 15000, stock: true,  stockQty: 5,  placeholderBg: '#1a0008', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784043224/ChatGPT_Image_14_jul_2026_11_32_37_a.m_eev1or.png', tag: 'POPULAR' },
  { id: 'a3', titulo: 'Sabrina Carpenter',             precio: 15000, stock: true,  stockQty: 4,  placeholderBg: '#1a0d00', placeholderEmoji: '🎤', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784217377/ChatGPT_Image_16_jul_2026_11_55_54_a.m_m8dwcc.png' },
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

type CatId = 'deporte' | 'artistas' | 'peliculas';

const TEMAS: Record<CatId, {
  label: string;
  accentHex: string;
  bgClass: string;
  headerBg: string;
  productos: Producto[];
  tagline: string;
}> = {
  deporte:   { label: 'DEPORTE',           accentHex: '#10b981', bgClass: 'bg-zinc-950', headerBg: 'bg-zinc-950/90 border-emerald-900/30', productos: CATALOGO_DEPORTE,   tagline: 'Fútbol · Básquet · UFC · Selecciones' },
  artistas:  { label: 'ARTISTAS',          accentHex: '#e879f9', bgClass: 'bg-zinc-950', headerBg: 'bg-zinc-950/90 border-fuchsia-900/30', productos: CATALOGO_ARTISTAS,  tagline: 'Urban · Reggaetón · Pop · Rock' },
  peliculas: { label: 'PELÍCULAS & SERIES', accentHex: '#fbbf24', bgClass: 'bg-zinc-950', headerBg: 'bg-zinc-950/90 border-amber-900/30',   productos: CATALOGO_PELICULAS, tagline: 'Culto · Acción · Drama · Sci-Fi' },
};

function ProductoCard({ producto, accentHex, categoria, onAdd }: {
  producto: Producto;
  accentHex: string;
  categoria: string;
  onAdd: () => void;
}) {
  const [talla, setTalla] = useState<Talla | null>(null);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!talla || !producto.stock) return;
    cartStore.add({ id: producto.id, titulo: producto.titulo, precio: producto.precio, talla, cantidad: 1, categoria, accentHex, emoji: producto.placeholderEmoji });
    setAdded(true);
    onAdd();
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="group flex flex-col bg-zinc-900 border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-200">
      {/* IMAGEN */}
      <div className="relative aspect-square flex items-center justify-center overflow-hidden" style={{ background: producto.placeholderBg ?? '#18181b' }}>
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.titulo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <span className="text-7xl leading-none opacity-50 select-none">{producto.placeholderEmoji ?? '🖼️'}</span>
        )}

        {producto.tag && (
          <span className="absolute top-3 left-3 font-mono text-[9px] font-bold tracking-widest px-2 py-1" style={{ background: accentHex, color: '#000' }}>
            {producto.tag}
          </span>
        )}

        <span className={`absolute top-3 right-3 flex items-center gap-1 font-mono text-[9px] font-bold px-2 py-1 rounded-full backdrop-blur-sm
          ${producto.stock ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/40' : 'bg-zinc-950/80 text-zinc-500 border border-zinc-700/40'}`}>
          {producto.stock ? <><CheckCircle2 className="w-2.5 h-2.5" /> STOCK</> : <><XCircle className="w-2.5 h-2.5" /> AGOTADO</>}
        </span>

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
        <h3 className="font-bold text-sm leading-tight tracking-tight line-clamp-2">{producto.titulo}</h3>
        <p className="font-mono text-lg font-bold" style={{ color: accentHex }}>{formatCLP(producto.precio)}</p>

        <div>
          <p className="font-mono text-[10px] text-zinc-500 mb-2 tracking-wider">TALLA</p>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS.map((t) => (
              <button
                key={t}
                onClick={() => setTalla(t === talla ? null : t)}
                disabled={!producto.stock}
                className={`w-9 h-9 font-mono text-xs font-bold border transition-all
                  ${!producto.stock ? 'border-zinc-800 text-zinc-700 cursor-not-allowed'
                    : talla === t ? 'text-black border-transparent'
                    : 'border-zinc-700 text-zinc-300 hover:border-zinc-400'}`}
                style={talla === t && producto.stock ? { background: accentHex, borderColor: accentHex } : {}}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!producto.stock || !talla || added}
          className={`mt-auto flex items-center justify-center gap-2 py-3 font-mono text-xs font-bold tracking-wider transition-all
            ${added ? 'text-black' : producto.stock && talla ? 'text-black hover:brightness-90 active:scale-95' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
          style={added ? { background: accentHex } : producto.stock && talla ? { background: accentHex } : {}}
        >
          {added ? <><CheckCircle2 className="w-3.5 h-3.5" /> AÑADIDO</>
            : !producto.stock ? <><XCircle className="w-3.5 h-3.5" /> AGOTADO</>
            : !talla ? <><ShoppingBag className="w-3.5 h-3.5" /> ELIGE TALLA</>
            : <><ShoppingCart className="w-3.5 h-3.5" /> AGREGAR</>}
        </button>
      </div>
    </div>
  );
}

export default function SubCatalogo() {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const rawCat = pathParts[pathParts.length - 1] as CatId;
  const tema = TEMAS[rawCat] ?? TEMAS.deporte;

  const [cartCount, setCartCount] = useState(() => cartStore.count());
  const [showCartToast, setShowCartToast] = useState(false);
  const [lastAdded, setLastAdded] = useState('');

  const handleAdd = (titulo: string) => {
    setCartCount(cartStore.count());
    setLastAdded(titulo);
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 2800);
  };

  return (
    <div className={`min-h-screen ${tema.bgClass} text-white font-sans flex flex-col`}>

      {/* TOAST */}
      <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 shadow-2xl transition-all duration-300 max-w-xs
        ${showCartToast ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'}`}
        style={{ background: tema.accentHex, color: '#000' }}>
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <p className="font-mono text-[10px] font-bold truncate">{lastAdded}</p>
      </div>

      {/* HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${tema.headerBg} px-6 py-4 flex items-center justify-between`}>
        <button onClick={() => navTo('categorias')} className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> CATEGORÍAS
        </button>
        <div className="flex items-center gap-3">
          <img src={`${BASE}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-7 w-auto object-contain opacity-90" />
          <span className="font-bold tracking-tighter text-lg">VLCN STUDIO</span>
        </div>
        <button
          onClick={() => navTo('configurador')}
          className="relative flex items-center gap-2 font-mono text-xs transition-colors hover:text-white"
          style={{ color: cartCount > 0 ? tema.accentHex : '#71717a' }}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden md:inline">CARRITO</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-black" style={{ background: tema.accentHex }}>
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>
      </header>

      {/* HERO */}
      <div className="px-6 md:px-16 py-8 border-b border-white/5">
        <p className="font-mono text-xs text-zinc-500 tracking-widest mb-2">{tema.tagline}</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter" style={{ color: tema.accentHex }}>
          {tema.label}
        </h1>
      </div>

      {/* GRID */}
      <main className="flex-1 px-4 md:px-16 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {tema.productos.map((prod) => (
            <ProductoCard
              key={prod.id}
              producto={prod}
              accentHex={tema.accentHex}
              categoria={rawCat}
              onAdd={() => handleAdd(prod.titulo)}
            />
          ))}
        </div>
      </main>

      <Footer />

      {/* STICKY SEGUIR BAR — siempre visible */}
      <div className="sticky bottom-0 z-40 border-t border-white/10 px-6 py-4 flex items-center justify-between gap-4"
        style={{ background: 'rgba(9,9,11,0.97)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 shrink-0" style={{ color: cartCount > 0 ? tema.accentHex : '#52525b' }} />
          {cartCount > 0 ? (
            <p className="font-mono text-sm text-white">
              <span className="font-bold" style={{ color: tema.accentHex }}>{cartCount}</span> {cartCount === 1 ? 'producto' : 'productos'} seleccionado{cartCount > 1 ? 's' : ''}
            </p>
          ) : (
            <p className="font-mono text-xs text-zinc-500">Elige una talla y agrega al carrito para continuar</p>
          )}
        </div>
        <button
          onClick={() => navTo('configurador')}
          className="flex items-center gap-2 px-6 py-3 font-mono text-sm font-bold tracking-wide shrink-0 transition-all hover:brightness-110 hover:scale-105 active:scale-95"
          style={cartCount > 0 ? { background: tema.accentHex, color: '#000' } : { background: '#27272a', color: '#71717a' }}
        >
          SEGUIR <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
