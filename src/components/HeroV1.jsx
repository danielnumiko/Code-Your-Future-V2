/**
 * HeroV4 — Concept 4. Partner brand direction.
 *
 * Scroll mechanics: identical to V3 (clip, mosaic parallax, sticky tile peel, stats).
 * Brand: red (#dc2627), double-chevron diamond logo mark, SVG brand-pattern tiles
 * replacing some mosaic tiles. Each SVG path animates in with a diagonal stagger.
 */

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, animate } from 'framer-motion'
import { PixelStatNumber } from './BrandAssetsV4'
import { GlitchHeading } from './FadeIn'

// ─── Constants ────────────────────────────────────────────────────────────────

const GREEN        = '#40d584'
const POSTER    = '/:my-hero-image.jpg'
const TILE_VW   = 10
const HERO_TILE = '12.5vw'   // 216/1728 — matches Figma grid
const CLIP_S    = 0.20
const CLIP_E    = 0.55

// ─── Hero grid tiles ──────────────────────────────────────────────────────────
// Black tiles + 1 green scroll-cue tile.  Positions as % of viewport (derived
// from Figma: tile = 216px on 1728px canvas, hero = 1080px tall).
// Row count for col-0 is computed from the live viewport inside the component.
const COL0_DELAYS = [0.10, 0.20, 0.50, 0.15, 0.25]
const ACCENT_TILES = [
  { l: '12.5%', row: 4, delay: 0.30 },
  { l: '12.5%', row: 2, delay: 0.40 },
  { l: '87.5%', row: 1, delay: 0.35 },
  { l: '25%',   row: 1, delay: 0.45 },
  { l: '37.5%', row: 0, delay: 0.55 },
  { l: '75%',   row: 0, delay: 0.40 },
]

// ─── SVG path data ─────────────────────────────────────────────────────────────
// All paths use a 174×174 viewBox (= TILE_VW × TILE_VW at 1728px viewport).
// Derived from Frame25 (zigzag) and Variant3 (union marks) Figma components.

