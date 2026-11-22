import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../store'
import { EASE } from './ui'

export default function Toast() {
  const toast = useStore((s) => s.toast)
  const openCart = useStore((s) => s.openCart)

  return (
    <div className="toast-wrap" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toast && (
          <motion.div
            key={toast.stamp}
            className="toast"
            initial={{ y: 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="toast__dot" style={{ '--c': toast.color }} />
            <span className="toast__text">
              <b>{toast.name}</b>
              <span>{toast.variant} — added to your bag</span>
            </span>
            <button onClick={openCart}>View bag</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
