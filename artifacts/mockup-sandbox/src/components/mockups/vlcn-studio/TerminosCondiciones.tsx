import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { navTo } from './navigate';

const sections = [
  {
    number: '1.',
    title: 'Sobre el servicio',
    paragraphs: [
      'Al comprar en nuestro sitio, aceptas estos términos y condiciones. El documento regula este asunto pues usted como consumidor tiene derecho a acceder y a usar nuestro servicio del sitio web VLCN Studio. Nuestra responsabilidad es entregarte un producto de calidad (personalizado mediante tecnología DTF) dentro del plazo informado.',
      'El uso del sitio web, tanto la aplicación de los términos y actos que respectivamente se hagan están bajo las leyes de la República de Chile, destacamos el amparo que este organismo hace a la Ley 19.496 de Protección de los Derechos de los Consumidores. De esta manera, se aplicará todo beneficio, garantía y derechos reconocidos en la ley.',
      'Garantizamos como marca todos nuestros productos por un periodo de 6 meses desde la fecha de recepción. Se avisará con antelación.',
    ],
  },
  {
    number: '2.',
    title: 'Información del Producto y Estándares de Calidad',
    paragraphs: [
      'Nos comprometemos a entregar productos personalizados mediante tecnología de impresión DTF de alta gama. Esta técnica ha sido seleccionada por su comprobada excelencia, ofreciendo una alta resistencia al desgaste, lavados frecuentes y uso diario, manteniendo la viveza de los colores y la precisión de los diseños. Al ser productos fabricados bajo pedido, el cliente entiende que las características visuales y técnicas finales son las detalladas en el momento de la compra e igual a lo que eligió.',
    ],
  },
  {
    number: '3.',
    title: 'Política de Despacho y Entrega',
    paragraphs: [
      'Tiempo de fabricación: Dado que cada producto se elabora especialmente para usted, el proceso de fabricación toma entre 1 y 2 semanas, dependiendo de la demanda actual.',
      'Como modalidades disponemos de este tipo de entregas:',
    ],
    bullets: [
      'Entrega local (Temuco): Disponemos de un punto de encuentro coordinado para la entrega presencial, facilitando la recepción directa del producto.',
      'Envíos nacionales: Para clientes fuera de Temuco, los pedidos son despachados a través de empresa de envío. Los costos asociados a este servicio serán informados al momento de la compra y deberán ser cubiertos por el cliente. Una vez entregado el paquete a la empresa transportista, la responsabilidad sobre el tránsito y tiempos de entrega recae en dicho operador.',
    ],
  },
  {
    number: '4.',
    title: 'Garantía Legal y Resolución de Problemas',
    paragraphs: [
      'Si el producto presenta fallas de origen, defectos en la confección o errores técnicos en el estampado, nos hacemos responsables de coordinar su reparación, cambio o la restitución del dinero. Nuestro proceso de gestión es directo: usted contacta a alonsoovalentino@gmail.com y nosotros gestionamos la solución técnica con nuestros proveedores.',
    ],
  },
  {
    number: '5.',
    title: 'Política de Cambios, Devoluciones y Retracto',
    paragraphs: [
      'Entendemos la importancia de la satisfacción del cliente; sin embargo, al tratarse de productos fabricados a medida, personalizados y bajo especificaciones particulares del comprador, no aplica el derecho a retracto por razones de gusto personal, error en la elección de tallas o cambios de opinión. Solo se realizarán excepciones en caso de que el producto presente defectos de fábrica cubiertos por la garantía legal.',
    ],
  },
  {
    number: '6.',
    title: 'Privacidad y Protección de Datos',
    paragraphs: [
      'La privacidad de su información es un compromiso fundamental para nosotros. Los datos personales recolectados (nombre, dirección, teléfono y correo electrónico) se utilizan exclusivamente para el correcto procesamiento, gestión y despacho de sus pedidos. Nos comprometemos a no vender, compartir ni utilizar su información con fines ajenos a la prestación de nuestro servicio, conforme a la normativa vigente sobre la protección de la vida privada.',
    ],
  },
  {
    number: '7.',
    title: 'Servicio al Cliente',
    paragraphs: [
      'Para cualquier duda, comentario o requerimiento adicional, nuestro canal oficial de atención es: alonsoovalentino@gmail.com.',
    ],
  },
];

export default function TerminosCondiciones() {
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
          <p className="font-mono text-xs tracking-widest mb-4" style={{ color: '#c084fc' }}>
            DOCUMENTO LEGAL
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-4">
            TÉRMINOS Y{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #a855f7, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CONDICIONES
            </span>
          </h1>
          <p className="text-white/40 text-sm font-mono">
            Válido para compras realizadas en vlcnstudio.cl · República de Chile
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-12" style={{ background: 'linear-gradient(90deg, #a855f7 0%, transparent 100%)' }} />

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((s) => (
            <section key={s.number}>
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="font-mono text-xs font-bold shrink-0"
                  style={{ color: '#a855f7' }}
                >
                  {s.number}
                </span>
                <h2 className="text-lg font-bold tracking-tight text-white">
                  {s.title}
                </h2>
              </div>

              <div className="pl-6 space-y-4">
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-white/65 leading-relaxed text-sm md:text-base">
                    {p}
                  </p>
                ))}

                {s.bullets && (
                  <ul className="space-y-3 mt-2">
                    {s.bullets.map((b, i) => (
                      <li key={i} className="flex gap-3 text-white/65 text-sm md:text-base leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#a855f7' }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/30 text-xs font-mono text-center leading-relaxed">
            VLCN STUDIO · TEMUCO, CHILE · alonsoovalentino@gmail.com
            <br />
            Sujeto a la Ley 19.496 de Protección de los Derechos de los Consumidores
          </p>
        </div>
      </main>
    </div>
  );
}
