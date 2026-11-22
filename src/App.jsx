import { useEffect } from 'react'
import { useStore } from './store'
import { fragrances } from './data/fragrances'
import { useSmoothScroll } from './lib/scroll'
import Experience from './three/Experience'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Showcase from './components/Showcase'
import Collection from './components/Collection'
import Materials from './components/Materials'
import Manifesto from './components/Manifesto'
import Discovery from './components/Discovery'
import Services from './components/Services'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Keep the CSS accent (and readable text on it) in sync with the fragrance on display. */
function useAccent() {
  const active = useStore((s) => s.active)
  useEffect(() => {
    const { color } = fragrances[active]
    const root = document.documentElement.style
    root.setProperty('--accent', color)
    root.setProperty('--accent-ink', luminance(color) > 0.22 ? '#0f0c0a' : '#f4ede1')
  }, [active])
}

export default function App() {
  useSmoothScroll()
  useAccent()

  return (
    <>
      <Preloader />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Experience />
      <Nav />
      <main className="content">
        <Hero />
        <Marquee />
        <Showcase />
        <Collection />
        <Materials />
        <Manifesto />
        <Discovery />
        <Services />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  )
}
