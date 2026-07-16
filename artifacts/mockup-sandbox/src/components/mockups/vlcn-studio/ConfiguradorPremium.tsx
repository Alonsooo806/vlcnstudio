import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Ruler, Plus, Minus, MapPin, ShieldCheck, Upload, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { navTo } from './navigate';
import Footer from './Footer';

// ─── DATA ────────────────────────────────────────────────────────────
const COLORS = [
  { id: 'blanco',   name: 'Blanco',   hex: '#FFFFFF' },
  { id: 'negro',    name: 'Negro',    hex: '#000000' },
  { id: 'rojo',     name: 'Rojo',     hex: '#DC2626' },
  { id: 'naranjo',  name: 'Naranjo',  hex: '#F97316' },
  { id: 'amarillo', name: 'Amarillo', hex: '#EAB308' },
  { id: 'verde',    name: 'Verde',    hex: '#16A34A' },
  { id: 'azul',     name: 'Azul',     hex: '#2563EB' },
  { id: 'violeta',  name: 'Violeta',  hex: '#7C3AED' },
];

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

const SCALE: Record<string, { w: number; h: number; a3?: boolean }> = {
  S:    { w: 25, h: 35 },
  M:    { w: 28, h: 38 },
  L:    { w: 30, h: 40 },
  XL:   { w: 32, h: 42, a3: true },
  '2XL':{ w: 35, h: 45, a3: true },
};

const PLACEMENTS = [
  { id: 'pecho',   name: 'Pecho',   price: 10000, desc: 'Frontal centrado' },
  { id: 'espalda', name: 'Espalda', price: 3500,  desc: 'Dorsal gran formato' },
  { id: 'manga',   name: 'Manga',   price: 1500,  desc: 'Lateral manga derecha' },
];

const BASE_PRICE   = 5000;
const DELIVERY_FEE = 2000;
const WA_NUMBER    = '56965536529';

const fmt = (n: number) =>
  '$' + n.toLocaleString('es-CL');

// ─── COLORIZE ────────────────────────────────────────────────────────
const SHIRT_SRC = 'generated_images/vlcn-shirt-blanco.png';
const cache     = new Map<string, string>();

// Convert RGB [0..1] → [h 0..1, s 0..1, l 0..1]
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = 0;
  if (mx === r)      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (mx === g) h = ((b - r) / d + 2) / 6;
  else               h = ((r - g) / d + 4) / 6;
  return [h, s, l];
}

// Convert [h 0..1, s 0..1, l 0..1] → RGB [0..255]
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  return [
    Math.round(hue2rgb(h + 1/3) * 255),
    Math.round(hue2rgb(h)       * 255),
    Math.round(hue2rgb(h - 1/3) * 255),
  ];
}

async function colorize(hex: string): Promise<string> {
  if (cache.has(hex)) return cache.get(hex)!;
  return new Promise(resolve => {
    const img = new window.Image();
    img.onload = () => {
      const cvs = document.createElement('canvas');
      cvs.width = img.naturalWidth; cvs.height = img.naturalHeight;
      const ctx = cvs.getContext('2d', { willReadFrequently: true });
      if (!ctx) { resolve(SHIRT_SRC); return; }
      ctx.drawImage(img, 0, 0);

      // White shirt → return as-is (base template)
      if (hex === '#FFFFFF') {
        const u = cvs.toDataURL('image/png'); cache.set(hex, u); resolve(u); return;
      }

      // Parse target color → HSL
      const tr = parseInt(hex.slice(1,3),16)/255;
      const tg = parseInt(hex.slice(3,5),16)/255;
      const tb = parseInt(hex.slice(5,7),16)/255;
      const [tH, tS] = rgbToHsl(tr, tg, tb);

      const id = ctx.getImageData(0, 0, cvs.width, cvs.height);
      const px = id.data;

      for (let i = 0; i < px.length; i += 4) {
        if (px[i+3] < 10) continue;                         // transparent → skip

        const r = px[i]/255, g = px[i+1]/255, b = px[i+2]/255;
        const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
        const pixSat = mx === 0 ? 0 : (mx - mn) / mx;

        // Only recolor near-achromatic (fabric) pixels — skip any coloured detail
        if (pixSat < 0.32) {
          const [,, L] = rgbToHsl(r, g, b);
          // Skip dark background — only colorize shirt fabric (light areas)
          if (L < 0.22) continue;
          // Keep full saturation across the shirt body;
          // only taper to white at the very brightest highlights (L > 0.88)
          const highlightFade = L > 0.88 ? Math.max(0, (1 - L) / 0.12) : 1.0;
          const effectiveSat = tS * highlightFade;
          const [nr, ng2, nb2] = hslToRgb(tH, effectiveSat, L);
          px[i] = nr; px[i+1] = ng2; px[i+2] = nb2;
        }
      }

      ctx.putImageData(id, 0, 0);
      const u = cvs.toDataURL('image/png'); cache.set(hex, u); resolve(u);
    };
    img.onerror = () => resolve(SHIRT_SRC);
    img.src = SHIRT_SRC;
  });
}

