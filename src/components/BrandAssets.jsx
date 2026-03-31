// BrandAssets.jsx — shared brand primitives
// Import what you need: RED, BrandDev, DiamondMark, BrandIcon.
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export const RED   = '#dc2627'
export const GREEN = '#40d584'

// ─── SVG path data ────────────────────────────────────────────────────────────
// viewBox 0 0 174 174 — same grid used in Hero mosaic tiles.

export const ZIGZAG_PATHS = [
  // Row 0 — right-pointing (>)
  'M44 32.5614L0 58V42.7368L23.6682 28.8982L0 14.4491V0L44 25.9474V32.5614Z',
  'M87 32.5614L44 58V42.7368L67.1303 28.8982L44 14.4491V0L87 25.9474V32.5614Z',
  'M131 32.5614L87 58V42.7368L110.668 28.8982L87 14.4491V0L131 25.9474V32.5614Z',
  'M174 32.5614L131 58V42.7368L154.13 28.8982L131 14.4491V0L174 25.9474V32.5614Z',
  // Row 1 — left-pointing (<)
  'M0 90.5614L44 116V100.737L20.3318 86.8982L44 72.4491V58L0 83.9474V90.5614Z',
  'M44 90.5614L87 116V100.737L63.8697 86.8982L87 72.4491V58L44 83.9474V90.5614Z',
  'M87 90.5614L131 116V100.737L107.332 86.8982L131 72.4491V58L87 83.9474V90.5614Z',
  'M131 90.5614L174 116V100.737L150.87 86.8982L174 72.4491V58L131 83.9474V90.5614Z',
  // Row 2 — right-pointing (>)
  'M44 148.561L0 174V158.737L23.6682 144.898L0 130.449V116L44 141.947V148.561Z',
  'M87 148.561L44 174V158.737L67.1303 144.898L44 130.449V116L87 141.947V148.561Z',
  'M131 148.561L87 174V158.737L110.668 144.898L87 130.449V116L131 141.947V148.561Z',
  'M174 148.561L131 174V158.737L154.13 144.898L131 130.449V116L174 141.947V148.561Z',
]

export const UNION_PATHS = [
  'M16.75 58H0L27.20 0H44L16.75 58Z',
  'M59.75 58H43L70.20 0H87L59.75 58Z',
  'M102.75 58H86L113.20 0H130L102.75 58Z',
  'M145.75 58H129L156.20 0H173L145.75 58Z',
  'M16.75 116H0L27.20 58H44L16.75 116Z',
  'M59.75 116H43L70.20 58H87L59.75 116Z',
  'M102.75 116H86L113.20 58H130L102.75 116Z',
  'M173 58L145.75 116H129L156.20 58H173Z',
  'M16.75 174H0L27.20 116H44L16.75 174Z',
  'M59.75 174H43L70.20 116H87L59.75 174Z',
  'M102.75 174H86L113.20 116H130L102.75 174Z',
  'M173 116L145.75 174H129L156.20 116H173Z',
]

// ─── BrandDev ─────────────────────────────────────────────────────────────────
// Absolutely-positioned decorative SVG pattern tile — drop-in for PxDev.
export function BrandDev({ variant = 'union', flip = false, size = 99, fillOpacity = 0.18, style }) {
  const paths = variant === 'zigzag' ? ZIGZAG_PATHS : UNION_PATHS
  return (
    <div style={{ position: 'absolute', width: size, height: size, pointerEvents: 'none', ...style }}>
      <svg
        viewBox="0 0 174 174"
        width="100%" height="100%"
        style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}
        aria-hidden="true"
      >
        {paths.map((d, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          return (
            <motion.path
              key={i}
              d={d}
              fill={RED}
              fillOpacity={fillOpacity}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: (row + col) * 0.07 }}
            />
          )
        })}
      </svg>
    </div>
  )
}

// ─── DiamondMark ──────────────────────────────────────────────────────────────
// The CYF red double-chevron logo mark.
export function DiamondMark({ width = 40, fill = RED }) {
  const height = (width / 66.2016) * 60
  return (
    <svg width={width} height={height} viewBox="0 0 66.2016 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M66.2016 30L36.2016 60V44.5527L50.7543 30L36.2016 15.4473V0L66.2016 30Z" fill={fill} />
      <path d="M0 30L29.9592 59.959V44.5127L15.4465 30L29.9592 15.4873V0L0 30Z" fill={fill} />
    </svg>
  )
}

// ─── PixelIcon ────────────────────────────────────────────────────────────────
// Four step icons made of small animated squares (pixel-art style).
// Animate in with a diagonal stagger wave when scrolled into view.
const PCELL   = 12
const PGAP    = 2
const PSTRIDE = PCELL + PGAP

