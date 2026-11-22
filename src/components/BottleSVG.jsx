import { useId } from 'react'

/** Flat illustration of the house bottle, tinted with the fragrance colour. */
export default function BottleSVG({ f, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (n) => `${n}-${uid}`

  return (
    <svg className={`bsvg ${className}`} viewBox="0 0 120 210" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id('liq')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={f.color} stopOpacity="0.82" />
          <stop offset="1" stopColor={f.color} />
        </linearGradient>
        <linearGradient id={id('glass')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.78" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id={id('cap')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2c2622" />
          <stop offset="0.3" stopColor="#0d0b0a" />
          <stop offset="0.52" stopColor="#3d3530" />
          <stop offset="0.7" stopColor="#0d0b0a" />
          <stop offset="1" stopColor="#221d1a" />
        </linearGradient>
        <linearGradient id={id('gold')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6a2e" />
          <stop offset="0.45" stopColor="#f3d491" />
          <stop offset="1" stopColor="#8a6a2e" />
        </linearGradient>
        <clipPath id={id('body')}>
          <rect x="12" y="78" width="96" height="124" rx="13" />
        </clipPath>
      </defs>

      {/* cap */}
      <rect x="40" y="10" width="40" height="52" rx="1.5" fill={`url(#${id('cap')})`} />
      <rect x="40" y="10" width="40" height="2.6" fill={`url(#${id('gold')})`} />
      <rect x="39" y="59" width="42" height="3" fill={`url(#${id('gold')})`} />
      <rect x="45" y="62" width="30" height="8" fill={`url(#${id('gold')})`} />
      <rect x="50" y="70" width="20" height="8" fill="#fff" fillOpacity="0.32" />

      {/* body */}
      <g clipPath={`url(#${id('body')})`}>
        <rect x="12" y="78" width="96" height="124" fill="#fff" fillOpacity="0.2" />
        <g className="bsvg__liquid">
          <rect x="12" y="104" width="96" height="110" fill={`url(#${id('liq')})`} />
          <ellipse cx="60" cy="104" rx="48" ry="2.6" fill="#fff" fillOpacity="0.38" />
        </g>
        <rect x="12" y="78" width="96" height="124" fill={`url(#${id('glass')})`} />
        <rect x="18" y="86" width="5" height="108" rx="2.5" fill="#fff" fillOpacity="0.5" />
        <rect x="98" y="90" width="2" height="96" rx="1" fill="#fff" fillOpacity="0.35" />
      </g>
      <rect x="12" y="78" width="96" height="124" rx="13" stroke="#fff" strokeOpacity="0.65" strokeWidth="1.2" />

      {/* label */}
      <rect x="29" y="121" width="62" height="42" fill="#ece4d4" />
      <rect x="31.5" y="123.5" width="57" height="37" stroke="#1b1512" strokeWidth="0.6" />
      <text x="60" y="132" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="3.4" letterSpacing="1.4" fill="#1b1512">
        SILLAGE
      </text>
      <text x="60" y="145.5" textAnchor="middle" fontFamily="Bodoni Moda Variable, serif" fontStyle="italic" fontSize="8.2" fill="#1b1512">
        {f.name}
      </text>
      <text x="60" y="155" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="2.9" letterSpacing="0.6" fill="#1b1512">
        N° {f.no} — 100 ML
      </text>
    </svg>
  )
}
