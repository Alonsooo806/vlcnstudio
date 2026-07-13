import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ChevronDown } from 'lucide-react';

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  showWhatsApp?: boolean;
}

// ─── Constantes ──────────────────────────────────────────────────────────────
const WA_URL = 'https://wa.me/56965536529';
const QUESTION_LIMIT = 3; // Redirige a WA al superar este número

// ─── Palabras clave que activan redirección a WA inmediata ───────────────────
const WA_TRIGGER_KEYWORDS = [
  'pago', 'pagar', 'transferencia', 'webpay', 'tarjeta',
  'pedido', 'seguimiento', 'tracking', 'despacho', 'envío', 'envio',
  'descuento', 'cotización', 'cotizacion', 'factura', 'boleta',
  'personaliz', 'diseño propio', 'logo propio',
  'devolución', 'devolucion', 'cambio', 'garantía', 'garantia',
  'mayorista', 'mayoreo', 'por mayor', 'pedido grande',
];

// ─── Respuestas de la IA ─────────────────────────────────────────────────────
interface KnowledgeEntry {
  patterns: string[];
  reply: string;
}

const KNOWLEDGE: KnowledgeEntry[] = [
  {
    patterns: ['hola', 'buenas', 'hey', 'ola', 'saludos', 'buen día', 'buenas tardes', 'buenas noches'],
    reply: '¡Hola! 👋 Soy el asistente técnico de VLCN Studio. Puedo ayudarte con dudas sobre materiales, tallas, colores, precios o el proceso de estampado. ¿En qué te puedo orientar?',
  },
  {
    patterns: ['talla', 'tallas', 'medida', 'medidas', 'guía de tallas', 'tabla de tallas', 'size', 'sizing'],
    reply: 'Nuestras poleras vienen en **S, M, L, XL y 2XL**. 📐\n\n• S → ancho de pecho 50 cm\n• M → 52 cm\n• L → 54 cm\n• XL → 57 cm\n• 2XL → 60 cm\n\nSi estás entre dos tallas, recomendamos la mayor para un fit holgado o la menor para un look más ajustado. ¿Tienes alguna medida específica?',
  },
  {
    patterns: ['material', 'tela', 'algodón', 'algodon', 'gramaje', 'gramos', 'gsm', 'peso', 'calidad', 'tejido'],
    reply: 'Trabajamos con dos opciones de base:\n\n🧵 **Camiseta Manga Corta** — 100% Algodón Peinado, 220 g/m². Ideal para estampados de alta densidad.\n\n🧶 **Manga Larga** — 100% Algodón Orgánico, 200 g/m². Suavidad extra y certificación de origen.\n\nAmbas pasan control de encogimiento (&lt;3% tras 50 lavados). ¿Cuál te interesa?',
  },
  {
    patterns: ['precio', 'costo', 'cuánto', 'cuanto', 'valor', 'tarifa', 'cobran', 'cobras'],
    reply: 'Estructura de precios base:\n\n💰 **Prenda base:** $4.000 CLP\n📍 **Estampado pecho:** +$6.000 CLP\n📍 **Estampado espalda:** +$2.000 CLP\n📍 **Estampado manga:** +$1.000 CLP\n\nPuedes combinar varias ubicaciones y el precio se acumula automáticamente en el configurador. El despacho en Temuco es **gratis**. ¿Tienes alguna duda sobre los costos?',
  },
  {
    patterns: ['estampado', 'estampar', 'impresión', 'imprimir', 'serigrafía', 'serigrafia', 'dtf', 'técnica', 'tecnica'],
    reply: 'Usamos dos técnicas según el diseño:\n\n🖨️ **Serigrafía Alta Densidad** — para diseños vectoriales de 1-4 colores. Máxima durabilidad.\n\n🎨 **DTF Industrial** — para diseños fotográficos o con degradados. Sin límite de colores.\n\nTodo curado a **160°C** con control de calidad bajo luz industrial. ¿Tienes ya un diseño listo?',
  },
  {
    patterns: ['color', 'colores', 'disponible', 'opciones', 'variantes', 'qué colores', 'que colores'],
    reply: 'Tenemos **8 colores de base** disponibles:\n\n⚫ Negro · ⚪ Blanco · 🔴 Rojo · 🟠 Naranjo\n🟡 Amarillo · 🟢 Verde · 🔵 Azul · 🟣 Violeta\n\nPuedes previsualizar cada color en el configurador con una foto fotorrealista de la prenda. ¿Tienes algún color favorito?',
  },
  {
    patterns: ['manga', 'manga corta', 'manga larga', 'tipo', 'modelo'],
    reply: 'Actualmente manejamos dos modelos:\n\n👕 **Manga Corta** — Clásica con cuello redondo, fit oversize. 220 g/m².\n👔 **Manga Larga** — Corte recto, ideal para invierno o capas. 200 g/m² orgánico.\n\n¿Cuál se adapta mejor a lo que buscas?',
  },
  {
    patterns: ['tiempo', 'plazo', 'cuánto demora', 'demora', 'entrega', 'cuando', 'días'],
    reply: '⏱️ **Plazos estimados:**\n\n• Solicitud recibida → confirmación en 24h\n• Producción e impresión → 2 días hábiles\n• Control de calidad → 1 día\n• Despacho o retiro → al día siguiente\n\n**Total estimado: 4-5 días hábiles** desde la confirmación del pago. Para pedidos urgentes (&lt;1 semana), escríbenos directamente.',
  },
  {
    patterns: ['retiro', 'retirar', 'local', 'tienda', 'dónde', 'donde', 'dirección', 'direccion', 'temuco'],
    reply: '📍 Somos un taller con sede en **Temuco, Región de La Araucanía**.\n\nOfrecemos **retiro en local** o **despacho gratuito** dentro de Temuco. Para otras ciudades de La Araucanía, el envío va por Blue Express ($3.100–$4.700 según cantidad). ¿Estás en Temuco?',
  },
  {
    patterns: ['diseño', 'archivo', 'formato', 'png', 'svg', 'pdf', 'ai', 'illustrator', 'resolución', 'resolucion'],
    reply: '📁 **Formatos aceptados:**\n\n• **PNG** — mínimo 300 dpi al tamaño de impresión\n• **SVG o AI** — preferidos para serigrafía (vectores escalables)\n• **PDF** — si viene en alta resolución\n\nSi no tienes un archivo listo, puedes usar el botón "Diseño asistido por correo" en el configurador y describir tu idea con palabras. Nuestro equipo te envía un boceto. 🎨',
  },
  {
    patterns: ['lavado', 'lavar', 'cuidado', 'mantención', 'mantencion', 'durabilidad', 'durable', 'resiste', 'resistencia'],
    reply: '🧺 **Instrucciones de cuidado:**\n\n• Lavar al revés, máx 30°C\n• No usar secadora (puede afectar el estampado)\n• Planchar al revés a temperatura media\n• No usar cloro ni blanqueadores\n\nNuestros estampados están garantizados por al menos **50 lavados sin craquelado estructural**. Los colores toman un degradado natural que le da más carácter. ✅',
  },
  {
    patterns: ['gracias', 'thank', 'genial', 'perfecto', 'excelente', 'ok', 'listo', 'entendido', 'claro'],
    reply: '¡Con gusto! 😊 Si tienes más dudas técnicas, aquí estaré. También puedes ir directamente al configurador para armar tu pedido. ¿Hay algo más en lo que pueda ayudarte?',
  },
];

