import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, ArrowRight, ArrowLeft,
  CheckCircle2, Ruler, Droplets, Info, Plus, Minus,
  X, Check, Save, Package, Eye,
  ShieldCheck, ArrowUpRight, MapPin, Upload, FileImage,
  ShoppingCart, Trash2
} from 'lucide-react';
import { cartStore, type CartItem } from './cartStore';
import { navTo, navigate } from './navigate';
import Footer from './Footer';

// --- MOCK DATA ---
const BASES = [
  { 
    id: 'tee', 
    name: 'CAMISETA MANGA CORTA', 
    price: 5000, 
    specs: '100% Algodón Peinado, 220 g/m²', 
    fitLabel: 'TALLA: S, M, L, XL, 2XL',
    img: `generated_images/vlcn-emerald-card-white.png` 
  },
  { 
    id: 'longsleeve', 
    name: 'SUBE LA FOTO DE TU DISEÑO', 
    price: 5000, 
    specs: '100% Algodón Orgánico, 200 g/m²', 
    fitLabel: 'TALLA: ELIGE LA TALLA QUE QUIERAS',
    img: `generated_images/vlcn-base-longsleeve.jpg` 
  }
];

const COLORS = [
  { id: 'negro',    name: 'NEGRO',    hex: '#000000', img: `generated_images/vlcn-shirt-negro.png`    },
  { id: 'blanco',   name: 'BLANCO',   hex: '#FFFFFF', img: `generated_images/vlcn-shirt-blanco.png`   },
  { id: 'rojo',     name: 'ROJO',     hex: '#DC2626', img: `generated_images/vlcn-shirt-rojo.png`     },
  { id: 'naranjo',  name: 'NARANJO',  hex: '#F97316', img: `generated_images/vlcn-shirt-naranjo.png`  },
  { id: 'amarillo', name: 'AMARILLO', hex: '#EAB308', img: `generated_images/vlcn-shirt-amarillo.png` },
  { id: 'verde',    name: 'VERDE',    hex: '#16A34A', img: `generated_images/vlcn-shirt-verde.png`    },
  { id: 'azul',     name: 'AZUL',     hex: '#2563EB', img: `generated_images/vlcn-shirt-azul.png`     },
  { id: 'violeta',  name: 'VIOLETA',  hex: '#7C3AED', img: `generated_images/vlcn-shirt-violeta.png`  },
];

const PRINTS = [
  { id: 'brutalist', name: 'BRUTALIST ARCHIVE', img: `generated_images/vlcn-print-brutalist.jpg` },
  { id: 'schematic', name: 'CYBER SCHEMATIC', img: `generated_images/vlcn-print-schematic.jpg` }
];

const PLACEMENTS = [
  { id: 'pecho',   name: 'PECHO',   price: 10000, desc: 'Estampado frontal centrado sobre pecho' },
  { id: 'espalda', name: 'ESPALDA', price: 3500,  desc: 'Estampado dorsal de gran formato' },
  { id: 'manga',   name: 'MANGA',   price: 1500,  desc: 'Estampado lateral en manga derecha' },
];

const DELIVERY_COST = 2000;
const WA_NUMBER = '56965536529';

const formatCLP = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

// ---------- COLORIZACIÓN REALISTA POR CANVAS ----------
const SHIRT_BASE_SRC = 'generated_images/vlcn-shirt-blanco.png';
const _colorizeCache = new Map<string, string>();

async function colorizeShirt(colorHex: string): Promise<string> {
  if (_colorizeCache.has(colorHex)) return _colorizeCache.get(colorHex)!;

  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) { resolve(SHIRT_BASE_SRC); return; }
      ctx.drawImage(img, 0, 0);

      if (colorHex === '#FFFFFF' || colorHex === '#ffffff') {
        const url = canvas.toDataURL('image/jpeg', 0.92);
        _colorizeCache.set(colorHex, url);
        resolve(url);
        return;
      }

      const effectiveHex = colorHex === '#000000' ? '#141414' : colorHex;
      const cr = parseInt(effectiveHex.slice(1, 3), 16) / 255;
      const cg = parseInt(effectiveHex.slice(3, 5), 16) / 255;
      const cb = parseInt(effectiveHex.slice(5, 7), 16) / 255;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue;
        const pr = data[i], pg = data[i + 1], pb = data[i + 2];
        const maxCh = Math.max(pr, pg, pb);
        const minCh = Math.min(pr, pg, pb);
        const sat = maxCh === 0 ? 0 : (maxCh - minCh) / maxCh;

        if (sat < 0.28) {
          data[i]     = Math.round(pr * cr);
          data[i + 1] = Math.round(pg * cg);
          data[i + 2] = Math.round(pb * cb);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const url = canvas.toDataURL('image/jpeg', 0.92);
      _colorizeCache.set(colorHex, url);
      resolve(url);
    };
    img.onerror = () => resolve(SHIRT_BASE_SRC);
    img.src = SHIRT_BASE_SRC;
  });
}

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

