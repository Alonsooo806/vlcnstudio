export interface CatalogSelection {
  id: string;
  titulo: string;
  imagen: string;
  precio: number;
}

const KEY = 'vlcn_catalog_sel';

export const catalogStore = {
  set(item: CatalogSelection) {
    sessionStorage.setItem(KEY, JSON.stringify(item));
  },
  get(): CatalogSelection | null {
    try { return JSON.parse(sessionStorage.getItem(KEY) ?? 'null'); }
    catch { return null; }
  },
  clear() { sessionStorage.removeItem(KEY); },
};