const PIXEL_GRIDS = [
  // 0: Monitor — Intro to Digital (7×7)
  [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1],[0,0,1,1,1,0,0],[0,1,1,1,1,1,0],[0,0,0,0,0,0,0]],
  // 1: Code Brackets < > — Intro to Programming (7×7)
  [[0,0,0,0,0,0,0],[0,0,1,0,1,0,0],[0,1,0,0,0,1,0],[1,0,0,0,0,0,1],[0,1,0,0,0,1,0],[0,0,1,0,1,0,0],[0,0,0,0,0,0,0]],
  // 2: Hourglass — The Piscine (7×7)
  [[1,1,1,1,1,1,1],[0,1,1,1,1,1,0],[0,0,1,1,1,0,0],[0,0,0,1,0,0,0],[0,0,1,1,1,0,0],[0,1,1,1,1,1,0],[1,1,1,1,1,1,1]],
  // 3: Microchip — Software Development (7×7)
  [[0,1,0,1,0,1,0],[0,1,1,1,1,1,0],[1,1,0,0,0,1,1],[1,1,0,1,0,1,1],[1,1,0,0,0,1,1],[0,1,1,1,1,1,0],[0,1,0,1,0,1,0]],
]

export function PixelIcon({ index, inViewDelay = 0, fill = RED }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const grid   = PIXEL_GRIDS[index % PIXEL_GRIDS.length]
  const cols   = grid[0].length
  const size   = cols * PSTRIDE - PGAP  // 7×14 − 2 = 96px

  return (
    <div ref={ref} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {grid.flatMap((row, r) =>
          row.map((on, c) => !on ? null : (
            <motion.rect
              key={`${r}-${c}`}
              x={c * PSTRIDE}
              y={r * PSTRIDE}
              width={PCELL}
              height={PCELL}
              fill={fill}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.35, ease: 'easeOut', delay: inViewDelay + (r + c) * 0.05 }}
            />
          ))
        )}
      </svg>
    </div>
  )
}

// ─── PixelStatNumber ──────────────────────────────────────────────────────────
// Numbers rendered as 5×7 pixel-art blocks. Use value+suffix for stats,
// or label for pre-formatted strings like "01", "02".
const SC = 10, SG = 2, SS = SC + SG
const CHAR_W = 5 * SS - SG  // 58px
const CHAR_H = 7 * SS - SG  // 82px

const PX = {
  '0': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '1': [[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
  '2': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1]],
  '3': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,1,1,0],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '4': [[0,0,0,1,0],[0,0,1,1,0],[0,1,0,1,0],[1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0],[0,0,0,1,0]],
  '5': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '6': [[0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '7': [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  '8': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '9': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0]],
  '.': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,1,1,0,0],[0,1,1,0,0]],
  '+': [[0,0,0,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0]],
  '×': [[0,0,0,0,0],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1],[0,0,0,0,0]],
  '%': [[1,1,0,0,1],[1,1,0,1,0],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[0,1,0,1,1],[1,0,0,1,1]],
}

function PixelChar({ char, inView, delay, fill = GREEN }) {
  const grid = PX[char]
  if (!grid) return null
  return (
    <svg viewBox={`0 0 ${CHAR_W} ${CHAR_H}`} width={CHAR_W} height={CHAR_H} style={{ display: 'block', flexShrink: 0 }}>
      {grid.flatMap((row, r) =>
        row.map((on, c) => !on ? null : (
          <motion.rect
            key={`${r}-${c}`}
            x={c * SS} y={r * SS} width={SC} height={SC}
            fill={fill}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, ease: 'easeOut', delay: delay + (r + c) * 0.04 }}
          />
        ))
      )}
    </svg>
  )
}

export function PixelStatNumber({ value, decimals = 0, suffix = '', label, fill = GREEN }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const str    = label ?? ((decimals > 0 ? value.toFixed(decimals) : String(value)) + suffix)
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
      {[...str].map((ch, i) => (
        <PixelChar key={i} char={ch} inView={inView} delay={i * 0.08} fill={fill} />
      ))}
    </div>
  )
}

// ─── BrandIcon ────────────────────────────────────────────────────────────────
// Four step icons — all identical in size (99×99, viewBox 174×174, 12 paths).
// Variants use the two brand pattern types in normal and flipped orientations:
//   0 → union  normal  → parallelogram //// slashes
//   1 → zigzag normal  → alternating ><>< chevrons
//   2 → union  flipped → parallelogram \\\\ backslashes
//   3 → zigzag flipped → mirrored chevrons
// Each path fades in on a diagonal stagger, matching the mosaic tile animation.
const ICON_VARIANTS = [
  { paths: UNION_PATHS,  flip: false },
  { paths: ZIGZAG_PATHS, flip: false },
  { paths: UNION_PATHS,  flip: true  },
  { paths: ZIGZAG_PATHS, flip: true  },
]

export function BrandIcon({ index, inViewDelay = 0, fill = RED }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const { paths, flip } = ICON_VARIANTS[index]

  return (
    <div ref={ref} style={{ width: 99, height: 99 }} aria-hidden="true">
      <svg
        viewBox="0 0 174 174"
        width="99" height="99"
        style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}
      >
        {paths.map((d, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          return (
            <motion.path
              key={i}
              d={d}
              fill={fill}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, ease: 'easeOut', delay: inViewDelay + (row + col) * 0.07 }}
            />
          )
        })}
      </svg>
    </div>
  )
}