const PRINT_DIMENSIONS_BY_TALLA: Record<string, { w: number; h: number; requiresA3?: boolean }> = {
  S:    { w: 25, h: 35 },
  M:    { w: 28, h: 38 },
  L:    { w: 30, h: 40 },
  XL:   { w: 32, h: 42, requiresA3: true },
  '2XL':{ w: 35, h: 45, requiresA3: true },
};
const PRINT_SIZE_BY_TALLA: Record<string, string> = Object.fromEntries(
  Object.entries(PRINT_DIMENSIONS_BY_TALLA).map(([k, { w, h }]) => [k, `${w} × ${h} cm`])
);
const LOGO_PECHO_SIZE = '10 × 10 cm';

const GARMENT_WIDTH_BY_TALLA: Record<string, number> = {
  S: 50, M: 52, L: 54, XL: 57, '2XL': 60,
};

const getPrintWidthRatio = (talla: string) => PRINT_DIMENSIONS_BY_TALLA[talla].w / GARMENT_WIDTH_BY_TALLA[talla];
const PRINT_REF = PRINT_DIMENSIONS_BY_TALLA.M;
const getPrintScale = (talla: string) => ({
  x: PRINT_DIMENSIONS_BY_TALLA[talla].w / PRINT_REF.w,
  y: PRINT_DIMENSIONS_BY_TALLA[talla].h / PRINT_REF.h,
});

