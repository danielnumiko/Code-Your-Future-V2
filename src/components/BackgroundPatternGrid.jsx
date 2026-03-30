import { useMemo, useEffect, useState, useRef } from 'react'

const ZIGZAG_PATHS = [
  'M44 32.5614L0 58V42.7368L23.6682 28.8982L0 14.4491V0L44 25.9474V32.5614Z',
  'M87 32.5614L44 58V42.7368L67.1303 28.8982L44 14.4491V0L87 25.9474V32.5614Z',
  'M131 32.5614L87 58V42.7368L110.668 28.8982L87 14.4491V0L131 25.9474V32.5614Z',
  'M174 32.5614L131 58V42.7368L154.13 28.8982L131 14.4491V0L174 25.9474V32.5614Z',
  'M0 90.5614L44 116V100.737L20.3318 86.8982L44 72.4491V58L0 83.9474V90.5614Z',
  'M44 90.5614L87 116V100.737L63.8697 86.8982L87 72.4491V58L44 83.9474V90.5614Z',
  'M87 90.5614L131 116V100.737L107.332 86.8982L131 72.4491V58L87 83.9474V90.5614Z',
  'M131 90.5614L174 116V100.737L150.87 86.8982L174 72.4491V58L131 83.9474V90.5614Z',
  'M44 148.561L0 174V158.737L23.6682 144.898L0 130.449V116L44 141.947V148.561Z',
  'M87 148.561L44 174V158.737L67.1303 144.898L44 130.449V116L87 141.947V148.561Z',
  'M131 148.561L87 174V158.737L110.668 144.898L87 130.449V116L131 141.947V148.561Z',
  'M174 148.561L131 174V158.737L154.13 144.898L131 130.449V116L174 141.947V148.561Z',
]

const UNION_PATHS = [
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

const PATTERNS = [
  { paths: ZIGZAG_PATHS, viewBox: '0 0 174 174', flip: false },
  { paths: ZIGZAG_PATHS, viewBox: '0 0 174 174', flip: true  },
  { paths: UNION_PATHS,  viewBox: '0 0 174 174', flip: false },
  { paths: UNION_PATHS,  viewBox: '0 0 174 174', flip: true  },
]

const CELL = 60
const TRAIL_OPACITIES = [1.0, 0.6, 0.35, 0.18, 0.08, 0.03]
const TRAIL_LENGTH = TRAIL_OPACITIES.length

export default function BackgroundPatternGrid() {
  const [trail, setTrail] = useState([])
  const lastCellRef       = useRef(null)
  const drainRef          = useRef(null)
  const pauseRef          = useRef(null)
  const overInteractiveRef = useRef(false)

  const { cols, rows } = useMemo(() => ({
    cols: Math.ceil(window.innerWidth  / CELL) + 1,
    rows: Math.ceil(window.innerHeight / CELL) + 1,
  }), [])

  // Each cell has a permanently assigned random pattern so SVGs stay in DOM
  const cells = useMemo(() =>
    Array.from({ length: cols * rows }, () =>
      PATTERNS[Math.floor(Math.random() * PATTERNS.length)]
    )
  , [cols, rows])

  useEffect(() => {
    function startDrain() {
      clearInterval(drainRef.current)
      drainRef.current = setInterval(() => {
        setTrail(prev => {
          if (prev.length === 0) { clearInterval(drainRef.current); return prev }
          return prev.slice(0, -1)
        })
      }, 120)
    }

    const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], [role="link"], .cursor-pointer'

    function onOver(e) {
      if (e.target.closest(INTERACTIVE)) {
        overInteractiveRef.current = true
        lastCellRef.current = null
        clearTimeout(pauseRef.current)
        clearInterval(drainRef.current)
        setTrail([])
      }
    }

    function onOut(e) {
      if (e.target.closest(INTERACTIVE)) {
        // Only clear if not moving directly to another interactive element
        if (!e.relatedTarget?.closest(INTERACTIVE)) {
          overInteractiveRef.current = false
        }
      }
    }

    const PROXIMITY = 48 // px — clear trail when this close to any interactive element

    function isNearInteractive(x, y) {
      const els = document.querySelectorAll(INTERACTIVE)
      for (const el of els) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue
        if (
          x >= r.left  - PROXIMITY && x <= r.right  + PROXIMITY &&
          y >= r.top   - PROXIMITY && y <= r.bottom + PROXIMITY
        ) return true
      }
      return false
    }

    function onMove(e) {
      // Clear if directly over or near any interactive element
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (el?.closest(INTERACTIVE) || isNearInteractive(e.clientX, e.clientY)) {
        overInteractiveRef.current = true
        lastCellRef.current = null
        clearInterval(drainRef.current)
        clearTimeout(pauseRef.current)
        setTrail([])
        return
      }

      overInteractiveRef.current = false

      const col = Math.floor(e.clientX / CELL)
      const row = Math.floor(e.clientY / CELL)
      const cellIdx = row * cols + col

      if (lastCellRef.current !== cellIdx) {
        lastCellRef.current = cellIdx
        clearInterval(drainRef.current)
        setTrail(prev => [cellIdx, ...prev.filter(c => c !== cellIdx)].slice(0, TRAIL_LENGTH))
      }

      clearTimeout(pauseRef.current)
      pauseRef.current = setTimeout(startDrain, 180)
    }

    function onLeave() {
      lastCellRef.current = null
      overInteractiveRef.current = false
      clearTimeout(pauseRef.current)
      startDrain()
    }

    document.addEventListener('mouseover',  onOver)
    document.addEventListener('mouseout',   onOut)
    document.addEventListener('mousemove',  onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseout',   onOut)
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      clearInterval(drainRef.current)
      clearTimeout(pauseRef.current)
    }
  }, [cols])

  const trailMap = new Map(trail.map((cellIdx, i) => [cellIdx, i]))

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 1,
        pointerEvents: 'none',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
        overflow: 'hidden',
        opacity: 'var(--grid-opacity, 1)',
      }}
    >
      {cells.map((pattern, i) => {
        const trailPos = trailMap.get(i)
        const opacity  = trailPos !== undefined ? TRAIL_OPACITIES[trailPos] : 0
        return (
          <div
            key={i}
            style={{
              width: CELL, height: CELL,
              opacity,
              transition: 'opacity 0.5s ease',
              color: 'var(--pattern-color)',
            }}
          >
            <svg
              viewBox={pattern.viewBox}
              width="100%" height="100%"
              style={{ display: 'block', transform: pattern.flip ? 'scaleX(-1)' : 'none' }}
            >
              {pattern.paths.map((d, j) => (
                <path key={j} d={d} fill="currentColor" />
              ))}
            </svg>
          </div>
        )
      })}
    </div>
  )
}