const FALLBACK_REPLIES = [
  'Hmm, esa consulta está fuera de mi alcance técnico. 🤔 Puedo orientarte sobre materiales, tallas, colores, precios o procesos de estampado. ¿En cuál de esos temas te puedo ayudar?',
  'No tengo esa información específica, pero puedo explicarte sobre nuestros materiales, técnicas de impresión o estructura de precios. ¿Qué te interesa saber?',
  'Esa pregunta requiere atención más personalizada. Te recomiendo continuar por WhatsApp para una respuesta precisa. 👇',
];

const WA_HANDOFF_MESSAGE =
  'Para brindarte una atención más personalizada y detallada, continuemos esta conversación por WhatsApp. Nuestro equipo responde en minutos con toda la información que necesitas. 💬';

// ─── Lógica de respuesta ──────────────────────────────────────────────────────
function getReply(text: string, questionCount: number): { reply: string; triggerWA: boolean } {
  const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // ¿Contiene palabra clave de WA?
  const needsWA = WA_TRIGGER_KEYWORDS.some(kw => normalized.includes(kw));
  if (needsWA || questionCount > QUESTION_LIMIT) {
    return { reply: WA_HANDOFF_MESSAGE, triggerWA: true };
  }

  // Buscar en knowledge base
  for (const entry of KNOWLEDGE) {
    if (entry.patterns.some(p => normalized.includes(p))) {
      return { reply: entry.reply, triggerWA: false };
    }
  }

  // Fallback – si es la 3ra pregunta sin respuesta, derivar a WA
  if (questionCount >= QUESTION_LIMIT) {
    return { reply: WA_HANDOFF_MESSAGE, triggerWA: true };
  }

  return {
    reply: FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)],
    triggerWA: false,
  };
}

