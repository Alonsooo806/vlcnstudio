import React from 'react';
import { ShieldCheck, MessageCircleHeart, RefreshCw } from 'lucide-react';

const WA_URL = 'https://wa.me/56965536529';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto" style={{ background: 'rgba(13,0,32,0.85)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Garantía y Devoluciones */}
        <div>
          <h4 className="font-mono text-xs font-bold tracking-widest text-white/70 mb-3 uppercase">Garantía y Devoluciones</h4>
          <ul className="space-y-1.5 text-white/50 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              Estampado garantizado por <strong className="text-white/70">50 lavados</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              Cambio por defecto de producción dentro de 7 días
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              Solicitudes por WhatsApp con foto del problema
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              Sin devoluciones por diseños personalizados aprobados
            </li>
          </ul>
        </div>

        {/* Sellos de confianza */}
        <div>
          <h4 className="font-mono text-xs font-bold tracking-widest text-white/70 mb-3 uppercase">Compromiso</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(168,85,247,0.4)' }}>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-white/60 text-sm font-mono">Compra Segura</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}>
                <MessageCircleHeart className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-white/60 text-sm font-mono">Soporte 24/7 por WhatsApp</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(16,163,74,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <RefreshCw className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-white/60 text-sm font-mono">Cambios sin complicaciones</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 md:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-white/25 tracking-widest">
          © 2025 VLCN STUDIO · TEMUCO, CHILE
        </p>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-white/40 hover:text-green-400 transition-colors flex items-center gap-1.5"
        >
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-current">
            <path d="M16.003 3C9.376 3 4 8.376 4 15.003c0 2.18.587 4.218 1.607 5.97L4 29l8.267-1.585A12.003 12.003 0 0 0 16.003 28c6.624 0 12-5.376 12-12.003C28.003 9.376 22.627 4 16.003 4zm.001 21.84c-1.863 0-3.594-.503-5.083-1.376l-.363-.216-4.908.94.957-4.802-.236-.374A9.845 9.845 0 0 1 5.17 15c0-5.426 4.411-9.838 9.835-9.838 5.424 0 9.835 4.412 9.835 9.838 0 5.426-4.41 9.84-9.836 9.84zm5.39-7.372c-.296-.148-1.748-.86-2.02-.958-.27-.098-.466-.148-.66.148-.195.297-.757.958-.928 1.154-.17.197-.34.222-.636.074-.296-.148-1.25-.46-2.38-1.47-.88-.784-1.473-1.752-1.645-2.048-.17-.295-.018-.455.13-.602.132-.133.296-.347.444-.52.148-.173.198-.297.297-.494.099-.197.05-.37-.025-.52-.074-.147-.66-1.59-.904-2.177-.238-.572-.48-.494-.66-.503l-.562-.01c-.197 0-.518.074-.79.37-.27.296-1.03 1.005-1.03 2.45 0 1.443 1.055 2.84 1.203 3.037.148.197 2.075 3.167 5.03 4.44.702.302 1.25.483 1.677.618.705.224 1.347.192 1.855.116.565-.085 1.748-.715 1.995-1.405.247-.69.247-1.28.173-1.403-.074-.124-.27-.197-.566-.345z"/>
          </svg>
          +56 9 6553 6529
        </a>
      </div>
    </footer>
  );
}