// 4-column × 3-row zigzag: rows alternate > < > direction
const ZIGZAG_PATHS = [
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

// 4-column × 3-row union marks; col 3 rows 1-2 use the "/" slash variant
// Col x offsets: 0, 43, 86, 129. Row y offsets: 0, 58, 116.
const UNION_PATHS = [
  // Row 0 — all Union marks
  'M16.75 58H0L27.20 0H44L16.75 58Z',
  'M59.75 58H43L70.20 0H87L59.75 58Z',
  'M102.75 58H86L113.20 0H130L102.75 58Z',
  'M145.75 58H129L156.20 0H173L145.75 58Z',
  // Row 1 — col 3 is Slash
  'M16.75 116H0L27.20 58H44L16.75 116Z',
  'M59.75 116H43L70.20 58H87L59.75 116Z',
  'M102.75 116H86L113.20 58H130L102.75 116Z',
  'M173 58L145.75 116H129L156.20 58H173Z',
  // Row 2 — col 3 is Slash
  'M16.75 174H0L27.20 116H44L16.75 174Z',
  'M59.75 174H43L70.20 116H87L59.75 174Z',
  'M102.75 174H86L113.20 116H130L102.75 174Z',
  'M173 116L145.75 174H129L156.20 116H173Z',
]

// ─── Tile data ────────────────────────────────────────────────────────────────

const COL_OUTER_L = [
  { src: 'https://images.unsplash.com/photo-1671726203454-5d7a5370a9f4?auto=format&fit=crop&w=800&q=85', alt: 'Student with dreadlocks at laptop' },
  { src: 'https://images.unsplash.com/photo-1573164713712-03790a178651?auto=format&fit=crop&w=800&q=85', alt: 'Student at laptop' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=85', alt: 'People collaborating at laptops' },
]
const COL_INNER_L = [
  { src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=85', alt: 'Person studying on laptop' },
  { src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=85', alt: 'Developer at laptop' },
  { empty: true },
]
const COL_INNER_R = [
  { src: 'https://images.unsplash.com/photo-1580894895938-bd31a62ed8ba?auto=format&fit=crop&w=800&q=85', alt: 'Student coding at desk' },
  { src: 'https://images.unsplash.com/photo-1580894896813-652ff5aa8146?auto=format&fit=crop&w=800&q=85', alt: 'Woman coding at desk' },
  { src: 'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=800&q=85', alt: 'Student with laptop' },
]
const COL_OUTER_R = [
  { src: 'https://images.unsplash.com/photo-1713946598544-c3d106930f72?auto=format&fit=crop&w=800&q=85', alt: 'Student at desk' },
  { src: 'https://images.unsplash.com/photo-1758270705317-3ef6142d306f?auto=format&fit=crop&w=800&q=85', alt: 'Students around a laptop' },
  { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=85', alt: 'Team working together' },
]

const STATS_DATA = [
  {
    numericValue: 300, suffix: '+', decimals: 0,
    label: 'graduates placed in tech roles',
    body: 'Our graduates now work at BBC, Financial Times, Morgan Stanley, Capgemini, and hundreds more leading employers.',
    image: { src: 'https://images.unsplash.com/photo-1543270122-f7a11ad44f3a?auto=format&fit=crop&w=800&q=85', alt: 'Student with laptop' },
  },
  {
    numericValue: 5.5, suffix: '×', decimals: 1,
    label: 'average salary increase',
    body: 'CYF graduates typically earn 5.5 times more after completing the programme than before they joined.',
    image: { src: 'https://images.unsplash.com/photo-1580894895938-bd31a62ed8ba?auto=format&fit=crop&w=800&q=85', alt: 'Student coding' },
  },
  {
    numericValue: 95, suffix: '%', decimals: 0,
    label: 'employed within six months',
    body: 'Nearly all our graduates secure a tech role within six months of completing the programme.',
    image: { src: 'https://images.unsplash.com/photo-1671726203454-5d7a5370a9f4?auto=format&fit=crop&w=800&q=85', alt: 'Student with dreadlocks' },
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v, lo = 0, hi = 1) { return Math.min(hi, Math.max(lo, v)) }
function easeSnappy(t) { return 1 - Math.pow(1 - clamp(t), 4) }

// ─── BrandPatternTile ─────────────────────────────────────────────────────────
// Renders an SVG brand-pattern tile. Each path fades in with a diagonal stagger.
// flip=true applies scaleX(-1) to mirror horizontally (matching Figma rotate+scaleY).

function BrandPatternTile({ variant, flip = false }) {
  const paths = variant === 'zigzag' ? ZIGZAG_PATHS : UNION_PATHS
  return (
    <svg
      viewBox={variant === 'zigzag' ? '0 0 174 182.7' : '0 0 174 174'}
      width="100%" height="100%"
      overflow="visible"
      style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}
      aria-hidden="true"
    >
      {paths.map((d, i) => {
        const row = Math.floor(i / 4)
        const col = i % 4
        const delay = (row + col) * 0.07  // diagonal wave from top-left
        return (
          <motion.path
            key={i}
            d={d}
            fill={GREEN}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.45, ease: 'easeOut', delay }}
          />
        )
      })}
    </svg>
  )
}

// ─── Tile ─────────────────────────────────────────────────────────────────────

function Tile({ item }) {
  const sz = { width: `${TILE_VW}vw`, height: `${TILE_VW}vw`, flexShrink: 0 }
  if (item.empty) {
    return <div style={sz} />
  }
  if (item.brandPattern) {
    return <div style={{ ...sz, position: 'relative' }}><BrandPatternTile variant={item.brandPattern} flip={item.flip} /></div>
  }
  return (
    <motion.div
      style={{ ...sz, overflow: 'hidden', position: 'relative' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <img
        src={item.src} alt={item.alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        draggable={false}
      />
    </motion.div>
  )
}

// ─── CountUp ─────────────────────────────────────────────────────────────────

function CountUp({ to, decimals = 0, suffix = '' }) {
  const ref    = useRef(null)
  const hasRun = useRef(false)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true
          animate(0, to, {
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: v => setValue(v),
          })
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to])

  const display = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toString()
  return <span ref={ref}>{display}{suffix}</span>
}


// ─── Main component ───────────────────────────────────────────────────────────

export default function HeroV1({ onSwitchConcept }) {
  const heroRef   = useRef(null)
  const mosaicRef = useRef(null)
  const videoRef  = useRef(null)
  const [activeStatIndex, setActiveStatIndex] = useState(0)

  const [numRows, setNumRows] = useState(
    () => Math.ceil(window.innerHeight / (window.innerWidth * 0.125)) + 1
  )
  useEffect(() => {
    const update = () => setNumRows(
      Math.ceil(window.innerHeight / (window.innerWidth * 0.125)) + 1
    )
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 1
  }, [])

  // ── Section 1: video clip ─────────────────────────────────────────────────
  const { scrollYProgress: hero } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })

  const videoClip = useTransform(hero, v => {
    const t  = easeSnappy(clamp((v - CLIP_S) / (CLIP_E - CLIP_S)))
    const vw = window.innerWidth
    const vh = window.innerHeight
    const sq = TILE_VW / 100 * vw
    const rl = t * (vw - sq) / 2
    const tb = t * (vh - sq) / 2
    return `inset(${tb.toFixed(0)}px ${rl.toFixed(0)}px ${tb.toFixed(0)}px ${rl.toFixed(0)}px)`
  })

  const videoScale = useTransform(hero, v => {
    const t = easeSnappy(clamp((v - CLIP_S) / (CLIP_E - CLIP_S)))
    return 1 - t * 0.7
  })

  const scrimOp    = useTransform(hero, [0, CLIP_S, CLIP_E], [0.4, 0.4, 0])
  const heroOp     = useTransform(hero, [CLIP_S - 0.08, CLIP_S], [1, 0])
  const heroY      = useTransform(hero, [CLIP_S - 0.08, CLIP_S], [0, -20])
  const gridOp     = useTransform(hero, [0.05, 0.18], [1, 0])
  const wordmarkOp      = useTransform(hero, [0, 0.12], [1, 0])
  const cueOp           = useTransform(hero, [0, 0.08], [1, 0])
  const hamburgerScale  = useTransform(hero, [0, 0.4], [1, 0.5])

  // ── Section 2: mosaic parallax ────────────────────────────────────────────
  const { scrollYProgress: mosaic } = useScroll({
    target: mosaicRef,
    offset: ['start end', 'end start'],
  })

  const outerY = useTransform(mosaic, [0, 1], [600, -200])

  // ── Tile peel (Section 2 → 3) ─────────────────────────────────────────────
  function stickyProgress() {
    const VH = window.innerHeight
    const vw = window.innerWidth
    return (2.3 * VH - (TILE_VW / 100) * vw) / (2.5 * VH)
  }

  const tileScale = useTransform(mosaic, v => {
    const s = stickyProgress()
    const t = easeSnappy(clamp((v - s) / (1 - s)))
    const vw = window.innerWidth
    const margin = Math.min(80, Math.max(20, 8 + 0.0375 * vw))
    const gap    = Math.min(72, Math.max(40, 33.6 + 0.02 * vw))
    const colW   = (vw - 2 * margin - 3 * gap) / 4
    const minScale = (TILE_VW / 100 * vw) / colW
    return minScale + t * (1 - minScale)
  })

  const tileX = useTransform(mosaic, v => {
    const s = stickyProgress()
    const t = easeSnappy(clamp((v - s) / (1 - s)))
    const vw = window.innerWidth
    const margin = Math.min(80, Math.max(20, 8 + 0.0375 * vw))
    const gap    = Math.min(72, Math.max(40, 33.6 + 0.02 * vw))
    const colW   = (vw - 2 * margin - 3 * gap) / 4
    const col2Left = margin + colW + gap
    const innerLeft = vw / 6
    return (1 - t) * (innerLeft - col2Left)
  })

  const tileY = useTransform(mosaic, v => {
    const s = stickyProgress()
    const t = easeSnappy(clamp((v - s) / (1 - s)))
    const vh = window.innerHeight
    const vw = window.innerWidth
    const margin = Math.min(80, Math.max(20, 8 + 0.0375 * vw))
    const gap    = Math.min(72, Math.max(40, 33.6 + 0.02 * vw))
    const colW   = (vw - 2 * margin - 3 * gap) / 4
    return -(1 - t) * (vh - colW) / 2
  })

  // Nav button style
  const navBtn = {
    fontFamily: 'Raleway, sans-serif', fontWeight: 600, fontSize: 18,
    color: 'white', background: 'none', border: 'none',
    cursor: 'pointer', padding: 0, lineHeight: 1,
  }

  const heroTiles = [
    ...Array.from({ length: numRows }, (_, row) => ({ l: '0%', row, delay: COL0_DELAYS[row % 5] })),
    ...ACCENT_TILES,
  ]

  return (
    <>
      {/* ── Hamburger — top right ───────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed', right: 0, top: 0, zIndex: 100,
          width: HERO_TILE, height: HERO_TILE,
        }}
      >
        <div style={{ width: '100%', height: '100%', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
            <rect width="24" height="2" fill="white" />
            <rect y="8" width="24" height="2" fill="white" />
            <rect y="16" width="24" height="2" fill="white" />
          </svg>
        </div>
      </div>

      {/* ── Fixed logo — top left ───────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', left: 50, top: 50, zIndex: 100,
        filter: 'drop-shadow(0px 3px 22.5px rgba(0,0,0,0.3))',
      }}>
        <motion.img src="/V2-logo.svg" alt="Code Your Future"
          style={{ display: 'block', height: 60, width: 'auto', opacity: wordmarkOp }} />
        <img src="/V2-mark.svg" alt="" aria-hidden="true"
          style={{ position: 'absolute', left: 0, top: 0, height: 60, width: 'auto' }} />
      </div>

      {/* ── Fixed nav box — top centre ───────────────────────────────────────── */}
      <div style={{
        position: 'fixed', left: '50%', transform: 'translateX(-50%)', top: 42, zIndex: 100,
        background: 'black',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '20px 30px',
      }}>
        <button style={navBtn} onClick={() => onSwitchConcept?.('v1')}>Concept 1</button>
        <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 900, fontSize: 18, color: GREEN, lineHeight: 1 }}>/</span>
        <button style={navBtn} onClick={() => onSwitchConcept?.('v2')}>Concept 2</button>
        <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 900, fontSize: 18, color: GREEN, lineHeight: 1 }}>/</span>
        <button style={navBtn} onClick={() => onSwitchConcept?.('v3')}>Concept 3</button>
        <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 900, fontSize: 18, color: GREEN, lineHeight: 1 }}>/</span>
        <button style={navBtn} onClick={() => onSwitchConcept?.('v4')}>Concept 4</button>
      </div>

      {/* ================================================================
          Section 1 — sticky hero (170 vh)
          ================================================================ */}
      <section
        ref={heroRef}
        style={{ height: '170vh', marginBottom: '-70vh', position: 'relative', zIndex: 2 }}
      >
        <div className="sticky top-0 h-screen" style={{ overflow: 'hidden' }}>

          {/* Video */}
          <motion.div className="absolute inset-0" style={{ clipPath: videoClip, willChange: 'clip-path' }}>
            <motion.div className="absolute inset-0" style={{ scale: videoScale, willChange: 'transform' }}>
              <img
                src={POSTER}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
                draggable={false}
              />
              <motion.div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: scrimOp }} />
            </motion.div>
          </motion.div>

          {/* Hero grid overlay — black tiles + green scroll-cue tile */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: gridOp, zIndex: 4 }}
          >
            {heroTiles.map((tile, i) => (
              <motion.div
                key={`${tile.l}-${tile.row}`}
                style={{
                  position: 'absolute', left: tile.l, bottom: `calc(${tile.row} * ${HERO_TILE})`,
                  width: HERO_TILE, height: HERO_TILE, background: 'black',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: tile.delay, ease: 'easeOut' }}
              />
            ))}
            {/* Green scroll-cue tile at (12.5%, row 4) */}
            <motion.div
              style={{
                position: 'absolute', left: '12.5%', bottom: 0,
                width: HERO_TILE, height: HERO_TILE, background: GREEN,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.6, ease: 'easeOut' }}
            >
              <svg width="22" height="52" viewBox="0 0 42.125 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M21.0996 87.9424L33.3076 68.2744H42.125L22.9844 100H18.8389L0 68.2744H9.19336L21.0996 87.9424ZM24.5918 68.1992H17.5078V0H24.5918V68.1992Z" fill="black" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Heading — two lines, fades before clip */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: heroOp, y: heroY, zIndex: 10 }}
          >
            {/* Line 1: Fix.{Stop} — left */}
            <div style={{ position: 'absolute', left: 50, bottom: '42%' }}>
              <GlitchHeading
                segments={[
                  { text: 'Fix.', color: GREEN },
                  { text: '{', color: GREEN },
                  { text: 'Stop', color: 'white' },
                  { text: '}', color: GREEN },
                ]}
                style={{
                  fontFamily: 'Raleway, sans-serif', fontWeight: 600,
                  fontSize: 'clamp(40px, 8.68vw, 150px)',
                  color: 'white', lineHeight: 1, margin: 0,
                  textShadow: '0px 4px 30px rgba(0,0,0,0.5)',
                }}
              />
            </div>
            {/* Line 2: <the.churn> — right */}
            <div style={{ position: 'absolute', right: 37, bottom: '22%', textAlign: 'right' }}>
              <GlitchHeading
                delay={1.0}
                segments={[
                  { text: '<', color: GREEN },
                  { text: 'the', color: 'white' },
                  { text: '.', color: GREEN },
                  { text: 'churn', color: 'white' },
                  { text: '>', color: GREEN },
                ]}
                style={{
                  fontFamily: 'Raleway, sans-serif', fontWeight: 600,
                  fontSize: 'clamp(40px, 8.68vw, 150px)',
                  color: 'white', lineHeight: 1, margin: 0,
                  textShadow: '0px 4px 30px rgba(0,0,0,0.5)',
                }}
              />
            </div>
          </motion.div>


        </div>
      </section>

      {/* ================================================================
          Shared wrapper — containing block for sticky tile in Section 3
          ================================================================ */}
      <div style={{ position: 'relative' }}>

        {/* ================================================================
            Section 2 — mosaic tile grid (150 vh)
            ================================================================ */}
        <section
          ref={mosaicRef}
          className="bg-black"
          style={{ height: '150vh', position: 'relative', overflow: 'clip', overflowClipMargin: '600px', zIndex: 1 }}
        >

          {/* Outer left — parallax */}
          <motion.div
            className="absolute flex flex-col justify-between"
            style={{ left: '1.5vw', top: '-10vh', height: '150vh', y: outerY, willChange: 'transform' }}
          >
            {COL_OUTER_L.map((item, i) => <Tile key={i} item={item} />)}
          </motion.div>

          {/* Inner left — static */}
          <div className="absolute flex flex-col justify-between" style={{ left: '16.667%', top: '-10vh', height: '150vh' }}>
            {COL_INNER_L.map((item, i) => <Tile key={i} item={item} />)}
          </div>

          {/* Inner right — static */}
          <div className="absolute flex flex-col justify-between" style={{ right: '16.667%', top: '-10vh', height: '150vh' }}>
            {COL_INNER_R.map((item, i) => <Tile key={i} item={item} />)}
          </div>

          {/* Outer right — parallax */}
          <motion.div
            className="absolute flex flex-col justify-between"
            style={{ right: '1.5vw', top: '-10vh', height: '150vh', y: outerY, willChange: 'transform' }}
          >
            {COL_OUTER_R.map((item, i) => <Tile key={i} item={item} />)}
          </motion.div>

          {/* Centre text — floating, no box */}
          <div
            className="absolute inset-x-0 flex flex-col items-center pointer-events-none"
            style={{ top: '52%', transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <div style={{
              width: 648, maxWidth: '37.5vw',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32,
              padding: '40px', textAlign: 'center',
            }}>
              <GlitchHeading
                segments={[
                  { text: '{', color: GREEN },
                  { text: 'Stop', color: 'white' },
                  { text: '}<', color: GREEN },
                  { text: 'overpaying for seniors who leave', color: 'white' },
                  { text: '>', color: GREEN },
                  { text: ' ', color: 'white' },
                  { text: '{', color: GREEN },
                  { text: 'Start', color: 'white' },
                  { text: '}<', color: GREEN },
                  { text: 'building a team that stays', color: 'white' },
                  { text: '>', color: GREEN },
                ]}
                style={{
                  fontFamily: 'Raleway, sans-serif', fontWeight: 600,
                  fontSize: 'clamp(18px, 3.47vw, 60px)',
                  color: 'white', lineHeight: 1.2, margin: 0,
                  textShadow: '0 2px 24px rgba(0,0,0,0.6)',
                }}
              />
              <p style={{
                fontFamily: 'Raleway, sans-serif', fontWeight: 400,
                fontSize: 'clamp(14px, 1.33vw, 23px)',
                color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, margin: 0,
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
              }}>
                Changing lives through free, world-class tech training for people from low-income backgrounds
              </p>
              <div className="flex gap-s items-center" style={{ pointerEvents: 'auto' }}>
                <a
                  href="/partner"
                  className="font-raleway font-semibold whitespace-nowrap transition-colors"
                  style={{ background: GREEN, color: 'black', padding: '14px 24px', borderRadius: 0, display: 'inline-block', textDecoration: 'none', fontSize: 18 }}
                >
                  Partner with us
                </a>
                <a
                  href="/apply"
                  className="font-raleway font-semibold whitespace-nowrap transition-colors"
                  style={{ background: 'transparent', border: '2px solid white', color: 'white', padding: '12px 22px', borderRadius: 0, display: 'inline-block', textDecoration: 'none', fontSize: 18 }}
                >
                  Apply to train
                </a>
              </div>
            </div>
          </div>

        </section>

        {/* ================================================================
            Section 3 — 4-column grid: spacer | sticky tile | scrolling stats | spacer
            ================================================================ */}
        <section className="bg-black">
          <div
            className="max-w-viewport mx-auto"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: 'clamp(40px, calc(33.6px + 2vw), 72px)',
              padding: '0 clamp(20px, calc(8px + 3.75vw), 80px)',
              alignItems: 'start',
            }}
          >
            {/* Col 1 — spacer */}
            <div />

            {/* Col 2 — sticky tile */}
            <div style={{
              alignSelf: 'start', position: 'sticky', top: 0,
              height: '100vh', display: 'flex', alignItems: 'center',
              marginTop: `calc(-10vh - ${TILE_VW}vw)`, zIndex: 2,
            }}>
              <motion.div
                className="relative overflow-hidden w-full"
                style={{ aspectRatio: '1 / 1', scale: tileScale, x: tileX, y: tileY, transformOrigin: 'top left' }}
              >
                <AnimatePresence mode="sync">
                  <motion.img
                    key={activeStatIndex}
                    src={STATS_DATA[activeStatIndex].image.src}
                    alt={STATS_DATA[activeStatIndex].image.alt}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    draggable={false}
                  />
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Col 3 — scrolling stats */}
            <div style={{ paddingTop: '10vh', paddingBottom: '25vh' }}>
              {STATS_DATA.map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center text-center"
                  style={{ minHeight: '100vh', justifyContent: 'center' }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  onViewportEnter={() => setActiveStatIndex(i)}
                  viewport={{ once: false, margin: '-38% 0px -38% 0px' }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                >
                  <div style={{ paddingBottom: '8vh' }}>
                    <div className="mb-s flex justify-center">
                      <PixelStatNumber value={stat.numericValue} decimals={stat.decimals} suffix={stat.suffix} />
                    </div>
                    <h3 className="font-raleway font-medium text-white text-h5 tracking-tight leading-snug mb-xs">
                      {stat.label}
                    </h3>
                    <p className="font-raleway text-white/60 text-base leading-relaxed">
                      {stat.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Col 4 — spacer */}
            <div />
          </div>
        </section>

      </div>{/* end shared wrapper */}
    </>
  )
}
