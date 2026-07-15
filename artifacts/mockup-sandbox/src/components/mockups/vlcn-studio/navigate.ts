const BASE = import.meta.env.BASE_URL;

/**
 * Navega a una URL absoluta con transición de salida suave.
 * Añade la clase `page-exiting` al <html>, espera la animación CSS
 * y luego cambia la URL.
 */
export function navigate(url: string, external = false) {
  if (external) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  document.documentElement.classList.add('page-exiting');
  setTimeout(() => {
    window.location.href = url;
  }, 260);
}

/** Navega a una ruta relativa dentro del sitio (sin BASE_URL manual). */
export function navTo(path: string) {
  navigate(`${BASE}${path}`);
}