// ─── Render de texto con **bold** y saltos de línea ──────────────────────────
function RichText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={li}>
            {parts.map((part, pi) =>
              pi % 2 === 1 ? <strong key={pi}>{part}</strong> : part
            )}
            {li < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: '¡Hola! 👋 Soy el asistente técnico de VLCN Studio. Puedo ayudarte con dudas sobre **materiales**, **tallas**, **colores**, **precios** o el **proceso de estampado**. ¿En qué te puedo orientar?',
    },
  ]);
  const [input, setInput] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  // Scroll al último mensaje
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, open]);

  // Focus al input cuando abre
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setHasUnread(false);
    }
  }, [open]);

  // Pulso de notificación inicial después de 4s
  useEffect(() => {
    const t = setTimeout(() => {
      if (!open) setHasUnread(true);
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: nextId.current++, role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    // Simular latencia de "escritura" (600–1200ms)
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const { reply, triggerWA } = getReply(text, newCount);
      const botMsg: Message = {
        id: nextId.current++,
        role: 'bot',
        text: reply,
        showWhatsApp: triggerWA,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Quick reply chips ────────────────────────────────────────────────────
  const QUICK_REPLIES = ['Precios', 'Tallas', 'Materiales', 'Colores', 'Tiempo de entrega'];

  const sendQuick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      const userMsg: Message = { id: nextId.current++, role: 'user', text };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      const newCount = questionCount + 1;
      setQuestionCount(newCount);

      const delay = 600 + Math.random() * 600;
      setTimeout(() => {
        const { reply, triggerWA } = getReply(text, newCount);
        const botMsg: Message = {
          id: nextId.current++,
          role: 'bot',
          text: reply,
          showWhatsApp: triggerWA,
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, delay);
    }, 50);
  };

  const showQuickReplies = messages.length <= 1 && !isTyping;

  return (
    <>
      {/* ── Botón flotante 🤖 ─────────────────────────────────────────────── */}
      <button
        onClick={() => { setOpen(o => !o); setHasUnread(false); }}
        aria-label="Abrir asistente de chat"
        className={`fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 select-none
          ${open
            ? 'bg-foreground text-background scale-95'
            : 'bg-foreground text-background hover:scale-110 active:scale-95'
          }`}
        style={{ fontSize: '1.6rem', lineHeight: 1 }}
      >
        {open ? <ChevronDown className="w-6 h-6" /> : '🤖'}

        {/* Badge de notificación */}
        {hasUnread && !open && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* ── Modal de chat ─────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-background border border-border shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right
          ${open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
          }`}
        style={{ maxHeight: '520px', minHeight: '360px' }}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-foreground text-background shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl">🤖</span>
            <div>
              <p className="font-mono font-bold text-sm tracking-wider">VLCN ASISTENTE</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono text-[10px] opacity-70">En línea · Responde al instante</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="opacity-60 hover:opacity-100 transition-opacity p-1"
            aria-label="Cerrar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] px-3 py-2.5 text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-foreground text-background font-mono text-xs'
                    : 'bg-muted border border-border/60 text-foreground font-sans text-[13px]'
                  }`}
              >
                <RichText text={msg.text} />
              </div>

              {/* Botón WhatsApp si aplica */}
              {msg.showWhatsApp && (
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all active:scale-95 mt-1"
                  style={{ backgroundColor: '#25D366' }}
                >
                  {/* Logo WhatsApp SVG oficial */}
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="currentColor">
                    <path d="M16.003 3C9.376 3 4 8.376 4 15.003c0 2.18.587 4.218 1.607 5.97L4 29l8.267-1.585A12.003 12.003 0 0 0 16.003 28c6.624 0 12-5.376 12-12.003C28.003 9.376 22.627 4 16.003 4zm.001 21.84c-1.863 0-3.594-.503-5.083-1.376l-.363-.216-4.908.94.957-4.802-.236-.374A9.845 9.845 0 0 1 5.17 15c0-5.426 4.411-9.838 9.835-9.838 5.424 0 9.835 4.412 9.835 9.838 0 5.426-4.41 9.84-9.836 9.84zm5.39-7.372c-.296-.148-1.748-.86-2.02-.958-.27-.098-.466-.148-.66.148-.195.297-.757.958-.928 1.154-.17.197-.34.222-.636.074-.296-.148-1.25-.46-2.38-1.47-.88-.784-1.473-1.752-1.645-2.048-.17-.295-.018-.455.13-.602.132-.133.296-.347.444-.52.148-.173.198-.297.297-.494.099-.197.05-.37-.025-.52-.074-.147-.66-1.59-.904-2.177-.238-.572-.48-.494-.66-.503l-.562-.01c-.197 0-.518.074-.79.37-.27.296-1.03 1.005-1.03 2.45 0 1.443 1.055 2.84 1.203 3.037.148.197 2.075 3.167 5.03 4.44.702.302 1.25.483 1.677.618.705.224 1.347.192 1.855.116.565-.085 1.748-.715 1.995-1.405.247-.69.247-1.28.173-1.403-.074-.124-.27-.197-.566-.345z"/>
                  </svg>
                  Continuar por WhatsApp
                </a>
              )}
            </div>
          ))}

          {/* Indicador "escribiendo..." */}
          {isTyping && (
            <div className="flex items-start">
              <div className="bg-muted border border-border/60 px-3 py-2.5 flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {showQuickReplies && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
            {QUICK_REPLIES.map(q => (
              <button
                key={q}
                onClick={() => sendQuick(q)}
                className="font-mono text-[10px] px-2.5 py-1 border border-border hover:border-foreground hover:bg-muted transition-colors uppercase tracking-wide"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-0 border-t border-border shrink-0">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Escribe tu consulta..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 bg-transparent font-mono text-xs placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="p-3 text-foreground hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border/40 shrink-0">
          <p className="font-mono text-[9px] text-muted-foreground/50 text-center">
            VLCN STUDIO · Taller Técnico · Temuco, Chile
          </p>
        </div>
      </div>
    </>
  );
}
