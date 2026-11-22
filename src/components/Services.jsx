import { FadeIn } from './ui'

const ICONS = {
  sample: (
    <path d="M10 3h4M11 3v4l-3 4v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-9l-3-4V3M8 14h8" />
  ),
  engrave: <path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3M4 20h16" />,
  refill: <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4M12 8v8M9 13l3 3 3-3" />,
  leaf: <path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l7-7" />,
}

const SERVICES = [
  ['sample', 'Two samples, always', 'Every order ships with two 2 ml vials of your choosing.'],
  ['engrave', 'Engraved by hand', 'Initials or a date, etched onto the cap at no cost.'],
  ['refill', 'Refill, never replace', 'Return an empty bottle for 20% off its refill.'],
  ['leaf', 'Plastic-free delivery', 'Recycled card, cotton ribbon, carbon-offset shipping.'],
]

export default function Services() {
  return (
    <section className="services" aria-label="Services">
      {SERVICES.map(([icon, title, body], i) => (
        <FadeIn key={title} className="service" delay={i * 0.08}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ICONS[icon]}
          </svg>
          <h4>{title}</h4>
          <p>{body}</p>
        </FadeIn>
      ))}
    </section>
  )
}
