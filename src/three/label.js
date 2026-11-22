import * as THREE from 'three'
import { useEffect, useMemo } from 'react'

const INK = '#1b1512'
const PAPER = '#ece4d4'

const setSpacing = (ctx, px) => {
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`
}

function drawLabel(canvas, f) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height

  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, W, H)

  // paper fibre
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = `rgba(70,48,24,${Math.random() * 0.06})`
    ctx.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 1 + Math.random() * 2)
  }

  // double rule frame
  ctx.strokeStyle = INK
  ctx.lineWidth = 5
  ctx.strokeRect(26, 26, W - 52, H - 52)
  ctx.lineWidth = 1.5
  ctx.strokeRect(42, 42, W - 84, H - 84)

  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  setSpacing(ctx, 22)
  ctx.font = '500 30px "IBM Plex Mono"'
  ctx.fillText('SILLAGE', W / 2 + 11, 116)

  setSpacing(ctx, 0)
  ctx.font = '400 48px "Bodoni Moda Variable"'
  ctx.fillText(`N° ${f.no}`, W / 2, 196)

  let size = 136
  ctx.font = `italic 400 ${size}px "Bodoni Moda Variable"`
  while (ctx.measureText(f.name).width > W - 170 && size > 60) {
    size -= 4
    ctx.font = `italic 400 ${size}px "Bodoni Moda Variable"`
  }
  ctx.fillText(f.name, W / 2, 352)

  ctx.fillRect(W / 2 - 170, 404, 340, 2)
  ctx.beginPath()
  ctx.arc(W / 2, 405, 11, 0, Math.PI * 2)
  ctx.fillStyle = f.color
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = INK
  ctx.stroke()

  ctx.fillStyle = INK
  setSpacing(ctx, 8)
  ctx.font = '500 25px "IBM Plex Mono"'
  ctx.fillText('EXTRAIT DE PARFUM', W / 2 + 4, 476)
  setSpacing(ctx, 4)
  ctx.font = '400 21px "IBM Plex Mono"'
  ctx.fillText(`${f.family.toUpperCase()}  —  100 ML  —  3.4 FL.OZ`, W / 2 + 2, 526)
  setSpacing(ctx, 0)
}

export function useLabelTexture(fragrance) {
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 640
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return { canvas: c, texture: t }
  }, [])

  useEffect(() => {
    let alive = true
    Promise.all([
      document.fonts.load('italic 400 120px "Bodoni Moda Variable"'),
      document.fonts.load('400 48px "Bodoni Moda Variable"'),
      document.fonts.load('500 30px "IBM Plex Mono"'),
      document.fonts.load('400 21px "IBM Plex Mono"'),
    ])
      .catch(() => {})
      .finally(() => {
        if (!alive) return
        drawLabel(canvas, fragrance)
        texture.needsUpdate = true
      })
    return () => {
      alive = false
    }
  }, [fragrance, canvas, texture])

  return texture
}
