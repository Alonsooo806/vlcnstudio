import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, ChevronLeft, ArrowRight, ArrowLeft,
  CheckCircle2, Ruler, Droplets, Info, Plus, Minus,
  MessageCircle, X, Check, Save, Share2, Package, Eye,
  ShieldCheck, ArrowUpRight, MapPin, Upload, Mail, Send, FileImage,
  ShoppingCart, Trash2
} from 'lucide-react';
import { cartStore, type CartItem } from './cartStore';

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

const DELIVERY_COST = 2000; // CLP — costo fijo de delivery a domicilio en Temuco

const formatCLP = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

// ---------- COLORIZACIÓN REALISTA POR CANVAS ----------
// Discrimina píxeles neutros (camiseta) de píxeles cálidos/saturados (madera) por saturación HSV.
// Solo los píxeles con baja saturación (<0.28) reciben el tinte via multiply.
// El fondo de madera y cualquier elemento con color propio quedan completamente inalterados.
const SHIRT_BASE_SRC = 'generated_images/vlcn-shirt-blanco.png';
const _colorizeCache = new Map<string, string>(); // dataURL por hex — persiste entre renders

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

      // Blanco: no requiere tinte — camiseta ya es blanca
      if (colorHex === '#FFFFFF' || colorHex === '#ffffff') {
        const url = canvas.toDataURL('image/jpeg', 0.92);
        _colorizeCache.set(colorHex, url);
        resolve(url);
        return;
      }

      // Negro: usar casi-negro para preservar volumen 3D (no pitch-black total)
      const effectiveHex = colorHex === '#000000' ? '#141414' : colorHex;
      const cr = parseInt(effectiveHex.slice(1, 3), 16) / 255;
      const cg = parseInt(effectiveHex.slice(3, 5), 16) / 255;
      const cb = parseInt(effectiveHex.slice(5, 7), 16) / 255;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue;          // transparente: skip
        const pr = data[i], pg = data[i + 1], pb = data[i + 2];
        const maxCh = Math.max(pr, pg, pb);
        const minCh = Math.min(pr, pg, pb);
        // Saturación HSV: 0 = neutro (gris/blanco = tela), 1 = muy saturado (madera/color)
        const sat = maxCh === 0 ? 0 : (maxCh - minCh) / maxCh;

        if (sat < 0.28) {
          // Tela: aplicar multiply — preserva pliegues y sombras naturalmente
          data[i]     = Math.round(pr * cr);
          data[i + 1] = Math.round(pg * cg);
          data[i + 2] = Math.round(pb * cb);
        }
        // else: pixel de fondo (madera, borde, etc.) — se conserva sin modificación
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
// -------------------------------------------------------


const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

// Tabla de Escalamiento de Estampado (ancho x alto en cm sobre la prenda)
// Valores físicos reales según estándar americano (especificación oficial VLCN Studio)
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

// Ancho real de la prenda (a lo ancho de pecho, extendida) por talla, en cm.
const GARMENT_WIDTH_BY_TALLA: Record<string, number> = {
  S: 50,
  M: 52,
  L: 54,
  XL: 57,
  '2XL': 60,
};

// Regla de oro: el estampado "grande" ocupa siempre ~50-55% del ancho de la prenda,
// sin importar la talla, de modo que la presencia visual del diseño se perciba idéntica
// en todas las tallas (crece en cm absolutos, pero mantiene la misma proporción relativa).
// Esto también garantiza un margen libre de al menos 10cm a cada lado (costuras laterales).
const getPrintWidthRatio = (talla: string) => PRINT_DIMENSIONS_BY_TALLA[talla].w / GARMENT_WIDTH_BY_TALLA[talla];