// ─── COMPONENT ───────────────────────────────────────────────────────
export default function ConfiguradorPremium() {
  const [color,      setColor]      = useState('blanco');
  const [size,       setSize]       = useState('L');
  const [placements, setPlacements] = useState<string[]>(['pecho']);
  const [qty,        setQty]        = useState(1);
  const [delivery,   setDelivery]   = useState<'pickup'|'delivery'>('pickup');
  const [design,     setDesign]     = useState<string|null>(null);
  const [showScale,  setShowScale]  = useState(false);
  const [urls,       setUrls]       = useState<Record<string,string>>({});
  const fileRef = React.useRef<HTMLInputElement>(null);

  // preload all colorized shirts
  useEffect(() => {
    let alive = true;
    (async () => {
      for (const c of COLORS) {
        const u = await colorize(c.hex);
        if (alive) setUrls(p => ({ ...p, [c.hex]: u }));
      }
    })();
    return () => { alive = false; };
  }, []);

  const togglePlacement = (id: string) =>
    setPlacements(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const currentColor  = COLORS.find(c=>c.id===color)!;
  const shirtUrl      = urls[currentColor.hex] || SHIRT_SRC;
  const placementCost = PLACEMENTS.filter(p=>placements.includes(p.id)).reduce((s,p)=>s+p.price,0);
  const unitPrice     = BASE_PRICE + placementCost;
  const subtotal      = unitPrice * qty;
  const total         = subtotal + (delivery==='delivery' ? DELIVERY_FEE : 0);

  const openWA = () => {
    const pl = PLACEMENTS.filter(p=>placements.includes(p.id)).map(p=>p.name).join(', ') || '–';
    const msg = `Hola VLCN Studio 👋\n\nQuiero pedir una camiseta personalizada:\n• Color: ${currentColor.name}\n• Talla: ${size}\n• Cantidad: ${qty}\n• Estampado: ${pl}\n• Envío: ${delivery==='delivery'?'Delivery':'Punto de encuentro'}\n• Total estimado: ${fmt(total)} CLP\n\n¿Me ayudan a coordinar?`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/40 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navTo('')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-xs">INICIO</span>
        </button>
        <div className="flex items-center gap-3 ml-2">
          <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-7 w-auto" />
          <span className="font-bold tracking-tighter text-lg">VLCN STUDIO</span>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex flex-col lg:flex-row">

        {/* ── LEFT: SHIRT VIEWER ── */}
        <div className="lg:sticky lg:top-[61px] lg:self-start lg:w-[45%] lg:h-[calc(100vh-61px)] flex flex-col items-center justify-center bg-zinc-100 p-8 gap-6 min-h-[300px]">
          {/* Shirt image */}
          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
            <img
              key={currentColor.hex}
              src={shirtUrl}
              alt={`Camiseta ${currentColor.name}`}
              className="w-full h-full object-contain drop-shadow-2xl select-none"
              draggable={false}
            />
            {/* design overlay */}
            {design && (
              <div className="absolute pointer-events-none" style={{ width: '55%', left: '22.5%', top: '20%' }}>
                <img src={design} alt="Tu diseño" className="w-full h-auto object-contain drop-shadow" />
              </div>
            )}
          </div>

          {/* Color dots */}
          <div className="flex items-center gap-2">
            {COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                title={c.name}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${color===c.id ? 'scale-125 border-foreground' : 'border-white/60 hover:scale-110'}`}
                style={{ backgroundColor: c.hex==='#FFFFFF'?'#f3f4f6':c.hex, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
              />
            ))}
          </div>

          {/* Upload design */}
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 border border-zinc-300 bg-white px-5 py-2.5 font-mono text-xs font-bold tracking-wider hover:border-zinc-500 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            {design ? 'CAMBIAR DISEÑO' : 'SUBIR MI DISEÑO'}
          </button>
          {design && (
            <button onClick={() => setDesign(null)} className="font-mono text-[10px] text-zinc-400 hover:text-zinc-600 transition-colors -mt-3">
              quitar diseño
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden"
            onChange={e => { const f=e.target.files?.[0]; if(f) setDesign(URL.createObjectURL(f)); }} />
          {design && (
            <p className="font-mono text-[10px] text-zinc-400 text-center -mt-2 max-w-[240px] leading-relaxed">
              PNG a 300 DPI con fondo transparente para mejor resultado
            </p>
          )}
        </div>

        {/* ── RIGHT: OPTIONS ── */}
        <div className="lg:w-[55%] flex flex-col divide-y divide-border/40">

          {/* Title */}
          <div className="px-8 py-8">
            <p className="font-mono text-xs text-muted-foreground mb-2">PERSONALIZA TU PEDIDO</p>
            <h2 className="text-3xl font-bold tracking-tighter">Camiseta Manga Corta</h2>
            <p className="text-muted-foreground text-sm mt-1">100% algodón peinado · 220 g/m² · S a 2XL</p>
          </div>

          {/* COLOR */}
          <section className="px-8 py-7">
            <p className="font-mono text-xs font-bold tracking-widest mb-5">COLOR — <span className="text-muted-foreground font-normal normal-case tracking-normal">{currentColor.name}</span></p>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  className={`w-10 h-10 rounded-full transition-all border-2 ${color===c.id ? 'scale-110 border-foreground ring-2 ring-foreground/20' : 'border-white hover:scale-105'}`}
                  style={{ backgroundColor: c.hex==='#FFFFFF'?'#f3f4f6':c.hex, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
              ))}
            </div>
          </section>

          {/* TALLA */}
          <section className="px-8 py-7">
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-xs font-bold tracking-widest">TALLA</p>
              <button
                onClick={() => setShowScale(p=>!p)}
                className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <Ruler className="w-3 h-3" />
                {showScale ? 'OCULTAR MEDIDAS' : 'VER MEDIDAS'}
                {showScale ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex gap-2 mb-4">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-3 font-mono text-sm font-bold border transition-all ${size===s ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground/50'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Talla <strong className="text-foreground">{size}</strong> — estampado: <strong className="text-foreground">{SCALE[size].w} × {SCALE[size].h} cm</strong>
              {SCALE[size].a3 && <span className="ml-2 text-[10px] border border-border px-1 py-0.5">requiere A3</span>}
            </p>

            {/* Scale accordion */}
            {showScale && (
              <div className="mt-4 border border-border/60 p-4 bg-muted/30 space-y-2">
                {SIZES.map(s => {
                  const d = SCALE[s];
                  const pct = (d.w / SCALE['2XL'].w) * 100;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <span className={`font-mono text-xs w-8 font-bold shrink-0 ${s===size?'text-foreground':'text-muted-foreground'}`}>{s}</span>
                      <div className="flex-1 h-6 bg-background border border-border/40 overflow-hidden">
                        <div
                          className={`h-full flex items-center justify-end px-2 text-[10px] font-mono font-bold transition-all ${s===size?'bg-foreground text-background':'bg-foreground/10 text-foreground'}`}
                          style={{ width: `${pct}%` }}
                        >
                          {d.w}×{d.h}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* UBICACIÓN */}
          <section className="px-8 py-7">
            <p className="font-mono text-xs font-bold tracking-widest mb-5">UBICACIÓN DEL ESTAMPADO</p>
            <div className="space-y-2">
              {PLACEMENTS.map(p => {
                const sel = placements.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlacement(p.id)}
                    className={`w-full flex items-center gap-4 p-4 border text-left transition-all ${sel ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/40'}`}
                  >
                    <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all ${sel?'bg-foreground border-foreground':'border-border'}`}>
                      {sel && <Check className="w-3 h-3 text-background" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-bold">{p.name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{p.desc}</p>
                    </div>
                    <p className="font-mono text-sm font-bold shrink-0">+{fmt(p.price)}</p>
                  </button>
                );
              })}
            </div>
            {placements.length === 0 && (
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">Elige al menos una ubicación.</p>
            )}
          </section>

          {/* CANTIDAD */}
          <section className="px-8 py-7 flex items-center justify-between">
            <p className="font-mono text-xs font-bold tracking-widest">CANTIDAD</p>
            <div className="flex items-center gap-4 border border-border">
              <button onClick={() => setQty(q=>Math.max(1,q-1))} className="px-4 py-3 hover:bg-muted transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono text-lg w-8 text-center tabular-nums">{qty}</span>
              <button onClick={() => setQty(q=>q+1)} className="px-4 py-3 hover:bg-muted transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* ENVÍO */}
          <section className="px-8 py-7">
            <p className="font-mono text-xs font-bold tracking-widest mb-5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> ENTREGA
            </p>
            <div className="space-y-2">
              {([
                { id: 'pickup',   label: 'Punto de encuentro',  sub: 'Temuco centro · coordinamos por WhatsApp', price: 0 },
                { id: 'delivery', label: 'Delivery a domicilio', sub: 'Radio urbano de Temuco',                   price: DELIVERY_FEE },
              ] as const).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDelivery(opt.id)}
                  className={`w-full flex items-center gap-4 p-4 border text-left transition-all ${delivery===opt.id?'border-foreground bg-foreground/5':'border-border hover:border-foreground/40'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${delivery===opt.id?'border-foreground':'border-border'}`}>
                    {delivery===opt.id && <div className="w-2 h-2 rounded-full bg-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-bold">{opt.label}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{opt.sub}</p>
                  </div>
                  <p className="font-mono text-sm font-bold shrink-0">
                    {opt.price === 0 ? 'Gratis' : `+${fmt(opt.price)}`}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2 font-mono text-[10px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Producción inicia una vez confirmado el pago por transferencia.
            </div>
          </section>

          {/* TOTAL + CTA */}
          <section className="px-8 py-8 bg-foreground text-background">
            {/* Desglose */}
            <div className="space-y-2 mb-6 font-mono text-sm">
              <div className="flex justify-between text-background/60">
                <span>Prenda base</span><span>{fmt(BASE_PRICE)}</span>
              </div>
              {PLACEMENTS.filter(p=>placements.includes(p.id)).map(p => (
                <div key={p.id} className="flex justify-between text-background/60">
                  <span>Estampado {p.name}</span><span>+{fmt(p.price)}</span>
                </div>
              ))}
              {qty > 1 && (
                <div className="flex justify-between text-background/60">
                  <span>× {qty} unidades</span><span>= {fmt(unitPrice * qty)}</span>
                </div>
              )}
              {delivery === 'delivery' && (
                <div className="flex justify-between text-background/60">
                  <span>Delivery</span><span>+{fmt(DELIVERY_FEE)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-background/20 text-xl font-bold">
                <span>Total estimado</span>
                <span>{fmt(total)} <span className="text-sm font-normal text-background/50">CLP</span></span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={openWA}
              disabled={placements.length === 0}
              className="w-full flex items-center justify-between px-6 py-5 font-mono font-bold tracking-wider text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#25D366' }}
            >
              <span className="flex items-center gap-3 text-base">
                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white shrink-0">
                  <path d="M16.003 3C9.376 3 4 8.376 4 15.003c0 2.18.587 4.218 1.607 5.97L4 29l8.267-1.585A12.003 12.003 0 0 0 16.003 28c6.624 0 12-5.376 12-12.003C28.003 9.376 22.627 4 16.003 4zm.001 21.84c-1.863 0-3.594-.503-5.083-1.376l-.363-.216-4.908.94.957-4.802-.236-.374A9.845 9.845 0 0 1 5.17 15c0-5.426 4.411-9.838 9.835-9.838 5.424 0 9.835 4.412 9.835 9.838 0 5.426-4.41 9.84-9.836 9.84zm5.39-7.372c-.296-.148-1.748-.86-2.02-.958-.27-.098-.466-.148-.66.148-.195.297-.757.958-.928 1.154-.17.197-.34.222-.636.074-.296-.148-1.25-.46-2.38-1.47-.88-.784-1.473-1.752-1.645-2.048-.17-.295-.018-.455.13-.602.132-.133.296-.347.444-.52.148-.173.198-.297.297-.494.099-.197.05-.37-.025-.52-.074-.147-.66-1.59-.904-2.177-.238-.572-.48-.494-.66-.503l-.562-.01c-.197 0-.518.074-.79.37-.27.296-1.03 1.005-1.03 2.45 0 1.443 1.055 2.84 1.203 3.037.148.197 2.075 3.167 5.03 4.44.702.302 1.25.483 1.677.618.705.224 1.347.192 1.855.116.565-.085 1.748-.715 1.995-1.405.247-.69.247-1.28.173-1.403-.074-.124-.27-.197-.566-.345z"/>
                </svg>
                Coordinar por WhatsApp
              </span>
              <span className="text-white/70 text-sm">→</span>
            </button>
            <p className="font-mono text-[10px] text-background/40 mt-3 text-center">
              Te enviamos un resumen y coordinamos el diseño directo.
            </p>
          </section>

          <Footer />
        </div>
      </main>
    </div>
  );
}
