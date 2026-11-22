import { create } from 'zustand'
import { fragrances, priceFor } from './data/fragrances'

let toastTimer

export const useStore = create((set, get) => ({
  // which fragrance the 3D bottle + showcase display
  active: 0,
  dir: 1,
  setActive: (i) => {
    const n = fragrances.length
    const cur = get().active
    const next = ((i % n) + n) % n
    if (next === cur) return
    set({ active: next, dir: i > cur ? 1 : -1 })
  },
  next: () => get().setActive(get().active + 1),
  prev: () => get().setActive(get().active - 1),

  // boot sequence
  loaded: false,
  setLoaded: (loaded) => set({ loaded }),
  sceneReady: false,
  setSceneReady: (sceneReady) => set({ sceneReady }),

  // bag
  cart: [],
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  addItem: (item) => {
    set((s) => {
      const existing = s.cart.find((c) => c.key === item.key)
      return {
        cart: existing
          ? s.cart.map((c) => (c.key === item.key ? { ...c, qty: c.qty + 1 } : c))
          : [...s.cart, { ...item, qty: 1 }],
      }
    })
    get().notify(item)
  },
  setQty: (key, qty) =>
    set((s) => ({
      cart: qty <= 0 ? s.cart.filter((c) => c.key !== key) : s.cart.map((c) => (c.key === key ? { ...c, qty } : c)),
    })),

  // toast
  toast: null,
  notify: (payload) => {
    clearTimeout(toastTimer)
    set({ toast: { ...payload, stamp: Date.now() } })
    toastTimer = setTimeout(() => set({ toast: null }), 2800)
  },
}))

export const makeItem = (f, size) => ({
  key: `${f.id}-${size}`,
  name: f.name,
  variant: `${size} ml · Extrait`,
  price: priceFor(f, size),
  color: f.color,
})

export const discoveryItem = {
  key: 'discovery-set',
  name: 'Coffret Découverte',
  variant: '8 × 2 ml',
  price: 38,
  color: '#c9a25a',
}