// Escala relativa (ancho y alto) del estampado según talla, tomando Talla M (27x37cm) como referencia base.
// Se usa únicamente para el alto (que no está definido como % de la prenda), y mantiene el centro fijo.
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
  
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waForm, setWaForm] = useState({ intent: '', deadline: '', qty: '' });

  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');


  const [selectedColor, setSelectedColor] = useState('blanco');
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [showColorConfig, setShowColorConfig] = useState(true);

  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null);
  const [showNotaImportante, setShowNotaImportante] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [gmailModalOpen, setGmailModalOpen] = useState(false);
  const [colorActivelyChosen, setColorActivelyChosen] = useState(false);
  const [showScaleModal, setShowScaleModal] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => cartStore.get());

  // Mapa hex → dataURL de la camiseta coloreada por canvas
  const [colorizedUrls, setColorizedUrls] = useState<Record<string, string>>({});

  // Pre-computa todos los colores en segundo plano al montar
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
  // Multi-placement support
  const placements = PLACEMENTS.filter(p => selectedPlacements.includes(p.id));
  const placementsTotal = placements.reduce((sum, p) => sum + p.price, 0);
  const primaryPlacement = placements[0] || PLACEMENTS[0];
  const colorIndex = COLORS.findIndex(c => c.id === selectedColor);
  const currentColor = COLORS[colorIndex];
  const previewColor = COLORS.find(c => c.id === hoveredColor) || currentColor;
  const nextColor = () => setSelectedColor(COLORS[(colorIndex + 1) % COLORS.length].id);
  const viewerImg = previewColor.img;
  // El estampado de un diseño propio subido por el cliente siempre sigue la Tabla de Escalamiento
  // completa (S 25×35 … 2XL 33×43), sin excepción de tamaño fijo. La excepción de logo fijo
  // (10×10cm) sólo aplica al placement "pecho" cuando se usa un gráfico de catálogo pequeño.
  const isPechoLogoFijo = selectedPlacements.includes('pecho') && !uploadedDesign;
  const printMeasure = isPechoLogoFijo ? LOGO_PECHO_SIZE : PRINT_SIZE_BY_TALLA[size];
  const printScale = isPechoLogoFijo ? { x: 1, y: 1 } : getPrintScale(size);
  // Regla de oro: el ancho visible del estampado se mantiene siempre ~50-55% del ancho de la
  // prenda (constante en todas las tallas), dejando siempre ≥10cm libres a cada costura lateral.
  const printWidthRatioPct = getPrintWidthRatio(size) * 100;
  const printWidthPercent = isPechoLogoFijo
    ? 20 // logo fijo de catálogo (10×10cm), ancho de display constante independiente de la talla
    : primaryPlacement.id === 'pecho'
      ? printWidthRatioPct * 0.6
      : primaryPlacement.id === 'espalda'
        ? printWidthRatioPct
        : printWidthRatioPct * 0.4; // manga

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

  // --- HANDLERS ---
  const handleSaveConfig = () => {
    setSavedConfigs(prev => [...prev, { base, print, placements, size, quantity }]);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleGmailSend = () => {
    const subject = encodeURIComponent('Solicitud de diseño asistido');
    const placementLines = placements.map(p => `  · ${p.name}: ${formatCLP(p.price)}`).join('\n');
    const body = encodeURIComponent(
`Hola VLCN STUDIO 👋

Quiero realizar una solicitud para mi camiseta personalizada.

🎨 COLOR: ${currentColor.name}
📐 TALLA: ${size}
📦 CANTIDAD: ${quantity}

--- DESCRIPCIÓN DE LA IDEA ---
(Describe tu idea, logo o referencias aquí)

--- DETALLES TÉCNICOS ---
Ubicaciones seleccionadas:
${placementLines}
Total ubicaciones: ${formatCLP(placementsTotal)}
Fecha límite:
Uso:

Gracias!`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=alonsoovalentino%40gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    setGmailModalOpen(false);
  };

  const handleWAContact = (e: React.FormEvent) => {
    e.preventDefault();
    const placementNames = placements.map(p => p.name).join(', ') || 'Sin ubicación';
    const text = `Hola VLCN STUDIO. Me interesa una colaboración técnica.
- Uso: ${waForm.intent}
- Fecha límite: ${waForm.deadline}
- Cantidad aprox: ${waForm.qty}

Configuración actual: ${base.name} (${size}) + Print ${print.name} en ${placementNames}.`;
    
    window.open(`https://wa.me/1234567890?text=${encodeURIComponent(text)}`, '_blank');
    setWaModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white pb-32 lg:pb-0">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => { window.location.href = import.meta.env.BASE_URL; }}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-8 w-auto object-contain" />
          <h1 className="font-bold tracking-tighter text-xl">VLCN STUDIO</h1>
        </button>
        <div className="flex items-center gap-6 text-sm font-mono">
          <span className="hidden md:inline-flex text-muted-foreground">TALLER TÉCNICO V1.0</span>
          <button className="flex items-center gap-2 hover:text-accent transition-colors relative">
            <Save className="w-4 h-4" />
            <span>WISHLIST</span>
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
          onClick={() => { window.location.href = `${import.meta.env.BASE_URL}categorias`; }}
          className="flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs font-bold tracking-wider hover:bg-muted transition-colors"
        >
          ← VOLVER A CATEGORÍAS
        </button>
        <button
          onClick={() => { window.location.href = import.meta.env.BASE_URL; }}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 font-mono text-xs font-bold tracking-wider hover:bg-accent transition-colors"
        >
          ⌂ IR AL INICIO
        </button>
      </div>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed top-20 right-6 z-50 bg-foreground text-background px-4 py-3 shadow-2xl flex items-center gap-3 transition-all duration-300 transform ${showSavedToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <CheckCircle2 className="w-4 h-4 text-accent" />
        <span className="font-mono text-xs">CONFIGURACIÓN GUARDADA</span>
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start relative">
        
        {/* LEFT COLUMN: MAIN CONTENT */}
        <main className="w-full lg:w-[70%] lg:border-r border-border/40 min-h-screen">
          
          {/* WIZARD SECTION */}
          <section className="p-6 md:p-12 border-b border-border/40">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold tracking-tighter uppercase">Configurador</h2>
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className={step === 1 ? 'text-accent font-bold' : 'text-muted-foreground'}>01. BASE</span>
                <span className="text-muted-foreground">/</span>
                <span className={step === 2 ? 'text-accent font-bold' : 'text-muted-foreground'}>02. PRINT</span>
              </div>
            </div>

            {/* STEP 1: BASE SELECTION */}
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
                            {/* Crossfade fotorrealista entre colores */}
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
                                aria-label="Subir diseño desde galería o computador"
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

                      {/* NOTA IMPORTANTE — solo para la tarjeta de subida */}
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
                              ⚠ NOTA IMPORTANTE — REQUISITOS DE TU ARCHIVO
                            </span>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showNotaImportante ? 'rotate-90' : ''}`} />
                          </button>

                          {showNotaImportante && (
                            <div className="border border-accent/30 border-t-0 bg-accent/5 p-4 space-y-2.5">
                              <p className="text-xs font-medium leading-relaxed">
                                Tu diseño debe ser <strong className="text-foreground">PNG a 300 PPP</strong> (píxeles por pulgada) para garantizar un estampado nítido y profesional.
                              </p>
                              <ul className="text-xs text-muted-foreground space-y-1.5">
                                <li className="flex items-start gap-2"><Check className="w-3 h-3 text-accent shrink-0 mt-0.5" /><span>Formato: <strong className="text-foreground">PNG</strong> (sin pérdida de calidad)</span></li>
                                <li className="flex items-start gap-2"><Check className="w-3 h-3 text-accent shrink-0 mt-0.5" /><span>Resolución mínima: <strong className="text-foreground">300 DPI / 300 PPP</strong></span></li>
                                <li className="flex items-start gap-2"><Check className="w-3 h-3 text-accent shrink-0 mt-0.5" /><span>Fondo transparente recomendado</span></li>
                                <li className="flex items-start gap-2"><X className="w-3 h-3 text-red-400 shrink-0 mt-0.5" /><span>No JPG, capturas de pantalla ni imágenes pixeladas</span></li>
                                <li className="flex items-start gap-2"><X className="w-3 h-3 text-red-400 shrink-0 mt-0.5" /><span>Baja resolución = estampado borroso, sin excepciones</span></li>
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

            {/* STEP 2: SELECCIÓN DE UBICACIÓN */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> VOLVER A BASE
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Placement Selector — panel central rediseñado */}
                  <div>
                    <h3 className="font-mono text-sm text-muted-foreground mb-1">SELECCIONA UBICACIÓN</h3>
                    <p className="font-mono text-[10px] text-muted-foreground/70 mb-6">El costo varía según la zona de impresión.</p>

                    {/* Checkboxes multi-selección */}
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
                            {/* Checkbox cuadrado estilizado */}
                            <div
                              onClick={() => togglePlacement(p.id)}
                              className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer
                                ${isSelected ? 'border-accent bg-accent' : 'border-border group-hover:border-foreground/50'}`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>

                            <input
                              type="checkbox"
                              value={p.id}
                              checked={isSelected}
                              onChange={() => togglePlacement(p.id)}
                              className="sr-only"
                            />

                            {/* Label content */}
                            <div className="flex-1 min-w-0" onClick={() => togglePlacement(p.id)}>
                              <p className={`font-mono text-sm font-bold tracking-wider uppercase ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                                {p.name}
                              </p>
                              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{p.desc}</p>
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0" onClick={() => togglePlacement(p.id)}>
                              <p className={`font-mono text-base font-bold transition-colors ${isSelected ? 'text-accent' : 'text-foreground/70'}`}>
                                +{formatCLP(p.price)}
                              </p>
                              <p className="font-mono text-[10px] text-muted-foreground">CLP</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Acumulador de precio en tiempo real */}
                    <div className="mt-4 p-4 border border-border bg-muted/60">
                      <div className="space-y-1.5 mb-3">
                        <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
                          <span>PRENDA BASE</span>
                          <span>{formatCLP(base.price)}</span>
                        </div>
                        {PLACEMENTS.map(p => {
                          const sel = selectedPlacements.includes(p.id);
                          return (
                            <div key={p.id} className={`flex justify-between font-mono text-[11px] transition-all duration-200 ${sel ? 'text-accent font-bold' : 'text-muted-foreground/40 line-through'}`}>
                              <span>ESTAMPADO {p.name}</span>
                              <span>+{formatCLP(p.price)}</span>
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

                    {/* Botón CONFIRMAR ELECCIÓN */}
                    <button
                      onClick={() => {
                        if (selectedPlacements.length > 0) {
                          setPlacementsConfirmed(true);
                          setStep(1); // volver al configurador principal con selección guardada
                        }
                      }}
                      disabled={selectedPlacements.length === 0}
                      className={`mt-4 w-full py-4 px-6 font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-200 group
                        ${selectedPlacements.length > 0
                          ? placementsConfirmed
                            ? 'bg-accent text-white cursor-default'
                            : 'bg-foreground text-background hover:bg-accent'
                          : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        }`}
                    >
                      {placementsConfirmed
                        ? <><CheckCircle2 className="w-4 h-4" /> ELECCIÓN CONFIRMADA</>
                        : <><Check className="w-4 h-4" /> CONFIRMAR ELECCIÓN · {formatCLP(subtotal)} CLP</>
                      }
                    </button>
                    {selectedPlacements.length === 0 && (
                      <p className="mt-2 font-mono text-[10px] text-muted-foreground text-center">Selecciona al menos una ubicación para continuar.</p>
                    )}
                  </div>

                  {/* Panel derecho: resumen técnico de la ubicación */}
                  <div>
                    <h3 className="font-mono text-sm text-muted-foreground mb-6">UBICACIÓN TÉCNICA</h3>

                    {/* Cards de zonas seleccionadas */}
                    {selectedPlacements.length === 0 ? (
                      <div className="border border-dashed border-border p-6 text-center">
                        <p className="font-mono text-xs text-muted-foreground">Ninguna zona seleccionada.<br />Marca una o más opciones a la izquierda.</p>
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

                    {/* Tabla con estado visual de todas las opciones */}
                    <div className="space-y-0 border border-border/40">
                      {PLACEMENTS.map((p, i) => {
                        const sel = selectedPlacements.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            className={`flex items-center justify-between px-4 py-3 font-mono text-xs transition-all duration-200
                              ${sel ? 'bg-accent/10 text-foreground' : 'text-muted-foreground'}
                              ${i < PLACEMENTS.length - 1 ? 'border-b border-border/40' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              {sel
                                ? <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                                : <div className="w-3.5 h-3.5 border border-border/60 shrink-0" />
                              }
                              <span className={`font-bold uppercase tracking-wider ${sel ? '' : 'line-through opacity-50'}`}>{p.name}</span>
                            </div>
                            <span className={sel ? 'text-accent font-bold' : 'opacity-40'}>{formatCLP(p.price)}</span>
                          </div>
                        );
                      })}
                      {/* Fila de total */}
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
                          <p className="text-xs text-muted-foreground leading-relaxed">Cada impresión es curada a 160°C y revisada bajo luz industrial. Adherencia y fidelidad de color garantizadas.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {showColorConfig && (
          <section className="p-6 md:p-12 border-b border-border/40 bg-[#FAFAFA]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* High Fidelity Viewer — crossfade fotorrealista entre colores + overlay de diseño */}
              <div className="relative group overflow-hidden border border-border aspect-[4/5] bg-white cursor-crosshair">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none">
                  <div className="bg-background/80 backdrop-blur font-mono text-[10px] px-3 py-1 border border-border">INSPECCIÓN X-RAY</div>
                </div>
                {/* Todas las imágenes apiladas — crossfade suave al cambiar color */}
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

                {/* ── OVERLAY DE DISEÑO ESTAMPADO ──────────────────────────────────
                    Solo aparece tras subir un archivo. Se posiciona sobre el pecho
                    del maniquí, centrado, escalado a las medidas físicas de la talla.
                    Los cambios de color de la prenda no afectan este layer. */}
                {uploadedDesign ? (
                  <div
                    className="absolute z-20 transition-all duration-300 pointer-events-none"
                    style={{
                      width: `${printWidthPercent}%`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: '30%',   // posición del pecho en el encuadre del maniquí
                    }}
                  >
                    {/* El padding-bottom define la altura proporcional a las medidas físicas */}
                    <div
                      style={{
                        width: '100%',
                        paddingBottom: `${(PRINT_DIMENSIONS_BY_TALLA[size].h / PRINT_DIMENSIONS_BY_TALLA[size].w) * 100}%`,
                        position: 'relative',
                      }}
                    >
                      <img
                        src={uploadedDesign}
                        alt="Tu diseño estampado"
                        className="absolute inset-0 w-full h-full object-contain drop-shadow-sm"
                        draggable={false}
                      />
                    </div>
                  </div>
                ) : selectedBase === 'longsleeve' ? (
                  /* Placeholder visible cuando se eligió "SUBE TU DISEÑO" pero aún no se subió */
                  <div className="absolute z-20 inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-black/60 text-white font-mono text-[11px] px-4 py-2 rounded text-center leading-relaxed">
                      <Upload className="w-5 h-5 mx-auto mb-1 opacity-80" />
                      SUBE TU DISEÑO<br />para previsualizar el estampado
                    </div>
                  </div>
                ) : null}
                {/* ────────────────────────────────────────────────────────────── */}
              </div>

              {/* Technical Specs & Sizing */}
              <div>
                {/* === BOTÓN GMAIL — solo para Camiseta Manga Corta === */}
                {/* ── CTA DISEÑO ASISTIDO ─────────────────────────────── */}
                <div className="mb-8">
                  {!colorActivelyChosen ? (
                    /* Estado bloqueado: el usuario aún no eligió color */
                    <div className="border-2 border-dashed border-border p-5 text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Enviar especificaciones por Gmail
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                        Elige tu color en la sección de abajo<br />para habilitar este botón.
                      </p>
                      <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-muted-foreground/60">
                        <span className="w-6 h-px bg-border" />
                        Paso 1: Color → Paso 2: Enviar
                        <span className="w-6 h-px bg-border" />
                      </div>
                    </div>
                  ) : (
                    /* Estado activo: color elegido */
                    <>
                      <button
                        onClick={() => setGmailModalOpen(true)}
                        className="w-full flex items-center justify-between gap-4 px-6 py-5 font-mono text-sm uppercase tracking-widest bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all duration-200 group"
                        aria-label="Enviar especificaciones por Gmail"
                      >
                        <span className="flex items-center gap-3">
                          <Mail className="w-5 h-5 shrink-0" />
                          Enviar especificaciones por Gmail
                        </span>
                        <Send className="w-4 h-4 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                      <p className="font-mono text-[10px] text-accent mt-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Color confirmado: <strong>{currentColor.name}</strong> · Pulsa para describir tu diseño
                      </p>
                    </>
                  )}
                </div>
                {/* ─────────────────────────────────────────────────────── */}

                <h2 className="text-3xl font-bold tracking-tighter uppercase mb-8">Especificaciones</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex gap-4 items-start border-b border-border/50 pb-4">
                    <Droplets className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div>
                      <h4 className="font-mono text-xs font-bold mb-1">ESTAMPADO PERSONALIZADO</h4>
                      <p className="text-sm">Serigrafía Alta Densidad / DTF Industrial. Estabilidad dimensional garantizada &lt;3% de encogimiento tras 50 lavados.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start border-b border-border/50 pb-4">
                    <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div>
                      <h4 className="font-mono text-xs font-bold mb-1">RESISTENCIA</h4>
                      <p className="text-sm">Curado a 160°C. Resiste fricción mecánica y lavados abrasivos sin craquelado prematuro.</p>
                    </div>
                  </div>
                </div>

                {selectedBase === 'tee' && (
                  <div className="mb-10">
                    <h4 className="font-mono text-xs font-bold mb-4">ELIGE TU COLOR:</h4>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex gap-3">
                        {COLORS.map(c => (
                          <button
                            key={c.id}
                            onClick={() => { setSelectedColor(c.id); setColorActivelyChosen(true); }}
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
                        <span
                          className="w-12 h-12 rounded-full border border-border/60 shadow-sm"
                          style={{ backgroundColor: currentColor.hex }}
                        />
                        <p className="font-mono text-sm font-bold">COLOR: {currentColor.name}</p>
                      </div>
                    </div>
                    {colorActivelyChosen && (
                      <p className="mt-3 font-mono text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-accent" />
                        Color seleccionado. Ahora pulsa <span className="font-bold text-foreground">"Enviar especificaciones por Gmail"</span> arriba.
                      </p>
                    )}
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-4">
                    <h4 className="font-mono text-xs font-bold">SELECCIÓN DE TALLA (EU)</h4>
                    <button
                      onClick={() => setShowScaleModal(true)}
                      className="flex items-center gap-1 font-mono text-[10px] text-accent hover:underline"
                    >
                      <Ruler className="w-3 h-3" /> VER DETALLE DE ESCALA
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
                    <span>
                      TALLA {size} — MEDIDA DEL ESTAMPADO{isPechoLogoFijo ? ' (pecho)' : ''}: <span className="font-bold text-foreground">{printMeasure}</span>
                    </span>
                  </div>
                  {/* Nota A3 para tallas XL y 2XL */}
                  {PRINT_DIMENSIONS_BY_TALLA[size]?.requiresA3 && (
                    <div className="mt-2 flex items-start gap-2 p-2 border border-accent/30 bg-accent/5 font-mono text-[10px] text-accent">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Talla {size}: requiere plancha A3 o superior para producción. Consulta disponibilidad con el taller.</span>
                    </div>
                  )}
                  <div className="mt-2 font-mono text-[10px] text-muted-foreground/80 leading-relaxed">
                    S: 25×35 cm · M: 28×38 cm · L: 30×40 cm · XL: 32×42 cm · 2XL: 35×45 cm · Logo pecho: 10×10 cm
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-muted-foreground/60 leading-relaxed">
                    El estampado ocupa ~{printWidthRatioPct.toFixed(0)}% del ancho de la prenda en talla {size} — proporción constante en todas las tallas, con margen libre a cada costura.
                  </div>
                </div>

                {/* NAVEGACIÓN DE RETORNO */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/40">
                  <button
                    onClick={() => { window.location.href = `${import.meta.env.BASE_URL}categorias`; }}
                    className="flex-1 flex items-center justify-center gap-2 border border-border py-3 font-mono text-xs font-bold tracking-wider hover:bg-muted transition-colors"
                  >
                    ← VOLVER A CATEGORÍAS
                  </button>
                  <button
                    onClick={() => { window.location.href = import.meta.env.BASE_URL; }}
                    className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3 font-mono text-xs font-bold tracking-wider hover:bg-accent transition-colors"
                  >
                    ⌂ IR AL INICIO
                  </button>
                </div>

              </div>
            </div>
          </section>
          )}

          {/* ESTADO DE MI COLABORACIÓN (CUSTOMER DASHBOARD) */}
          <section className="p-6 md:p-12 border-b border-border/40">
            <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Flujo de Producción</h2>
            <p className="text-muted-foreground mb-12">Monitoreo transparente de tu encargo en nuestro taller.</p>
            
            <div className="relative">
              {/* Line connector */}
              <div className="absolute left-[15px] md:left-[50%] top-0 bottom-0 w-px bg-border/50 md:-translate-x-1/2"></div>
              
              <div className="space-y-8 relative">
                {[
                  { state: 'Solicitud Recibida', desc: 'Confirmación de especificaciones y pago.', date: 'HOY', active: true, done: true },
                  { state: 'Impresión & Curado', desc: 'Ejecución en taller. Espera en fila de producción.', date: 'ESTIMADO: +2 DÍAS', active: true, done: false },
                  { state: 'Control de Calidad', desc: 'Inspección lumínica y estrés térmico.', date: 'PENDIENTE', active: false, done: false },
                  { state: 'Despacho CERRADO', desc: 'Generación de tracking y empaque sellado.', date: 'PENDIENTE', active: false, done: false },
                ].map((s, i) => (
                  <div key={i} className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-12 w-full ${!s.active && 'opacity-50 grayscale'}`}>
                    <div className="md:w-1/2 flex justify-end text-left md:text-right pl-12 md:pl-0">
                      <div>
                        <h4 className="font-bold uppercase tracking-tight">{s.state}</h4>
                        <p className="text-sm text-muted-foreground hidden md:block">{s.desc}</p>
                      </div>
                    </div>
                    
                    {/* Node */}
                    <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_hsl(var(--background))]">
                      {s.done ? (
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                      ) : s.active ? (
                        <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-2 h-2 bg-border rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="md:w-1/2 text-left pl-12 md:pl-0">
                      <span className="font-mono text-xs bg-muted px-2 py-1 border border-border/50">{s.date}</span>
                      <p className="text-sm text-muted-foreground block md:hidden mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RESEÑAS CURADAS */}
          <section className="p-6 md:p-12">
            <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Desgaste Real</h2>
            <p className="text-muted-foreground mb-12 max-w-xl">No escondemos el paso del tiempo. Así se ven nuestras impresiones industriales tras meses de uso continuo y lavados abrasivos.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative overflow-hidden border border-border">
                <div className="absolute top-4 left-4 bg-background/90 px-3 py-1 font-mono text-[10px] z-10 border border-border">50+ LAVADOS</div>
                <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-review-wear.jpg`} alt="Wear Detail" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="p-4 bg-muted border-t border-border">
                  <p className="text-sm italic">"El degradado natural que toma el estampado le da más carácter. Ningún craquelado estructural."</p>
                  <p className="font-mono text-xs mt-2 font-bold">— TEST 01 / CLIENTE A.</p>
                </div>
              </div>
              <div className="group relative overflow-hidden border border-border md:translate-y-12">
                <div className="absolute top-4 left-4 bg-background/90 px-3 py-1 font-mono text-[10px] z-10 border border-border">USO DIARIO (6 MESES)</div>
                <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-review-editorial.jpg`} alt="Editorial Wear" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="p-4 bg-muted border-t border-border">
                  <p className="text-sm italic">"La tela se suaviza pero el fit cuadrado se mantiene intacto. El cuello no ha cedido ni un milímetro."</p>
                  <p className="font-mono text-xs mt-2 font-bold">— TEST 02 / ESTUDIO M.</p>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* RIGHT COLUMN: STICKY PRICE TRACKER (Sidebar on Desktop, Footer on Mobile) */}
        <aside className="w-full lg:w-[30%] lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] border-t lg:border-t-0 border-border/40 bg-background lg:bg-transparent fixed bottom-0 left-0 z-40 p-6 flex flex-col justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:shadow-none">
          
          <div className="hidden lg:block space-y-6 flex-1 overflow-y-auto pr-2 pb-6">
            <h3 className="font-mono text-sm text-muted-foreground border-b border-border pb-4">RESUMEN TÉCNICO</h3>

            {/* ── CARRITO DE CATÁLOGO ───────────────────────── */}
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
                    title="Vaciar carrito"
                  >
                    <Trash2 className="w-3 h-3" /> VACIAR
                  </button>
                </div>

                <div className="space-y-0 border border-border/40">
                  {cartItems.map((item, idx) => (
                    <div
                      key={`${item.id}-${item.talla}`}
                      className={`flex items-start gap-3 px-3 py-2.5 ${idx < cartItems.length - 1 ? 'border-b border-border/40' : ''}`}
                    >
                      {/* Swatch de color de la categoría */}
                      <div className="w-2 self-stretch rounded-full shrink-0 mt-0.5" style={{ background: item.accentHex }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[11px] font-bold leading-snug truncate text-foreground">{item.titulo}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          Talla <span className="font-bold">{item.talla}</span> · ×{item.cantidad}
                          {item.emoji ? ` ${item.emoji}` : ''}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <p className="font-mono text-[11px] font-bold" style={{ color: item.accentHex }}>
                          {formatCLP(item.precio * item.cantidad)}
                        </p>
                        <button
                          onClick={() => { cartStore.remove(item.id, item.talla); setCartItems(cartStore.get()); }}
                          className="text-muted-foreground hover:text-red-400 transition-colors"
                          title="Quitar"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Fila total */}
                  <div className="flex items-center justify-between px-3 py-2.5 bg-accent/10">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">SUBTOTAL CATÁLOGO</span>
                    <span className="font-mono text-sm font-bold text-accent">
                      {formatCLP(cartItems.reduce((s, i) => s + i.precio * i.cantidad, 0))}
                    </span>
                  </div>
                </div>

                <p className="font-mono text-[10px] text-muted-foreground mt-2.5 leading-relaxed">
                  Estos productos se suman a tu configuración actual para el pedido final.
                </p>
              </div>
            )}

            {cartItems.length === 0 && (
              <div className="border border-dashed border-border/40 p-4 text-center">
                <ShoppingCart className="w-5 h-5 text-muted-foreground/40 mx-auto mb-2" />
                <p className="font-mono text-[10px] text-muted-foreground/50 leading-relaxed">
                  Agrega productos desde las<br />categorías para verlos aquí.
                </p>
              </div>
            )}
            {/* ─────────────────────────────────────────────── */}

            {/* Summary Items */}
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
                    {placements.length > 1 && (
                      <div className="flex justify-between items-center border-t border-border/40 pt-1 mt-1">
                        <p className="font-mono text-[10px] text-muted-foreground">SUBTOTAL UBICACIONES</p>
                        <p className="font-mono text-xs font-bold text-accent">+{formatCLP(placementsTotal)}</p>
                      </div>
                    )}
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

            {/* Método de Envío */}
            <div className="pt-4 border-t border-border space-y-3 mt-6">
              <p className="font-mono text-[10px] text-muted-foreground mb-2 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> MÉTODO DE ENVÍO
              </p>

              {/* Opción A — Punto de encuentro (gratis) */}
              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-all duration-200 ${
                  deliveryMethod === 'pickup'
                    ? 'border-accent bg-accent/5 ring-1 ring-accent/40'
                    : 'border-border hover:border-foreground/40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      deliveryMethod === 'pickup' ? 'border-accent' : 'border-border'
                    }`}
                    onClick={() => setDeliveryMethod('pickup')}
                  >
                    {deliveryMethod === 'pickup' && (
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    )}
                  </div>
                </div>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                  className="sr-only"
                />
                <div className="flex-1 min-w-0" onClick={() => setDeliveryMethod('pickup')}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider">Entrega en Centro (Gratis)</p>
                    <span className="font-mono text-sm font-bold text-accent shrink-0">$0</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    Punto de encuentro seguro en Temuco Centro (ej: Plaza de Armas). Coordinaremos fecha y hora por WhatsApp tras confirmar tu pedido.
                  </p>
                </div>
              </label>

              {/* Opción B — Delivery a domicilio ($2.000) */}
              <label
                className={`flex items-start gap-3 p-4 border cursor-pointer transition-all duration-200 ${
                  deliveryMethod === 'delivery'
                    ? 'border-accent bg-accent/5 ring-1 ring-accent/40'
                    : 'border-border hover:border-foreground/40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      deliveryMethod === 'delivery' ? 'border-accent' : 'border-border'
                    }`}
                    onClick={() => setDeliveryMethod('delivery')}
                  >
                    {deliveryMethod === 'delivery' && (
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    )}
                  </div>
                </div>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={() => setDeliveryMethod('delivery')}
                  className="sr-only"
                />
                <div className="flex-1 min-w-0" onClick={() => setDeliveryMethod('delivery')}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider">Delivery a Domicilio (Temuco)</p>
                    <span className="font-mono text-sm font-bold shrink-0">+{formatCLP(DELIVERY_COST)}</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    Delivery disponible para radios urbanos de Temuco. Si tu dirección es fuera del radio, te contactaremos para coordinar envío por pagar.
                  </p>
                </div>
              </label>

              {/* Política de seguridad de pago */}
              <div className="flex items-start gap-2 p-3 border border-border/60 bg-muted/60">
                <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">Nota:</span> Para asegurar la eficiencia de nuestro servicio, los pedidos deben estar pagados vía transferencia antes de coordinar la entrega o despacho.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile minimal view & Desktop total */}
          <div className="flex lg:flex-col items-center lg:items-stretch justify-between gap-4 lg:gap-6 lg:border-t lg:border-border lg:pt-6 bg-background">
            <div className="flex-1 lg:flex-none">
              <p className="font-mono text-[10px] text-muted-foreground hidden lg:block mb-1">TOTAL ESTIMADO</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter">{formatCLP(total)}</span>
                <span className="font-mono text-xs text-muted-foreground">CLP</span>
              </div>
              <p className="text-[10px] text-muted-foreground lg:hidden">Base + Impresión {deliveryMethod === 'delivery' ? `+ Delivery ${formatCLP(DELIVERY_COST)}` : '+ Punto de encuentro gratis'}</p>
            </div>
            
            <div className="flex gap-2 flex-col lg:flex-row lg:w-full w-auto">
              <button 
                onClick={handleSaveConfig}
                className="p-4 border border-border hover:border-foreground flex items-center justify-center transition-colors lg:w-16 w-12 h-12 lg:h-auto shrink-0"
                title="Guardar Configuración"
              >
                <Save className="w-5 h-5" />
              </button>
              <button onClick={() => { window.location.href = 'https://www.webpay.transbank.cl'; }} className="bg-foreground text-background font-mono text-sm h-12 lg:h-14 px-6 flex-1 flex items-center justify-center gap-2 hover:bg-accent transition-colors group">
                <span className="hidden sm:inline">FINALIZAR COMPRA</span>
                <span className="sm:hidden">PAGAR</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

        </aside>

      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <button 
        onClick={() => setWaModalOpen(true)}
        className="fixed bottom-32 right-6 lg:bottom-8 lg:right-[32%] z-50 bg-foreground text-background p-4 rounded-full shadow-2xl hover:bg-accent transition-transform hover:scale-110 active:scale-95 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-mono px-3 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded">Asesoría Directa</span>
      </button>

      {/* GMAIL ESPECIFICACIONES MODAL — Camiseta Manga Corta · Diseño asistido por texto */}
      {gmailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setGmailModalOpen(false)} />

          <div className="relative bg-background border border-border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-accent text-white">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0" />
                <div>
                  <h3 className="font-mono font-bold text-sm uppercase tracking-widest leading-none">Diseño asistido por correo</h3>
                  <p className="text-[11px] opacity-75 mt-1">Exclusivo para solicitudes de diseño asistido · Sin subir archivos</p>
                </div>
              </div>
              <button onClick={() => setGmailModalOpen(false)} className="opacity-70 hover:opacity-100 transition-opacity ml-4 shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Resumen de selección */}
              <div className="bg-muted border border-border/50 p-4">
                <p className="font-mono text-[10px] text-muted-foreground mb-3 uppercase tracking-widest">Tu selección</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div
                      className="w-9 h-9 rounded-full mx-auto mb-1.5 border-2 border-accent shadow-sm"
                      style={{ backgroundColor: currentColor.hex === '#FFFFFF' ? '#f3f4f6' : currentColor.hex }}
                    />
                    <p className="font-mono text-[10px] text-muted-foreground">COLOR</p>
                    <p className="font-mono text-[11px] font-bold">{currentColor.name}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-9 h-9 rounded-full mx-auto mb-1.5 border-2 border-border bg-background flex items-center justify-center">
                      <span className="font-mono text-sm font-bold">{size}</span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">TALLA</p>
                    <p className="font-mono text-[11px] font-bold">{size}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-9 h-9 rounded-full mx-auto mb-1.5 border-2 border-border bg-background flex items-center justify-center">
                      <span className="font-mono text-sm font-bold">{quantity}</span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">CANTIDAD</p>
                    <p className="font-mono text-[11px] font-bold">{quantity} ud.</p>
                  </div>
                </div>
              </div>

              {/* Pasos */}
              <div className="space-y-3">
                {[
                  { n: '1', text: <>Se abrirá tu correo con el asunto <strong className="text-foreground">"Solicitud de diseño asistido"</strong> y tus datos pre-cargados.</> },
                  { n: '2', text: 'Describe tu idea en palabras: logo, personaje, frase, estilo, colores, referencias, etc.' },
                  { n: '3', text: 'Nuestro equipo te responde con un boceto previo. Sin subir archivos, sin formularios.' },
                ].map(({ n, text }) => (
                  <div key={n} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-mono text-xs font-bold text-accent">{n}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug">{text}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={handleGmailSend}
                className="w-full bg-accent text-white font-mono text-sm py-4 px-6 uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent/90 transition-colors group"
              >
                <Mail className="w-5 h-5" />
                Abrir Gmail y describir mi idea
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <p className="text-center font-mono text-[10px] text-muted-foreground">
                alonsoovalentino@gmail.com
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETALLE DE ESCALA POR TALLA */}
      {showScaleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowScaleModal(false)} />
          <div className="relative bg-background border border-border w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ruler className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <h3 className="font-mono font-bold text-sm uppercase tracking-widest leading-none">Detalle de Escala de Estampado</h3>
                  <p className="text-[11px] text-muted-foreground mt-1">Medidas físicas reales sobre la prenda · Estándar americano (cm)</p>
                </div>
              </div>
              <button onClick={() => setShowScaleModal(false)} className="text-muted-foreground hover:text-foreground ml-4 shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Diagrama visual de barras proporcionales */}
              <div className="space-y-3">
                {SIZES.map(s => {
                  const dims = PRINT_DIMENSIONS_BY_TALLA[s];
                  const isActive = s === size;
                  // Ancho relativo: 2XL = 100%, S proporcional
                  const maxW = PRINT_DIMENSIONS_BY_TALLA['2XL'].w;
                  const barW = (dims.w / maxW) * 100;
                  return (
                    <div key={s}>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`font-mono text-xs w-8 shrink-0 font-bold ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>{s}</span>
                        {/* Barra proporcional al ancho físico */}
                        <div className="flex-1 bg-muted h-8 relative overflow-hidden border border-border/40">
                          <div
                            className={`h-full flex items-center justify-end pr-2 transition-all duration-300 ${isActive ? 'bg-accent text-white' : 'bg-foreground/15 text-foreground'}`}
                            style={{ width: `${barW}%` }}
                          >
                            <span className="font-mono text-[10px] font-bold whitespace-nowrap">{dims.w}×{dims.h} cm</span>
                          </div>
                        </div>
                        {dims.requiresA3 && (
                          <span className="font-mono text-[9px] text-accent border border-accent/40 px-1.5 py-0.5 shrink-0">A3</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Leyenda */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-start gap-2 font-mono text-[10px] text-muted-foreground">
                  <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span>El estampado crece en medidas absolutas con cada talla, pero mantiene siempre la misma proporción visual relativa a la prenda (~50–55% del ancho del pecho).</span>
                </div>
                <div className="flex items-start gap-2 font-mono text-[10px] text-muted-foreground">
                  <span className="font-bold text-accent shrink-0">A3</span>
                  <span>Tallas XL y 2XL requieren plancha de transferencia A3 o superior. Consulta disponibilidad con el taller antes de confirmar el pedido.</span>
                </div>
                <div className="flex items-start gap-2 font-mono text-[10px] text-muted-foreground">
                  <span className="font-bold text-foreground shrink-0">Logo</span>
                  <span>Logotipos o gráficos pequeños en zona pecho (sin diseño subido): medida fija 10×10 cm en todas las tallas.</span>
                </div>
              </div>

              {/* Talla actualmente seleccionada */}
              <div className={`p-4 border-2 border-accent bg-accent/5`}>
                <p className="font-mono text-[10px] text-muted-foreground mb-1 uppercase tracking-widest">Tu talla seleccionada</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-bold text-accent">{size}</span>
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-foreground">{PRINT_DIMENSIONS_BY_TALLA[size].w} × {PRINT_DIMENSIONS_BY_TALLA[size].h} cm</p>
                    <p className="font-mono text-[10px] text-muted-foreground">ancho × alto de estampado</p>
                  </div>
                </div>
                {PRINT_DIMENSIONS_BY_TALLA[size]?.requiresA3 && (
                  <p className="mt-2 font-mono text-[10px] text-accent flex items-center gap-1.5">
                    <Info className="w-3 h-3" /> Esta talla requiere plancha A3 o superior
                  </p>
                )}
              </div>

              <button
                onClick={() => setShowScaleModal(false)}
                className="w-full bg-foreground text-background font-mono text-sm py-3 hover:bg-accent transition-colors"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP PRE-FILTER MODAL */}
      {waModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setWaModalOpen(false)}></div>
          
          <div className="relative bg-background border border-border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <h3 className="font-mono font-bold text-sm uppercase">Filtro de Recepción</h3>
              </div>
              <button onClick={() => setWaModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleWAContact} className="p-6 space-y-6">
              <p className="text-sm text-muted-foreground">Para optimizar nuestra comunicación y tiempos de respuesta, por favor responde 3 preguntas rápidas antes de generar el enlace de WhatsApp.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase font-bold">1. ¿Propósito del encargo?</label>
                  <select 
                    required
                    className="w-full p-3 border border-border bg-transparent focus:outline-none focus:border-accent font-mono text-sm"
                    value={waForm.intent}
                    onChange={e => setWaForm({...waForm, intent: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Uso Personal">Uso Personal</option>
                    <option value="Regalo">Regalo</option>
                    <option value="Merchandising Marca">Merchandising Marca / Uniforme</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase font-bold">2. ¿Fecha límite estimada?</label>
                  <select 
                    required
                    className="w-full p-3 border border-border bg-transparent focus:outline-none focus:border-accent font-mono text-sm"
                    value={waForm.deadline}
                    onChange={e => setWaForm({...waForm, deadline: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Sin apuro (> 2 semanas)">Sin apuro (Más de 2 semanas)</option>
                    <option value="Normal (1-2 semanas)">Normal (1-2 semanas)</option>
                    <option value="Urgente (< 1 semana)">Urgente (Menos de 1 semana)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase font-bold">3. Cantidad aproximada</label>
                  <select 
                    required
                    className="w-full p-3 border border-border bg-transparent focus:outline-none focus:border-accent font-mono text-sm"
                    value={waForm.qty}
                    onChange={e => setWaForm({...waForm, qty: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="1-5 unidades">1 a 5 unidades</option>
                    <option value="6-20 unidades">6 a 20 unidades</option>
                    <option value="20+ unidades">Más de 20 unidades</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="w-full bg-accent text-white font-mono text-sm p-4 hover:bg-accent/90 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                Conectar vía WhatsApp <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}