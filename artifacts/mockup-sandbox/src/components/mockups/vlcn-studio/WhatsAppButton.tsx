import React from 'react';

const WA_URL = 'https://wa.me/56965536529';

export default function WhatsAppButton() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-8 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
      style={{ backgroundColor: '#25D366' }}
    >
      {/* WhatsApp official icon */}
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 fill-white">
        <path d="M16.003 3C9.376 3 4 8.376 4 15.003c0 2.18.587 4.218 1.607 5.97L4 29l8.267-1.585A12.003 12.003 0 0 0 16.003 28c6.624 0 12-5.376 12-12.003C28.003 9.376 22.627 4 16.003 4zm.001 21.84c-1.863 0-3.594-.503-5.083-1.376l-.363-.216-4.908.94.957-4.802-.236-.374A9.845 9.845 0 0 1 5.17 15c0-5.426 4.411-9.838 9.835-9.838 5.424 0 9.835 4.412 9.835 9.838 0 5.426-4.41 9.84-9.836 9.84zm5.39-7.372c-.296-.148-1.748-.86-2.02-.958-.27-.098-.466-.148-.66.148-.195.297-.757.958-.928 1.154-.17.197-.34.222-.636.074-.296-.148-1.25-.46-2.38-1.47-.88-.784-1.473-1.752-1.645-2.048-.17-.295-.018-.455.13-.602.132-.133.296-.347.444-.52.148-.173.198-.297.297-.494.099-.197.05-.37-.025-.52-.074-.147-.66-1.59-.904-2.177-.238-.572-.48-.494-.66-.503l-.562-.01c-.197 0-.518.074-.79.37-.27.296-1.03 1.005-1.03 2.45 0 1.443 1.055 2.84 1.203 3.037.148.197 2.075 3.167 5.03 4.44.702.302 1.25.483 1.677.618.705.224 1.347.192 1.855.116.565-.085 1.748-.715 1.995-1.405.247-.69.247-1.28.173-1.403-.074-.124-.27-.197-.566-.345z"/>
      </svg>

      {/* Tooltip */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ backgroundColor: '#25D366' }}>
        Escríbenos
      </span>
    </a>
  );
}
