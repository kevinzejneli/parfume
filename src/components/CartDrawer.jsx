import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../store'
import { lockScroll, scrollToId } from '../lib/scroll'
import { EASE, EASE_IN_OUT, MagneticButton } from './ui'

const FREE_SHIPPING = 150

export default function CartDrawer() {
  const cart = useStore((s) => s.cart)
  const open = useStore((s) => s.cartOpen)
  const close = useStore((s) => s.closeCart)
  const setQty = useStore((s) => s.setQty)
  const [checkout, setCheckout] = useState(false)

  const count = cart.reduce((a, c) => a + c.qty, 0)
  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0)
  const remaining = Math.max(0, FREE_SHIPPING - subtotal)

  useEffect(() => {
    if (!open) {
      setCheckout(false)
      return
    }
    lockScroll(true)
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="drawer-backdrop" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
          <motion.aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: '104%' }}
            animate={{ x: 0 }}
            exit={{ x: '104%' }}
            transition={{ duration: 0.75, ease: EASE_IN_OUT }}
          >
            <header className="drawer__head">
              <h3>
                Your bag <sup>{count}</sup>
              </h3>
              <button className="drawer__close" onClick={close} aria-label="Close bag">
                Close
              </button>
            </header>

            <div className="drawer__ship">
              <p>{remaining > 0 ? `€${remaining} away from complimentary delivery` : 'Complimentary delivery — unlocked'}</p>
              <div className="drawer__ship-track">
                <motion.span initial={false} animate={{ scaleX: Math.min(1, subtotal / FREE_SHIPPING) }} transition={{ duration: 0.9, ease: EASE }} />
              </div>
            </div>

            <div className="drawer__items" data-lenis-prevent>
              {cart.length === 0 && (
                <motion.div className="drawer__empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: EASE }}>
                  <p>
                    Your bag is empty — <em>for now.</em>
                  </p>
                  <button
                    className="textlink"
                    onClick={() => {
                      close()
                      setTimeout(() => scrollToId('collection'), 400)
                    }}
                  >
                    Explore the collection →
                  </button>
                </motion.div>
              )}
              <AnimatePresence initial={false}>
                {cart.map((c, i) => (
                  <motion.div
                    layout
                    key={c.key}
                    className="line-item"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.25 + i * 0.05, duration: 0.7, ease: EASE } }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
                  >
                    <span className="line-item__vial" style={{ '--c': c.color }} />
                    <div className="line-item__info">
                      <h4>{c.name}</h4>
                      <span>{c.variant}</span>
                      <div className="qty">
                        <button onClick={() => setQty(c.key, c.qty - 1)} aria-label={`Decrease ${c.name}`}>
                          −
                        </button>
                        <span>{c.qty}</span>
                        <button onClick={() => setQty(c.key, c.qty + 1)} aria-label={`Increase ${c.name}`}>
                          +
                        </button>
                      </div>
                    </div>
                    <div className="line-item__price">
                      <span>€{c.price * c.qty}</span>
                      <button onClick={() => setQty(c.key, 0)}>Remove</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <footer className="drawer__foot">
              <div className="drawer__total">
                <span>Subtotal</span>
                <span>€{subtotal}</span>
              </div>
              <p className="drawer__note">Two complimentary samples are added to every order.</p>
              <MagneticButton className="mbtn--accent mbtn--block" disabled={cart.length === 0} onClick={() => setCheckout(true)}>
                {checkout ? 'Demo store — checkout disabled' : 'Proceed to checkout'}
              </MagneticButton>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
