import React, { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag, CheckCircle2, XCircle, ShoppingCart, X, Trash2 } from 'lucide-react';
import { cartStore, type CartItem } from './cartStore';
import { catalogStore } from './catalogStore';
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
  { id: 'd1', titulo: 'Erling Haaland',             precio: 15000, stock: true,  stockQty: 8,  placeholderBg: '#052e16', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784385177/ChatGPT_Image_17_jul_2026_09_38_44_p_tjdjaw.jpg', tag: 'NUEVO' },
  { id: 'd2', titulo: 'Neymar Jr.',                precio: 15000, stock: true,  stockQty: 5,  placeholderBg: '#0c1a3a', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784384778/ChatGPT_Image_17_jul_2026_09_45_01_p.m_z1tfkz.png', tag: 'TOP' },
  { id: 'd3', titulo: 'Kylian Mbappé',             precio: 15000, stock: true,  stockQty: 3,  placeholderBg: '#1a0a00', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784384778/ChatGPT_Image_17_jul_2026_09_41_32_p.m_bau5u5.png' },
  { id: 'd4', titulo: 'Lamine Yamal',               precio: 15000, stock: true,  stockQty: 6,  placeholderBg: '#1a0000', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784388440/ChatGPT_Image_18_jul_2026_11_20_29_a.m_hqletx.png', tag: 'TOP' },
  { id: 'd5', titulo: 'Neymar Jr — NJR',           precio: 15000, stock: false,              placeholderBg: '#0f1f0f', placeholderEmoji: '⚡' },
  { id: 'd6', titulo: 'UFC — Fight Night',         precio: 15000, stock: true,  stockQty: 4,  placeholderBg: '#1a1a00', placeholderEmoji: '🥊' },
  { id: 'd7', titulo: 'Selección Chilena — La Roja', precio: 15000, stock: true, stockQty: 10, placeholderBg: '#2d0000', placeholderEmoji: '🇨🇱', tag: 'POPULAR' },
  { id: 'd8', titulo: 'NBA — All-Star',            precio: 15000, stock: true,  stockQty: 2,  placeholderBg: '#0a0a2e', placeholderEmoji: '🌟' },
];

const CATALOGO_ARTISTAS: Producto[] = [
  { id: 'a1', titulo: 'Billie Eilish — Happier Than Ever', precio: 15000, stock: true, stockQty: 7, placeholderBg: '#1a0033', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784044291/davinci__img1_ahora_usando_un_modelo_de_referencia_sobre_u_rzpo85.png', tag: 'TOP' },
  { id: 'a2', titulo: 'The Weeknd',                   precio: 15000, stock: true,  stockQty: 5,  placeholderBg: '#1a0008', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784384778/ChatGPT_Image_17_jul_2026_09_50_54_p.m_rzeqbr.png', tag: 'POPULAR' },
  { id: 'a3', titulo: 'Sabrina Carpenter',             precio: 15000, stock: true,  stockQty: 4,  placeholderBg: '#1a0d00', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784384779/ChatGPT_Image_17_jul_2026_09_30_55_p.m_gu4ywu.png' },
  { id: 'a4', titulo: 'Kendrick Lamar',                precio: 15000, stock: true,  stockQty: 5,  placeholderBg: '#000d1a', imagen: 'https://res.cloudinary.com/sldw6h5x/image/upload/v1784384781/ChatGPT_Image_17_jul_2026_09_46_41_p.m_hzweru.png' },
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

/* ─── Cart Modal ─── */
function CartModal({ items, accentHex, onClose, onRemove }: {
  items: CartItem[];
  accentHex: string;
  onClose: () => void;
  onRemove: (id: string, talla: string) => void;
}) {
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalUnits = items.reduce((s, i) => s + i.cantidad, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full sm:w-[420px] h-[90vh] sm:h-screen flex flex-col shadow-2xl"
        style={{ background: '#0f0f13', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5" style={{ color: accentHex }} />
            <span className="font-mono text-sm font-bold tracking-wider text-white">CARRITO</span>
            {totalUnits > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-black" style={{ background: accentHex }}>
                {totalUnits}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-600">
              <ShoppingBag className="w-12 h-12" />
              <p className="font-mono text-xs tracking-widest">CARRITO VACÍO</p>
              <p className="text-zinc-700 text-sm">Agrega prendas para continuar</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {items.map((item) => (
                <li key={`${item.id}-${item.talla}`} className="flex items-center gap-3 px-5 py-4">
                  {/* Thumbnail */}
                  <div
                    className="w-14 h-14 shrink-0 rounded overflow-hidden flex items-center justify-center text-2xl"
                    style={{ background: '#1c1c22' }}
                  >
                    {item.imagen ? (
                      <img src={item.imagen} alt={item.titulo} className="w-full h-full object-cover" />
                    ) : (
                      <span className="leading-none">{item.emoji ?? '🖼️'}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white leading-tight line-clamp-1">{item.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-white/15 text-white/60">
                        {item.talla}
                      </span>
                      <span className="font-mono text-[10px] text-white/40">×{item.cantidad}</span>
                    </div>
                    <p className="font-mono text-xs font-bold mt-1" style={{ color: accentHex }}>
                      {formatCLP(item.precio * item.cantidad)}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemove(item.id, item.talla)}
                    className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 px-5 py-5 space-y-4">
          {items.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-400 tracking-wider">TOTAL</span>
              <span className="font-mono text-xl font-bold text-white">{formatCLP(total)}</span>
            </div>
          )}
          <button
            onClick={() => {
              if (items.length > 0 && items[0].imagen) {
                catalogStore.set({ id: items[0].id, titulo: items[0].titulo, imagen: items[0].imagen, precio: items[0].precio });
              } else {
                catalogStore.clear();
              }
              onClose(); navTo('configurador');
            }}
            disabled={items.length === 0}
            className="w-full flex items-center justify-center gap-3 py-4 font-mono text-sm font-bold tracking-widest transition-all hover:brightness-110 active:scale-98 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: items.length > 0 ? accentHex : '#27272a', color: items.length > 0 ? '#000' : '#71717a' }}
          >
            AVANZAR <ArrowRight className="w-4 h-4" />
          </button>
          {items.length === 0 && (
            <p className="text-zinc-600 text-xs font-mono text-center">Agrega al menos 1 prenda para avanzar</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Producto Card ─── */
function ProductoCard({ producto, accentHex, categoria, productCartCount, onAdd }: {
  producto: Producto;
  accentHex: string;
  categoria: string;
  productCartCount: number;
  onAdd: () => void;
}) {
  const [talla, setTalla] = useState<Talla | null>(null);
  const [flash, setFlash] = useState(false);
  const atLimit = productCartCount >= 5;

  const handleAdd = () => {
    if (!talla || !producto.stock || atLimit) return;
    const result = cartStore.add({
      id: producto.id,
      titulo: producto.titulo,
      precio: producto.precio,
      talla,
      cantidad: 1,
      categoria,
      accentHex,
      emoji: producto.placeholderEmoji,
      imagen: producto.imagen,
    });
    if (result === 'ok') {
      setFlash(true);
      setTalla(null); // reset talla so user can pick another
      onAdd();
      setTimeout(() => setFlash(false), 1200);
    }
  };

  const btnLabel = () => {
    if (!producto.stock) return <><XCircle className="w-3.5 h-3.5" /> AGOTADO</>;
    if (atLimit) return <><CheckCircle2 className="w-3.5 h-3.5" /> LÍMITE (5)</>;
    if (flash) return <><CheckCircle2 className="w-3.5 h-3.5" /> ¡AÑADIDO!</>;
    if (!talla) return <><ShoppingBag className="w-3.5 h-3.5" /> ELIGE TALLA</>;
    return <><ShoppingCart className="w-3.5 h-3.5" /> AGREGAR</>;
  };

  const btnDisabled = !producto.stock || !talla || atLimit || flash;

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

        {/* Cart badge */}
        {productCartCount > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-sm"
            style={{ background: `${accentHex}dd` }}>
            <ShoppingCart className="w-3 h-3 text-black" />
            <span className="font-mono text-[10px] font-bold text-black">{productCartCount}</span>
          </div>
        )}

        {/* Flash overlay */}
        {flash && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none">
            <CheckCircle2 className="w-10 h-10" style={{ color: accentHex }} />
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="font-bold text-sm leading-tight tracking-tight line-clamp-2">{producto.titulo}</h3>
        <p className="font-mono text-lg font-bold" style={{ color: accentHex }}>{formatCLP(producto.precio)}</p>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[10px] text-zinc-500 tracking-wider">TALLA</p>
            {atLimit && <p className="font-mono text-[10px] tracking-wider" style={{ color: accentHex }}>MÁX. 5 PRENDAS</p>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TALLAS.map((t) => (
              <button
                key={t}
                onClick={() => !atLimit && setTalla(t === talla ? null : t)}
                disabled={!producto.stock || atLimit}
                className={`w-9 h-9 font-mono text-xs font-bold border transition-all
                  ${!producto.stock || atLimit ? 'border-zinc-800 text-zinc-700 cursor-not-allowed'
                    : talla === t ? 'text-black border-transparent'
                    : 'border-zinc-700 text-zinc-300 hover:border-zinc-400'}`}
                style={talla === t && producto.stock && !atLimit ? { background: accentHex, borderColor: accentHex } : {}}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={btnDisabled}
          className={`mt-auto flex items-center justify-center gap-2 py-3 font-mono text-xs font-bold tracking-wider transition-all
            ${btnDisabled ? 'cursor-not-allowed' : 'hover:brightness-90 active:scale-95'}`}
          style={{
            background: flash ? accentHex
              : (producto.stock && talla && !atLimit) ? accentHex
              : '#27272a',
            color: (flash || (producto.stock && talla && !atLimit)) ? '#000' : '#71717a',
          }}
        >
          {btnLabel()}
        </button>
      </div>
    </div>
  );
}

/* ─── SubCatalogo ─── */
export default function SubCatalogo() {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const rawCat = pathParts[pathParts.length - 1] as CatId;
  const tema = TEMAS[rawCat] ?? TEMAS.deporte;

  const [cartItems, setCartItems] = useState<CartItem[]>(() => cartStore.get());
  const [showCart, setShowCart] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const refreshCart = useCallback(() => {
    setCartItems(cartStore.get());
  }, []);

  const handleAdd = (titulo: string) => {
    refreshCart();
    setToastMsg(titulo);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const handleRemove = (id: string, talla: string) => {
    cartStore.remove(id, talla);
    refreshCart();
  };

  const cartCount = cartItems.reduce((s, i) => s + i.cantidad, 0);

  return (
    <div className={`min-h-screen ${tema.bgClass} text-white font-sans flex flex-col`}>

      {/* TOAST */}
      <div className={`fixed top-20 right-4 z-[60] flex items-center gap-3 px-4 py-3 shadow-2xl transition-all duration-300 max-w-xs
        ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'}`}
        style={{ background: tema.accentHex, color: '#000' }}>
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <p className="font-mono text-[10px] font-bold truncate">{toastMsg} — añadido</p>
      </div>

      {/* CART MODAL */}
      {showCart && (
        <CartModal
          items={cartItems}
          accentHex={tema.accentHex}
          onClose={() => setShowCart(false)}
          onRemove={handleRemove}
        />
      )}

      {/* HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${tema.headerBg} px-6 py-4 flex items-center justify-between`}>
        <button onClick={() => navTo('categorias')} className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> CATEGORÍAS
        </button>
        <div className="flex items-center gap-3">
          <img src={`${BASE}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-7 w-auto object-contain invert" />
          <span className="font-bold tracking-tighter text-lg">VLCN STUDIO</span>
        </div>
        <button
          onClick={() => setShowCart(true)}
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
              productCartCount={cartItems.filter(i => i.id === prod.id).reduce((s, i) => s + i.cantidad, 0)}
              onAdd={() => handleAdd(prod.titulo)}
            />
          ))}
        </div>
      </main>

      <Footer />

      {/* STICKY BAR */}
      <div className="sticky bottom-0 z-40 border-t border-white/10 px-6 py-4 flex items-center justify-between gap-4"
        style={{ background: 'rgba(9,9,11,0.97)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 shrink-0" style={{ color: cartCount > 0 ? tema.accentHex : '#52525b' }} />
          {cartCount > 0 ? (
            <button
              onClick={() => setShowCart(true)}
              className="font-mono text-sm hover:underline transition-all text-left"
            >
              <span className="font-bold" style={{ color: tema.accentHex }}>{cartCount}</span>
              <span className="text-white"> {cartCount === 1 ? 'prenda' : 'prendas'} · ver resumen</span>
            </button>
          ) : (
            <p className="font-mono text-xs text-zinc-500">Elige una talla y agrega al carrito para continuar</p>
          )}
        </div>
        <button
          onClick={() => cartCount > 0 ? setShowCart(true) : undefined}
          disabled={cartCount === 0}
          className="flex items-center gap-2 px-6 py-3 font-mono text-sm font-bold tracking-wide shrink-0 transition-all hover:brightness-110 hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
          style={cartCount > 0 ? { background: tema.accentHex, color: '#000' } : { background: '#27272a', color: '#71717a' }}
        >
          SEGUIR <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
