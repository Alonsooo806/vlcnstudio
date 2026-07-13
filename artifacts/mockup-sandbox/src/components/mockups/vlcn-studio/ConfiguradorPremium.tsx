import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, ArrowRight, ArrowLeft,
  CheckCircle2, Ruler, Droplets, Info, Plus, Minus,
  MessageCircle, X, Check, Save, Share2, Package, Eye,
  ShieldCheck, ArrowUpRight, MapPin, Upload, Mail, Send
} from 'lucide-react';

// --- MOCK DATA ---
const BASES = [
  { 
    id: 'tee', 
    name: 'CAMISETA MANGA CORTA', 
    price: 4000, 
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
  { id: 'negro', name: 'NEGRO', hex: '#000000', img: `generated_images/vlcn-emerald-negro.png` },
  { id: 'blanco', name: 'BLANCO', hex: '#FFFFFF', img: `generated_images/vlcn-emerald-blanco.png` },
  { id: 'rojo', name: 'ROJO', hex: '#DC2626', img: `generated_images/vlcn-emerald-rojo.png` },
  { id: 'naranjo', name: 'NARANJO', hex: '#F97316', img: `generated_images/vlcn-emerald-naranjo.png` },
  { id: 'amarillo', name: 'AMARILLO', hex: '#EAB308', img: `generated_images/vlcn-emerald-amarillo.png` },
  { id: 'verde', name: 'VERDE', hex: '#16A34A', img: `generated_images/vlcn-emerald-verde.png` },
  { id: 'azul', name: 'AZUL', hex: '#2563EB', img: `generated_images/vlcn-emerald-azul.png` },
  { id: 'violeta', name: 'VIOLETA', hex: '#7C3AED', img: `generated_images/vlcn-emerald-violeta.png` },
];

const PRINTS = [
  { id: 'brutalist', name: 'BRUTALIST ARCHIVE', img: `generated_images/vlcn-print-brutalist.jpg` },
  { id: 'schematic', name: 'CYBER SCHEMATIC', img: `generated_images/vlcn-print-schematic.jpg` }
];

const PLACEMENTS = [
  { id: 'pecho', name: 'PECHO' },
  { id: 'espalda', name: 'ESPALDA' },
  { id: 'manga', name: 'MANGA' }
];

const PRINT_PRICE = 6000;

const COMUNAS_TEMUCO = [
  'Centro',
  'Pedro de Valdivia',
  'Amanecer',
  'Labranza',
  'Pueblo Nuevo',
  'Santa Rosa',
  'Miraflores',
  'Ñielol'
];

const SHIPPING_TIERS = [
  { min: 1, max: 2, price: 3100 },
  { min: 3, max: 10, price: 3650 },
  { min: 11, max: 20, price: 4700 }
];

const formatCLP = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

const getShippingCost = (qty: number) => {
  const tier = SHIPPING_TIERS.find(t => qty >= t.min && qty <= t.max);
  if (tier) return tier.price;
  return qty > 20 ? SHIPPING_TIERS[SHIPPING_TIERS.length - 1].price : SHIPPING_TIERS[0].price;
};

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

// Tabla de Escalamiento de Estampado (ancho x alto en cm sobre la prenda)
const PRINT_DIMENSIONS_BY_TALLA: Record<string, { w: number; h: number }> = {
  S: { w: 25, h: 35 },
  M: { w: 27, h: 37 },
  L: { w: 29, h: 39 },
  XL: { w: 31, h: 41 },
  '2XL': { w: 33, h: 43 },
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
  const [selectedPlacement, setSelectedPlacement] = useState(PLACEMENTS[0].id);
  const [size, setSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  
  const [savedConfigs, setSavedConfigs] = useState<any[]>([]);
  const [showSavedToast, setShowSavedToast] = useState(false);
  
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waForm, setWaForm] = useState({ intent: '', deadline: '', qty: '' });

  const [city, setCity] = useState<'temuco' | 'otra'>('temuco');
  const [comuna, setComuna] = useState('');


  const [selectedColor, setSelectedColor] = useState('blanco');
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [showColorConfig, setShowColorConfig] = useState(true);

  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [gmailModalOpen, setGmailModalOpen] = useState(false);
  const [colorActivelyChosen, setColorActivelyChosen] = useState(false);

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
  const placement = PLACEMENTS.find(p => p.id === selectedPlacement)!;
  const colorIndex = COLORS.findIndex(c => c.id === selectedColor);
  const currentColor = COLORS[colorIndex];
  const previewColor = COLORS.find(c => c.id === hoveredColor) || currentColor;
  const nextColor = () => setSelectedColor(COLORS[(colorIndex + 1) % COLORS.length].id);
  const viewerImg = previewColor.img;
  // El estampado de un diseño propio subido por el cliente siempre sigue la Tabla de Escalamiento
  // completa (S 25×35 … 2XL 33×43), sin excepción de tamaño fijo. La excepción de logo fijo
  // (10×10cm) sólo aplica al placement "pecho" cuando se usa un gráfico de catálogo pequeño.
  const isPechoLogoFijo = selectedPlacement === 'pecho' && !uploadedDesign;
  const printMeasure = isPechoLogoFijo ? LOGO_PECHO_SIZE : PRINT_SIZE_BY_TALLA[size];
  const printScale = isPechoLogoFijo ? { x: 1, y: 1 } : getPrintScale(size);
  // Regla de oro: el ancho visible del estampado se mantiene siempre ~50-55% del ancho de la
  // prenda (constante en todas las tallas), dejando siempre ≥10cm libres a cada costura lateral.
  const printWidthRatioPct = getPrintWidthRatio(size) * 100;
  const printWidthPercent = isPechoLogoFijo
    ? 20 // logo fijo de catálogo (10×10cm), ancho de display constante independiente de la talla
    : selectedPlacement === 'pecho'
      ? printWidthRatioPct * 0.6
      : selectedPlacement === 'espalda'
        ? printWidthRatioPct
        : printWidthRatioPct * 0.4; // manga
  
  const unitPrice = base.price + PRINT_PRICE;
  const subtotal = unitPrice * quantity;
  const isOutsideTemuco = city === 'otra';
  const shipping = isOutsideTemuco ? getShippingCost(quantity) : 0;
  const total = subtotal + shipping;

  // --- HANDLERS ---
  const handleSaveConfig = () => {
    setSavedConfigs(prev => [...prev, { base, print, placement, size, quantity }]);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleGmailSend = () => {
    const subject = encodeURIComponent('Envía tu diseño, petición o idea');
    const body = encodeURIComponent(
`Hola VLCN STUDIO 👋

Quiero hacer una solicitud de diseño asistido para mi camiseta personalizada.

🎨 COLOR ELEGIDO: ${currentColor.name}
📐 TALLA: ${size}
📦 CANTIDAD: ${quantity}

--- MI DESCRIPCIÓN / IDEA / PETICIÓN ---
(Describe aquí tu diseño, personaje, logo, idea, colores, estilo, referencias, etc. Mientras más detalles, mejor resultado.)



--- DETALLES TÉCNICOS ADICIONALES ---
Ubicación de impresión preferida: 
Fecha límite: 
Uso: Personal / Regalo / Merchandising

Gracias!`
    );
    window.open(`mailto:alonsoovalentino@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setGmailModalOpen(false);
  };

  const handleWAContact = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola VLCN STUDIO. Me interesa una colaboración técnica.
- Uso: ${waForm.intent}
- Fecha límite: ${waForm.deadline}
- Cantidad aprox: ${waForm.qty}

Configuración actual: ${base.name} (${size}) + Print ${print.name} en ${placement.name}.`;
    
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
                      onClick={() => { setSelectedBase(b.id); setShowColorConfig(b.id === 'tee'); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedBase(b.id); setShowColorConfig(b.id === 'tee'); } }}
                      className={`group text-left relative border p-4 transition-all duration-300 cursor-pointer ${selectedBase === b.id ? 'border-accent ring-1 ring-accent' : 'border-border hover:border-foreground/50'}`}
                    >
                      <div className="aspect-square bg-muted mb-4 overflow-hidden relative">
                        {b.id === 'tee' ? (
                          <>
                            <img src={`generated_images/vlcn-emerald-card-white.png`} alt={`${b.name} - BLANCO`} className={`w-full h-full object-cover transition-transform duration-700 ${selectedBase === b.id ? 'scale-105' : 'group-hover:scale-110'}`} />
                            <button
                              onClick={(e) => { e.stopPropagation(); nextColor(); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg transition-transform hover:scale-110"
                              aria-label="Ver siguiente color"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
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

            {/* STEP 2: PRINT & PLACEMENT */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> VOLVER A BASE
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Print Selector */}
                  <div>
                    <h3 className="font-mono text-sm text-muted-foreground mb-4">SELECCIONA EL GRÁFICO</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {PRINTS.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => setSelectedPrint(p.id)}
                          className={`group text-left border p-2 transition-all ${selectedPrint === p.id ? 'border-accent' : 'border-border'}`}
                        >
                          <div className="aspect-[3/4] bg-muted mb-2 overflow-hidden">
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <h4 className="font-mono text-[10px] leading-tight font-bold">{p.name}</h4>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Placement Selector */}
                  <div>
                    <h3 className="font-mono text-sm text-muted-foreground mb-4">UBICACIÓN TÉCNICA</h3>
                    <div className="space-y-3">
                      {PLACEMENTS.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => setSelectedPlacement(p.id)}
                          className={`w-full flex items-center justify-between p-4 border transition-all ${selectedPlacement === p.id ? 'border-accent bg-accent/5' : 'border-border hover:border-foreground/50'}`}
                        >
                          <span className="font-mono text-sm">{p.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">Incluido</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 p-6 bg-muted border border-border/50">
                      <div className="flex items-start gap-4">
                        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Inspección Manual</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">Cada impresión es curada térmicamente a 160°C y revisada bajo luz industrial para garantizar adherencia y fidelidad de color antes del empaque.</p>
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
              {/* High Fidelity Viewer */}
              <div className="relative group overflow-hidden border border-border aspect-[4/5] bg-white cursor-crosshair">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  <div className="bg-background/80 backdrop-blur font-mono text-[10px] px-3 py-1 border border-border">INSPECCIÓN X-RAY</div>
                </div>
                <img 
                  src={viewerImg} 
                  alt={`Vista Detallada - ${previewColor.name}`} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.35] origin-center"
                />
              </div>

              {/* Technical Specs & Sizing */}
              <div>
                {/* === BOTÓN GMAIL — solo para Camiseta Manga Corta === */}
                <div className={`mb-8 transition-all duration-300 ${colorActivelyChosen ? 'opacity-100' : 'opacity-70'}`}>
                  <button
                    onClick={() => setGmailModalOpen(true)}
                    className={`w-full flex items-center justify-between gap-4 px-6 py-5 font-mono text-sm uppercase tracking-widest transition-all duration-200 group
                      ${colorActivelyChosen
                        ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20'
                        : 'bg-foreground text-background hover:bg-accent hover:text-white'
                      }`}
                    aria-label="Enviar especificaciones por Gmail"
                  >
                    <span className="flex items-center gap-3">
                      <Mail className="w-5 h-5 shrink-0" />
                      <span className="text-left leading-tight">
                        Enviar especificaciones por Gmail
                        {!colorActivelyChosen && (
                          <span className="block text-[10px] opacity-70 font-normal normal-case tracking-normal mt-0.5">
                            Elige tu color abajo y luego pulsa aquí
                          </span>
                        )}
                      </span>
                    </span>
                    <Send className="w-4 h-4 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  {colorActivelyChosen && (
                    <p className="font-mono text-[10px] text-accent mt-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" /> Color confirmado: {currentColor.name} · Pulsa el botón para describir tu diseño
                    </p>
                  )}
                </div>

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
                    <button className="flex items-center gap-1 font-mono text-[10px] text-accent hover:underline">
                      <Ruler className="w-3 h-3" /> VER TABLA COMPARATIVA
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
                  <div className="mt-2 font-mono text-[10px] text-muted-foreground/80 leading-relaxed">
                    Talla S: 25 × 35 cm (prenda 50cm) · Talla M: 27 × 37 cm (52cm) · Talla L: 29 × 39 cm (54cm) · Talla XL: 31 × 41 cm (57cm) · Talla 2XL: 33 × 43 cm (60cm) · Logotipos (pecho): 10 × 10 cm
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-muted-foreground/60 leading-relaxed">
                    El estampado ocupa ~{printWidthRatioPct.toFixed(0)}% del ancho de la prenda en talla {size} — proporción constante en todas las tallas, con margen libre a cada costura.
                  </div>
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
                <p className="font-mono text-[10px] text-muted-foreground mb-1">IMPRESIÓN</p>
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm max-w-[70%]">{print.name} ({placement.name})</p>
                  <p className="font-mono text-sm">+{formatCLP(PRINT_PRICE)}</p>
                </div>
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

            {/* Ubicación y Envío */}
            <div className="pt-4 border-t border-border space-y-3 mt-6">
              <p className="font-mono text-[10px] text-muted-foreground mb-1 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> UBICACIÓN Y ENVÍO
              </p>

              <select
                className="w-full p-3 border border-border bg-transparent focus:outline-none focus:border-accent font-mono text-xs"
                value={city}
                onChange={e => { setCity(e.target.value as 'temuco' | 'otra'); setComuna(''); }}
              >
                <option value="temuco">TEMUCO</option>
                <option value="otra">OTRA CIUDAD (Región de La Araucanía)</option>
              </select>

              {city === 'temuco' && (
                <select
                  className="w-full p-3 border border-border bg-transparent focus:outline-none focus:border-accent font-mono text-xs"
                  value={comuna}
                  onChange={e => setComuna(e.target.value)}
                >
                  <option value="">SELECCIONA TU SECTOR</option>
                  {COMUNAS_TEMUCO.map(c => (
                    <option key={c} value={c}>{c.toUpperCase()}</option>
                  ))}
                </select>
              )}

              {isOutsideTemuco ? (
                <div className="p-4 bg-muted border border-border/50 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-tight">Costos de Envío Región de La Araucanía vía Blue Express</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">El valor del despacho se calcula según la cantidad de poleras en tu pedido:</p>
                  <ul className="text-[10px] font-mono space-y-1 pt-1">
                    <li className={quantity >= 1 && quantity <= 2 ? 'text-accent font-bold' : 'text-muted-foreground'}>1 a 2 poleras: {formatCLP(3100)}</li>
                    <li className={quantity >= 3 && quantity <= 10 ? 'text-accent font-bold' : 'text-muted-foreground'}>3 a 10 poleras: {formatCLP(3650)}</li>
                    <li className={quantity >= 11 && quantity <= 20 ? 'text-accent font-bold' : 'text-muted-foreground'}>11 a 20 poleras: {formatCLP(4700)}</li>
                  </ul>
                </div>
              ) : (
                <div className="p-4 border border-accent/40 bg-accent/5 flex items-start gap-3">
                  <Package className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground">Retiro o despacho local gratuito dentro de Temuco.</p>
                </div>
              )}
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
              <p className="text-[10px] text-muted-foreground lg:hidden">Base + Impresión {isOutsideTemuco ? `+ Envío ${formatCLP(shipping)}` : '+ Envío gratis (Temuco)'}</p>
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

      {/* GMAIL ESPECIFICACIONES MODAL — solo Camiseta Manga Corta */}
      {gmailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setGmailModalOpen(false)}></div>
          
          <div className="relative bg-background border border-border w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-accent text-white">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <div>
                  <h3 className="font-mono font-bold text-sm uppercase tracking-widest">Diseño Asistido por Correo</h3>
                  <p className="text-[11px] opacity-80 mt-0.5">Camiseta Manga Corta — Servicio exclusivo por texto</p>
                </div>
              </div>
              <button onClick={() => setGmailModalOpen(false)} className="opacity-80 hover:opacity-100 transition-opacity">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-muted border border-border/60 p-4 space-y-2">
                <h4 className="font-mono text-xs font-bold uppercase">Tu selección actual</h4>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full mx-auto mb-1 border-2 border-accent" style={{ backgroundColor: currentColor.hex }}></div>
                    <p className="font-mono text-[10px] text-muted-foreground">COLOR</p>
                    <p className="font-mono text-xs font-bold">{currentColor.name}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full mx-auto mb-1 border-2 border-border bg-muted flex items-center justify-center">
                      <span className="font-mono text-sm font-bold">{size}</span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">TALLA</p>
                    <p className="font-mono text-xs font-bold">{size}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full mx-auto mb-1 border-2 border-border bg-muted flex items-center justify-center">
                      <span className="font-mono text-sm font-bold">{quantity}</span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">CANTIDAD</p>
                    <p className="font-mono text-xs font-bold">{quantity} ud.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold text-accent">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Se abrirá tu app de correo con el asunto <strong className="text-foreground">"Envía tu diseño, petición o idea"</strong> y tu configuración pre-cargada.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold text-accent">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Describe tu diseño en palabras: personaje, logo, frase, estilo, referencias visuales, colores, etc.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold text-accent">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Nuestro equipo te responde con un boceto previo antes de proceder. Sin subir archivos.</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">Este canal es <strong>exclusivo para diseño asistido por texto y correo</strong>. Si ya tienes tu archivo listo, usa la opción <em>"Sube la foto de tu diseño"</em> en el paso 1.</p>
              </div>

              <button
                onClick={handleGmailSend}
                className="w-full bg-accent text-white font-mono text-sm py-4 px-6 uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent/90 transition-colors group"
              >
                <Mail className="w-5 h-5" />
                Abrir Gmail y describir mi idea
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <p className="text-center font-mono text-[10px] text-muted-foreground">
                Correo: alonsoovalentino@gmail.com
              </p>
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