export default function ConfiguradorPremium() {
  // --- STATE ---
  const [step, setStep] = useState(1);
  const [selectedBase, setSelectedBase] = useState(BASES[0].id);
  const [selectedPrint, setSelectedPrint] = useState(PRINTS[0].id);
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>([PLACEMENTS[0].id]);
  const [placementsConfirmed, setPlacementsConfirmed] = useState(false);
  const [size, setSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [savedConfigs, setSavedConfigs] = useState<any[]>([]);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedColor, setSelectedColor] = useState('blanco');
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [showColorConfig, setShowColorConfig] = useState(true);
  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null);
  const [showNotaImportante, setShowNotaImportante] = useState(false);
  const [showScaleInline, setShowScaleInline] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => cartStore.get());
  const [colorizedUrls, setColorizedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    const preload = async () => {
      for (const c of COLORS) {
        if (cancelled) break;
        const url = await colorizeShirt(c.hex);
        if (!cancelled) {
          setColorizedUrls(prev => prev[c.hex] ? prev : { ...prev, [c.hex]: url });
        }
      }
    };
    preload();
    return () => { cancelled = true; };
  }, []);

  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) return;
    const url = URL.createObjectURL(file);
    setUploadedDesign(url);
  };

  // --- DERIVED STATE ---
  const base = BASES.find(b => b.id === selectedBase)!;
  const print = PRINTS.find(p => p.id === selectedPrint)!;
  const placements = PLACEMENTS.filter(p => selectedPlacements.includes(p.id));
  const placementsTotal = placements.reduce((sum, p) => sum + p.price, 0);
  const primaryPlacement = placements[0] || PLACEMENTS[0];
  const colorIndex = COLORS.findIndex(c => c.id === selectedColor);
  const currentColor = COLORS[colorIndex];
  const previewColor = COLORS.find(c => c.id === hoveredColor) || currentColor;
  const nextColor = () => setSelectedColor(COLORS[(colorIndex + 1) % COLORS.length].id);

  const isPechoLogoFijo = selectedPlacements.includes('pecho') && !uploadedDesign;
  const printMeasure = isPechoLogoFijo ? LOGO_PECHO_SIZE : PRINT_SIZE_BY_TALLA[size];
  const printScale = isPechoLogoFijo ? { x: 1, y: 1 } : getPrintScale(size);
  const printWidthRatioPct = getPrintWidthRatio(size) * 100;
  const printWidthPercent = isPechoLogoFijo
    ? 20
    : primaryPlacement.id === 'pecho'
      ? printWidthRatioPct * 0.6
      : primaryPlacement.id === 'espalda'
        ? printWidthRatioPct
        : printWidthRatioPct * 0.4;

  const togglePlacement = (id: string) => {
    setSelectedPlacements(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    setPlacementsConfirmed(false);
  };

  const unitPrice = base.price + placementsTotal;
  const subtotal = unitPrice * quantity;
  const shipping = deliveryMethod === 'delivery' ? DELIVERY_COST : 0;
  const total = subtotal + shipping;

  const handleSaveConfig = () => {
    setSavedConfigs(prev => [...prev, { base, print, placements, size, quantity }]);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleWhatsAppContact = () => {
    const placementNames = placements.map(p => p.name).join(', ') || 'Sin ubicación';
    const text = `Hola VLCN Studio 👋 Me interesa una camiseta personalizada.\n\n🎨 Color: ${currentColor.name}\n📐 Talla: ${size}\n📦 Cantidad: ${quantity}\n📍 Estampado: ${placementNames}\n💰 Total estimado: ${formatCLP(total)}\n\n¿Podemos coordinar el pedido?`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navTo('')}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-8 w-auto object-contain" />
          <h1 className="font-bold tracking-tighter text-xl">VLCN STUDIO</h1>
        </button>
        <div className="flex items-center gap-6 text-sm font-mono">
          <span className="hidden md:inline-flex text-muted-foreground">TALLER TÉCNICO</span>
          <button
            className="flex items-center gap-2 hover:text-accent transition-colors relative"
            onClick={handleSaveConfig}
            title="Guardar configuración"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">GUARDAR</span>
            {savedConfigs.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {savedConfigs.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* NAVEGACIÓN DE RETORNO */}
      <div className="flex gap-3 px-6 md:px-12 py-3 border-b border-border/40 bg-background">
        <button
          onClick={() => navTo('categorias')}
          className="flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs font-bold tracking-wider hover:bg-muted transition-colors"
        >
          ← CATEGORÍAS
        </button>
        <button
          onClick={() => navTo('')}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 font-mono text-xs font-bold tracking-wider hover:bg-accent transition-colors"
        >
          ⌂ INICIO
        </button>
      </div>

      {/* TOAST */}
      <div className={`fixed top-20 right-6 z-50 bg-foreground text-background px-4 py-3 shadow-2xl flex items-center gap-3 transition-all duration-300 transform ${showSavedToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <CheckCircle2 className="w-4 h-4 text-accent" />
        <span className="font-mono text-xs">CONFIGURACIÓN GUARDADA</span>
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start relative">
        
        {/* LEFT: MAIN CONTENT */}
        <main className="w-full lg:w-[70%] lg:border-r border-border/40 min-h-screen">
          
          {/* WIZARD */}
          <section className="p-6 md:p-12 border-b border-border/40">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold tracking-tighter uppercase">Configurador</h2>
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className={step === 1 ? 'text-accent font-bold' : 'text-muted-foreground'}>01. BASE</span>
                <span className="text-muted-foreground">/</span>
                <span className={step === 2 ? 'text-accent font-bold' : 'text-muted-foreground'}>02. UBICACIÓN</span>
              </div>
            </div>

            {/* STEP 1: BASE */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-6">
                  <h3 className="font-mono text-sm text-muted-foreground mb-1">SELECCIONA EL LIENZO</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {BASES.map(b => (
                    <div 
                      key={b.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => { setSelectedBase(b.id); setShowColorConfig(true); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedBase(b.id); setShowColorConfig(true); } }}
                      className={`group text-left relative border p-4 transition-all duration-300 cursor-pointer ${selectedBase === b.id ? 'border-accent ring-1 ring-accent' : 'border-border hover:border-foreground/50'}`}
                    >
                      <div className="aspect-square bg-white mb-4 overflow-hidden relative">
                        {b.id === 'tee' ? (
                          <>
                            {COLORS.map(c => (
                              <img
                                key={c.id}
                                src={`${import.meta.env.BASE_URL}${c.img}`}
                                alt={`${b.name} - ${c.name}`}
                                className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
                                  currentColor.id === c.id ? 'opacity-100' : 'opacity-0'
                                } ${selectedBase === b.id ? 'scale-105' : 'group-hover:scale-110'}`}
                              />
                            ))}
                            <button
                              onClick={(e) => { e.stopPropagation(); nextColor(); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg transition-transform hover:scale-110"
                              aria-label="Ver siguiente color"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                              {COLORS.map(c => (
                                <span
                                  key={c.id}
                                  className={`w-1.5 h-1.5 rounded-full transition-all border border-white/70 ${c.id === selectedColor ? 'ring-1 ring-white scale-125' : 'opacity-70'}`}
                                  style={{ backgroundColor: c.hex === '#FFFFFF' ? '#f3f4f6' : c.hex }}
                                />
                              ))}
                            </div>
                          </>
                        ) : (
                          <>
                            {uploadedDesign ? (
                              <img src={uploadedDesign} alt="Diseño subido" className="w-full h-full object-contain bg-white" />
                            ) : (
                              <img src={b.img} alt={b.name} className={`w-full h-full object-cover opacity-40 transition-transform duration-700 ${selectedBase === b.id ? 'scale-105' : 'group-hover:scale-110'}`} />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                className="flex flex-col items-center gap-2 bg-white/90 hover:bg-white text-foreground rounded-full w-20 h-20 justify-center shadow-lg transition-transform hover:scale-110"
                                aria-label="Subir diseño"
                              >
                                <Upload className="w-7 h-7" />
                              </button>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/png,image/jpeg"
                              onChange={handleDesignUpload}
                              onClick={(e) => e.stopPropagation()}
                              className="hidden"
                            />
                            {uploadedDesign && (
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] font-mono px-2 py-1 rounded">
                                DISEÑO CARGADO
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <h4 className="font-bold tracking-tight mb-2">{b.name}</h4>
                      <div className="font-mono text-xs text-muted-foreground space-y-1">
                        <p>{b.specs}</p>
                        <p>{b.fitLabel}</p>
                        {b.id === 'tee' && <p>COLOR: {currentColor.name}</p>}
                      </div>

                      {/* NOTA IMPORTANTE — solo para subida */}
                      {b.id === 'longsleeve' && (
                        <div className="mt-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowNotaImportante(p => !p); }}
                            className={`w-full flex items-center justify-between gap-2 px-4 py-3 font-mono text-xs font-bold tracking-wider transition-all
                              ${showNotaImportante
                                ? 'bg-accent text-white'
                                : 'bg-accent/10 text-accent border border-accent/40 hover:bg-accent/20'}`}
                          >
                            <span className="flex items-center gap-2">
                              <FileImage className="w-3.5 h-3.5 shrink-0" />
                              ⚠ REQUISITOS DEL ARCHIVO
                            </span>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showNotaImportante ? 'rotate-90' : ''}`} />
                          </button>

                          {showNotaImportante && (
                            <div className="border border-accent/30 border-t-0 bg-accent/5 p-4 space-y-2.5">
                              <p className="text-xs font-medium leading-relaxed">
                                Tu diseño debe ser <strong className="text-foreground">PNG a 300 DPI</strong> para garantizar un estampado nítido.
                              </p>
                              <ul className="text-xs text-muted-foreground space-y-1.5">
                                <li className="flex items-start gap-2"><Check className="w-3 h-3 text-accent shrink-0 mt-0.5" /><span>Formato: <strong className="text-foreground">PNG</strong> (sin pérdida)</span></li>
                                <li className="flex items-start gap-2"><Check className="w-3 h-3 text-accent shrink-0 mt-0.5" /><span>Mínimo: <strong className="text-foreground">300 DPI</strong></span></li>
                                <li className="flex items-start gap-2"><Check className="w-3 h-3 text-accent shrink-0 mt-0.5" /><span>Fondo transparente recomendado</span></li>
                                <li className="flex items-start gap-2"><X className="w-3 h-3 text-red-400 shrink-0 mt-0.5" /><span>No JPG ni capturas de pantalla</span></li>
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-foreground text-background px-8 py-4 flex items-center gap-3 hover:bg-accent hover:text-white transition-colors group font-mono text-sm"
                  >
                    SIGUIENTE PASO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: UBICACIÓN */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> VOLVER A BASE
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Placement selector */}
                  <div>
                    <h3 className="font-mono text-sm text-muted-foreground mb-1">SELECCIONA UBICACIÓN</h3>
                    <p className="font-mono text-[10px] text-muted-foreground/70 mb-6">El costo varía según la zona de impresión.</p>

                    <div className="space-y-3">
                      {PLACEMENTS.map(p => {
                        const isSelected = selectedPlacements.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            className={`flex items-center gap-5 p-5 border cursor-pointer transition-all duration-200 group
                              ${isSelected
                                ? 'border-accent bg-accent/5 ring-2 ring-accent/40'
                                : 'border-border hover:border-foreground/40'
                              }`}
                          >
                            <div
                              onClick={() => togglePlacement(p.id)}
                              className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer
                                ${isSelected ? 'border-accent bg-accent' : 'border-border group-hover:border-foreground/50'}`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                            <input type="checkbox" value={p.id} checked={isSelected} onChange={() => togglePlacement(p.id)} className="sr-only" />
                            <div className="flex-1 min-w-0" onClick={() => togglePlacement(p.id)}>
                              <p className={`font-mono text-sm font-bold tracking-wider uppercase ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>{p.name}</p>
                              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{p.desc}</p>
                            </div>
                            <div className="text-right shrink-0" onClick={() => togglePlacement(p.id)}>
                              <p className={`font-mono text-base font-bold transition-colors ${isSelected ? 'text-accent' : 'text-foreground/70'}`}>+{formatCLP(p.price)}</p>
                              <p className="font-mono text-[10px] text-muted-foreground">CLP</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Acumulador */}
                    <div className="mt-4 p-4 border border-border bg-muted/60">
                      <div className="space-y-1.5 mb-3">
                        <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
                          <span>PRENDA BASE</span><span>{formatCLP(base.price)}</span>
                        </div>
                        {PLACEMENTS.map(p => {
                          const sel = selectedPlacements.includes(p.id);
                          return (
                            <div key={p.id} className={`flex justify-between font-mono text-[11px] transition-all duration-200 ${sel ? 'text-accent font-bold' : 'text-muted-foreground/40 line-through'}`}>
                              <span>ESTAMPADO {p.name}</span><span>+{formatCLP(p.price)}</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between font-mono text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                          <span>× {quantity} unidades</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Total estimado</p>
                        <p className="font-mono text-2xl font-bold text-foreground tabular-nums">{formatCLP(subtotal)}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (selectedPlacements.length > 0) {
                          setPlacementsConfirmed(true);
                          setStep(1);
                        }
                      }}
                      disabled={selectedPlacements.length === 0}
                      className={`mt-4 w-full py-4 px-6 font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-200
                        ${selectedPlacements.length > 0
                          ? placementsConfirmed
                            ? 'bg-accent text-white cursor-default'
                            : 'bg-foreground text-background hover:bg-accent'
                          : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        }`}
                    >
                      {placementsConfirmed
                        ? <><CheckCircle2 className="w-4 h-4" /> ELECCIÓN CONFIRMADA</>
                        : <><Check className="w-4 h-4" /> CONFIRMAR · {formatCLP(subtotal)} CLP</>
                      }
                    </button>
                    {selectedPlacements.length === 0 && (
                      <p className="mt-2 font-mono text-[10px] text-muted-foreground text-center">Selecciona al menos una ubicación para continuar.</p>
                    )}
                  </div>

                  {/* Panel técnico */}
                  <div>
                    <h3 className="font-mono text-sm text-muted-foreground mb-6">UBICACIÓN TÉCNICA</h3>
                    {selectedPlacements.length === 0 ? (
                      <div className="border border-dashed border-border p-6 text-center">
                        <p className="font-mono text-xs text-muted-foreground">Ninguna zona seleccionada.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 mb-6">
                        {PLACEMENTS.filter(p => selectedPlacements.includes(p.id)).map(p => (
                          <div key={p.id} className="border border-accent p-4 bg-accent/5">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                                <h4 className="font-bold text-sm tracking-tighter uppercase">{p.name}</h4>
                              </div>
                              <p className="font-mono text-sm font-bold text-accent">{formatCLP(p.price)}</p>
                            </div>
                            <p className="font-mono text-[11px] text-muted-foreground pl-6">{p.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-0 border border-border/40">
                      {PLACEMENTS.map((p, i) => {
                        const sel = selectedPlacements.includes(p.id);
                        return (
                          <div key={p.id} className={`flex items-center justify-between px-4 py-3 font-mono text-xs transition-all duration-200 ${sel ? 'bg-accent/10 text-foreground' : 'text-muted-foreground'} ${i < PLACEMENTS.length - 1 ? 'border-b border-border/40' : ''}`}>
                            <div className="flex items-center gap-3">
                              {sel ? <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" /> : <div className="w-3.5 h-3.5 border border-border/60 shrink-0" />}
                              <span className={`font-bold uppercase tracking-wider ${sel ? '' : 'line-through opacity-50'}`}>{p.name}</span>
                            </div>
                            <span className={sel ? 'text-accent font-bold' : 'opacity-40'}>{formatCLP(p.price)}</span>
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between px-4 py-3 font-mono text-xs bg-foreground text-background">
                        <span className="font-bold uppercase tracking-wider">TOTAL UBICACIONES</span>
                        <span className="font-bold">{formatCLP(placementsTotal)}</span>
                      </div>
                    </div>

                    <div className="mt-6 p-5 bg-muted border border-border/50">
                      <div className="flex items-start gap-4">
                        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Inspección Manual</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">Cada impresión es curada a 160°C y revisada bajo luz industrial.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* COLOR + SPECS */}
          {showColorConfig && (
          <section className="p-6 md:p-12 border-b border-border/40 bg-[#FAFAFA]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* High Fidelity Viewer */}
              <div className="relative group overflow-hidden border border-border aspect-[4/5] bg-white cursor-crosshair">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none">
                  <div className="bg-background/80 backdrop-blur font-mono text-[10px] px-3 py-1 border border-border">INSPECCIÓN X-RAY</div>
                </div>
                {COLORS.map(c => (
                  <img
                    key={c.id}
                    src={`${import.meta.env.BASE_URL}${c.img}`}
                    alt={`Vista Detallada - ${c.name}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 group-hover:scale-[1.35] origin-center ${
                      previewColor.id === c.id ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  />
                ))}
                {uploadedDesign ? (
                  <div
                    className="absolute z-20 transition-all duration-300 pointer-events-none"
                    style={{ width: `${printWidthPercent}%`, left: '50%', transform: 'translateX(-50%)', top: '30%' }}
                  >
                    <div style={{ width: '100%', paddingBottom: `${(PRINT_DIMENSIONS_BY_TALLA[size].h / PRINT_DIMENSIONS_BY_TALLA[size].w) * 100}%`, position: 'relative' }}>
                      <img src={uploadedDesign} alt="Tu diseño estampado" className="absolute inset-0 w-full h-full object-contain drop-shadow-sm" draggable={false} />
                    </div>
                  </div>
                ) : selectedBase === 'longsleeve' ? (
                  <div className="absolute z-20 inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-black/60 text-white font-mono text-[11px] px-4 py-2 rounded text-center leading-relaxed">
                      <Upload className="w-5 h-5 mx-auto mb-1 opacity-80" />
                      SUBE TU DISEÑO<br />para previsualizar
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Specs panel */}
              <div>
                {/* WhatsApp CTA — diseño asistido */}
                <div className="mb-8">
                  <button
                    onClick={handleWhatsAppContact}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 font-mono text-sm uppercase tracking-widest text-white shadow-lg transition-all duration-200 group hover:brightness-110"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <span className="flex items-center gap-3">
                      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white shrink-0">
                        <path d="M16.003 3C9.376 3 4 8.376 4 15.003c0 2.18.587 4.218 1.607 5.97L4 29l8.267-1.585A12.003 12.003 0 0 0 16.003 28c6.624 0 12-5.376 12-12.003C28.003 9.376 22.627 4 16.003 4zm.001 21.84c-1.863 0-3.594-.503-5.083-1.376l-.363-.216-4.908.94.957-4.802-.236-.374A9.845 9.845 0 0 1 5.17 15c0-5.426 4.411-9.838 9.835-9.838 5.424 0 9.835 4.412 9.835 9.838 0 5.426-4.41 9.84-9.836 9.84zm5.39-7.372c-.296-.148-1.748-.86-2.02-.958-.27-.098-.466-.148-.66.148-.195.297-.757.958-.928 1.154-.17.197-.34.222-.636.074-.296-.148-1.25-.46-2.38-1.47-.88-.784-1.473-1.752-1.645-2.048-.17-.295-.018-.455.13-.602.132-.133.296-.347.444-.52.148-.173.198-.297.297-.494.099-.197.05-.37-.025-.52-.074-.147-.66-1.59-.904-2.177-.238-.572-.48-.494-.66-.503l-.562-.01c-.197 0-.518.074-.79.37-.27.296-1.03 1.005-1.03 2.45 0 1.443 1.055 2.84 1.203 3.037.148.197 2.075 3.167 5.03 4.44.702.302 1.25.483 1.677.618.705.224 1.347.192 1.855.116.565-.085 1.748-.715 1.995-1.405.247-.69.247-1.28.173-1.403-.074-.124-.27-.197-.566-.345z"/>
                      </svg>
                      Coordinar por WhatsApp
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="font-mono text-[10px] text-muted-foreground mt-2">
                    Envía tu configuración actual y coordinamos el diseño directo.
                  </p>
                </div>

                <h2 className="text-3xl font-bold tracking-tighter uppercase mb-8">Especificaciones</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex gap-4 items-start border-b border-border/50 pb-4">
                    <Droplets className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div>
                      <h4 className="font-mono text-xs font-bold mb-1">ESTAMPADO PERSONALIZADO</h4>
                      <p className="text-sm">Serigrafía Alta Densidad / DTF Industrial. Garantía de &lt;3% encogimiento tras 50 lavados.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start border-b border-border/50 pb-4">
                    <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div>
                      <h4 className="font-mono text-xs font-bold mb-1">RESISTENCIA</h4>
                      <p className="text-sm">Curado a 160°C. Resiste lavados abrasivos sin craquelado prematuro.</p>
                    </div>
                  </div>
                </div>

                {/* Color selector */}
                {selectedBase === 'tee' && (
                  <div className="mb-10">
                    <h4 className="font-mono text-xs font-bold mb-4">ELIGE TU COLOR:</h4>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex gap-3">
                        {COLORS.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setSelectedColor(c.id)}
                            onMouseEnter={() => setHoveredColor(c.id)}
                            onMouseLeave={() => setHoveredColor(null)}
                            className={`w-12 h-12 rounded-full border-2 transition-all shadow-sm ${selectedColor === c.id ? 'border-accent ring-2 ring-accent/30 scale-110' : 'border-border hover:border-foreground/60 hover:scale-105'}`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                            aria-label={c.name}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3 border-l border-border/60 pl-4">
                        <span className="w-10 h-10 rounded-full border border-border/60 shadow-sm" style={{ backgroundColor: currentColor.hex }} />
                        <p className="font-mono text-sm font-bold">COLOR: {currentColor.name}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Talla + escala inline */}
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-4">
                    <h4 className="font-mono text-xs font-bold">SELECCIÓN DE TALLA (EU)</h4>
                    <button
                      onClick={() => setShowScaleInline(p => !p)}
                      className="flex items-center gap-1 font-mono text-[10px] text-accent hover:underline"
                    >
                      <Ruler className="w-3 h-3" /> {showScaleInline ? 'OCULTAR ESCALA' : 'VER ESCALA'}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {SIZES.map(s => (
                      <button 
                        key={s}
                        onClick={() => setSize(s)}
                        className={`flex-1 py-3 font-mono text-sm border transition-colors ${size === s ? 'bg-foreground text-background border-foreground' : 'bg-background hover:border-foreground/40'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Ruler className="w-3.5 h-3.5 shrink-0" />
                    <span>TALLA {size} — ESTAMPADO: <span className="font-bold text-foreground">{printMeasure}</span></span>
                  </div>
                  {PRINT_DIMENSIONS_BY_TALLA[size]?.requiresA3 && (
                    <div className="mt-2 flex items-start gap-2 p-2 border border-accent/30 bg-accent/5 font-mono text-[10px] text-accent">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Talla {size}: requiere plancha A3. Consulta disponibilidad.</span>
                    </div>
                  )}

                  {/* Escala inline expandible */}
                  {showScaleInline && (
                    <div className="mt-4 border border-border p-4 bg-muted/40 animate-in slide-in-from-top-2 duration-200">
                      <h5 className="font-mono text-xs font-bold mb-3 flex items-center gap-2">
                        <Ruler className="w-3.5 h-3.5 text-accent" /> DETALLE DE ESCALA DE ESTAMPADO
                      </h5>
                      <div className="space-y-2">
                        {SIZES.map(s => {
                          const dims = PRINT_DIMENSIONS_BY_TALLA[s];
                          const isActive = s === size;
                          const maxW = PRINT_DIMENSIONS_BY_TALLA['2XL'].w;
                          const barW = (dims.w / maxW) * 100;
                          return (
                            <div key={s} className="flex items-center gap-3">
                              <span className={`font-mono text-xs w-8 shrink-0 font-bold ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>{s}</span>
                              <div className="flex-1 bg-background h-7 relative overflow-hidden border border-border/40">
                                <div
                                  className={`h-full flex items-center justify-end pr-2 transition-all duration-300 ${isActive ? 'bg-accent text-white' : 'bg-foreground/15 text-foreground'}`}
                                  style={{ width: `${barW}%` }}
                                >
                                  <span className="font-mono text-[10px] font-bold whitespace-nowrap">{dims.w}×{dims.h} cm</span>
                                </div>
                              </div>
                              {dims.requiresA3 && (
                                <span className="font-mono text-[9px] text-accent border border-accent/40 px-1 py-0.5 shrink-0">A3</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground mt-3">
                        El estampado crece en cm con cada talla, manteniendo ~50–55% del ancho de la prenda.
                      </p>
                    </div>
                  )}
                </div>

                {/* Botones de retorno */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/40">
                  <button onClick={() => navTo('categorias')} className="flex-1 flex items-center justify-center gap-2 border border-border py-3 font-mono text-xs font-bold tracking-wider hover:bg-muted transition-colors">
                    ← VOLVER A CATEGORÍAS
                  </button>
                  <button onClick={() => navTo('')} className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3 font-mono text-xs font-bold tracking-wider hover:bg-accent transition-colors">
                    ⌂ IR AL INICIO
                  </button>
                </div>
              </div>
            </div>
          </section>
          )}

        </main>

        {/* RIGHT SIDEBAR: PRICE TRACKER */}
        <aside className="w-full lg:w-[30%] lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] border-t lg:border-t-0 border-border/40 bg-background fixed bottom-0 left-0 z-40 p-6 flex flex-col justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:shadow-none lg:relative lg:bottom-auto lg:left-auto">
          
          <div className="hidden lg:block space-y-6 flex-1 overflow-y-auto pr-2 pb-6">
            <h3 className="font-mono text-sm text-muted-foreground border-b border-border pb-4">RESUMEN TÉCNICO</h3>

            {/* Carrito de catálogo */}
            {cartItems.length > 0 && (
              <div className="border border-accent/30 bg-accent/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-accent" />
                    CATÁLOGO ({cartItems.reduce((s, i) => s + i.cantidad, 0)} items)
                  </p>
                  <button
                    onClick={() => { cartStore.clear(); setCartItems([]); }}
                    className="font-mono text-[9px] text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> VACIAR
                  </button>
                </div>
                <div className="space-y-0 border border-border/40">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${item.talla}`} className={`flex items-start gap-3 px-3 py-2.5 ${idx < cartItems.length - 1 ? 'border-b border-border/40' : ''}`}>
                      <div className="w-2 self-stretch rounded-full shrink-0 mt-0.5" style={{ background: item.accentHex }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[11px] font-bold leading-snug truncate">{item.titulo}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">Talla <span className="font-bold">{item.talla}</span> · ×{item.cantidad}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <p className="font-mono text-[11px] font-bold" style={{ color: item.accentHex }}>{formatCLP(item.precio * item.cantidad)}</p>
                        <button onClick={() => { cartStore.remove(item.id, item.talla); setCartItems(cartStore.get()); }} className="text-muted-foreground hover:text-red-400 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-2.5 bg-accent/10">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider">SUBTOTAL CATÁLOGO</span>
                    <span className="font-mono text-sm font-bold text-accent">{formatCLP(cartItems.reduce((s, i) => s + i.precio * i.cantidad, 0))}</span>
                  </div>
                </div>
              </div>
            )}

            {cartItems.length === 0 && (
              <div className="border border-dashed border-border/40 p-4 text-center">
                <ShoppingCart className="w-5 h-5 text-muted-foreground/40 mx-auto mb-2" />
                <p className="font-mono text-[10px] text-muted-foreground/50 leading-relaxed">Agrega productos desde las categorías.</p>
              </div>
            )}

            {/* Resumen */}
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground mb-1">PRENDA BASE</p>
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm max-w-[70%]">{base.name}</p>
                  <p className="font-mono text-sm">{formatCLP(base.price)}</p>
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted-foreground mb-1">IMPRESIÓN — UBICACIÓN</p>
                {placements.length === 0 ? (
                  <p className="font-mono text-xs text-muted-foreground/60 italic">Sin ubicación seleccionada</p>
                ) : (
                  <div className="space-y-1">
                    {placements.map(p => (
                      <div key={p.id} className="flex justify-between items-center">
                        <p className="font-bold text-sm">Estampado {p.name}</p>
                        <p className="font-mono text-sm">+{formatCLP(p.price)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="font-mono text-[10px] text-muted-foreground mb-2">CANTIDAD</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 border hover:bg-muted transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="font-mono text-lg w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 border hover:bg-muted transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Método de envío */}
            <div className="pt-4 border-t border-border space-y-3">
              <p className="font-mono text-[10px] text-muted-foreground mb-2 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> MÉTODO DE ENVÍO
              </p>

              <label className={`flex items-start gap-3 p-4 border cursor-pointer transition-all duration-200 ${deliveryMethod === 'pickup' ? 'border-accent bg-accent/5 ring-1 ring-accent/40' : 'border-border hover:border-foreground/40'}`}>
                <div className="mt-0.5 shrink-0">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${deliveryMethod === 'pickup' ? 'border-accent' : 'border-border'}`} onClick={() => setDeliveryMethod('pickup')}>
                    {deliveryMethod === 'pickup' && <div className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                </div>
                <input type="radio" name="deliveryMethod" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} className="sr-only" />
                <div className="flex-1 min-w-0" onClick={() => setDeliveryMethod('pickup')}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider">Punto de Encuentro (Gratis)</p>
                    <span className="font-mono text-sm font-bold text-accent shrink-0">$0</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">Temuco Centro. Coordinamos por WhatsApp.</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border cursor-pointer transition-all duration-200 ${deliveryMethod === 'delivery' ? 'border-accent bg-accent/5 ring-1 ring-accent/40' : 'border-border hover:border-foreground/40'}`}>
                <div className="mt-0.5 shrink-0">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${deliveryMethod === 'delivery' ? 'border-accent' : 'border-border'}`} onClick={() => setDeliveryMethod('delivery')}>
                    {deliveryMethod === 'delivery' && <div className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                </div>
                <input type="radio" name="deliveryMethod" value="delivery" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} className="sr-only" />
                <div className="flex-1 min-w-0" onClick={() => setDeliveryMethod('delivery')}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider">Delivery a Domicilio</p>
                    <span className="font-mono text-sm font-bold shrink-0">+{formatCLP(DELIVERY_COST)}</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">Radio urbano de Temuco.</p>
                </div>
              </label>

              <div className="flex items-start gap-2 p-3 border border-border/60 bg-muted/60">
                <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                  Pedidos confirmados vía transferencia antes de coordinar entrega.
                </p>
              </div>
            </div>
          </div>

          {/* Total + CTA */}
          <div className="flex lg:flex-col items-center lg:items-stretch justify-between gap-4 lg:gap-6 lg:border-t lg:border-border lg:pt-6 bg-background">
            <div className="flex-1 lg:flex-none">
              <p className="font-mono text-[10px] text-muted-foreground hidden lg:block mb-1">TOTAL ESTIMADO</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter">{formatCLP(total)}</span>
                <span className="font-mono text-xs text-muted-foreground">CLP</span>
              </div>
              <p className="text-[10px] text-muted-foreground lg:hidden">
                {deliveryMethod === 'delivery' ? `+ Delivery ${formatCLP(DELIVERY_COST)}` : 'Punto de encuentro gratis'}
              </p>
            </div>
            
            <div className="flex gap-2 flex-col lg:flex-row lg:w-full w-auto">
              <button
                onClick={handleWhatsAppContact}
                className="lg:hidden p-4 flex items-center justify-center transition-colors w-12 h-12 shrink-0 rounded-full"
                style={{ backgroundColor: '#25D366' }}
                title="Contactar por WhatsApp"
              >
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white">
                  <path d="M16.003 3C9.376 3 4 8.376 4 15.003c0 2.18.587 4.218 1.607 5.97L4 29l8.267-1.585A12.003 12.003 0 0 0 16.003 28c6.624 0 12-5.376 12-12.003C28.003 9.376 22.627 4 16.003 4zm.001 21.84c-1.863 0-3.594-.503-5.083-1.376l-.363-.216-4.908.94.957-4.802-.236-.374A9.845 9.845 0 0 1 5.17 15c0-5.426 4.411-9.838 9.835-9.838 5.424 0 9.835 4.412 9.835 9.838 0 5.426-4.41 9.84-9.836 9.84zm5.39-7.372c-.296-.148-1.748-.86-2.02-.958-.27-.098-.466-.148-.66.148-.195.297-.757.958-.928 1.154-.17.197-.34.222-.636.074-.296-.148-1.25-.46-2.38-1.47-.88-.784-1.473-1.752-1.645-2.048-.17-.295-.018-.455.13-.602.132-.133.296-.347.444-.52.148-.173.198-.297.297-.494.099-.197.05-.37-.025-.52-.074-.147-.66-1.59-.904-2.177-.238-.572-.48-.494-.66-.503l-.562-.01c-.197 0-.518.074-.79.37-.27.296-1.03 1.005-1.03 2.45 0 1.443 1.055 2.84 1.203 3.037.148.197 2.075 3.167 5.03 4.44.702.302 1.25.483 1.677.618.705.224 1.347.192 1.855.116.565-.085 1.748-.715 1.995-1.405.247-.69.247-1.28.173-1.403-.074-.124-.27-.197-.566-.345z"/>
                </svg>
              </button>
              <button
                onClick={() => navigate('https://www.webpay.transbank.cl', true)}
                className="bg-foreground text-background font-mono text-sm h-12 lg:h-14 px-6 flex-1 flex items-center justify-center gap-2 hover:bg-accent transition-colors group"
              >
                <span className="hidden sm:inline">FINALIZAR COMPRA</span>
                <span className="sm:hidden">PAGAR</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

        </aside>
      </div>

      <div className="pb-32 lg:pb-0">
        <Footer />
      </div>
    </div>
  );
}
