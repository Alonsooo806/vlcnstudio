export interface CartItem {
  id: string;
  titulo: string;
  precio: number;
  talla: string;
  cantidad: number;
  categoria: string;
  accentHex: string;
  emoji?: string;
  imagen?: string;
}

const KEY = 'vlcn_cart';
const LIMIT_PER_PRODUCT = 5;

export const cartStore = {
  get(): CartItem[] {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
  },
  add(item: CartItem): 'ok' | 'limit' {
    const cart = this.get();
    const totalForId = cart.filter(i => i.id === item.id).reduce((s, i) => s + i.cantidad, 0);
    if (totalForId >= LIMIT_PER_PRODUCT) return 'limit';
    const idx = cart.findIndex(i => i.id === item.id && i.talla === item.talla);
    if (idx >= 0) { cart[idx].cantidad += item.cantidad; }
    else { cart.push(item); }
    localStorage.setItem(KEY, JSON.stringify(cart));
    return 'ok';
  },
  remove(id: string, talla: string) {
    const cart = this.get().filter(i => !(i.id === id && i.talla === talla));
    localStorage.setItem(KEY, JSON.stringify(cart));
  },
  clear() {
    localStorage.removeItem(KEY);
  },
  count(): number {
    return this.get().reduce((s, i) => s + i.cantidad, 0);
  },
  countForId(id: string): number {
    return this.get().filter(i => i.id === id).reduce((s, i) => s + i.cantidad, 0);
  },
  total(): number {
    return this.get().reduce((s, i) => s + i.precio * i.cantidad, 0);
  },
};
