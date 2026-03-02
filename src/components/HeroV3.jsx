/**
 * HeroV3 — Concept 3. Volunteer.
 *
 * Forked from HeroV4 (Train with us). Edit this file independently — changes
 * here will not affect HeroV4 and vice versa.
 */

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, animate } from 'framer-motion'
import { TextRevealSegments } from './FadeIn'

// ─── Constants ────────────────────────────────────────────────────────────────

const RED      = '#dc2627'
const POSTER   = 'https://images.unsplash.com/photo-1671726203454-5d7a5370a9f4?auto=format&fit=crop&w=1920&q=85'
const TILE_VW  = 10
const CLIP_S   = 0.20
const CLIP_E   = 0.55

// ─── Shape data (from Figma) ──────────────────────────────────────────────────

const SHAPES = {
  chevronRight: {
    viewBox: '0 0 175 175',
    d: 'M175 98.2456L0 175V128.947L94.1351 87.193L0 43.5965V0L175 78.2895V98.2456Z',
    flip: false,
  },
  chevronLeft: {
    viewBox: '0 0 175 175',
    d: 'M175 98.2456L0 175V128.947L94.1351 87.193L0 43.5965V0L175 78.2895V98.2456Z',
    flip: true,
  },
  slash: {
    viewBox: '0 0 175 175',
    d: 'M175 0L44.0807 175H0L130.675 0H175Z',
    flip: false,
  },
  curly: {
    viewBox: '0 0 174.753 175',
    d: 'M75 34.2871H56.667V70.5898C56.667 73.616 55.6668 76.4912 53.667 79.2148C51.667 81.7873 48.8886 84.1335 45.333 86.252C48.6662 88.219 51.333 90.6397 53.333 93.5146C55.5552 96.2384 56.667 99.038 56.667 101.913V140.713H75V175H24.333C22.7775 175 21.1107 174.546 19.333 173.638C17.5555 172.73 16.667 170.914 16.667 168.19V111.9C16.667 107.815 14.8886 104.41 11.333 101.687C7.99967 98.8115 4.22222 97.1463 0 96.6924V75.3564C3.11101 75.3564 5.88862 74.6 8.33301 73.0869C10.9996 71.4225 12.9997 69.4552 14.333 67.1855C15.8885 64.9159 16.6669 62.7219 16.667 60.6035V6.80957C16.667 3.93475 17.5555 2.11901 19.333 1.3623C21.3329 0.454467 22.9997 7.14257e-05 24.333 0H75V34.2871ZM150.204 0C151.325 0 152.894 0.454396 154.912 1.3623C156.93 2.11891 157.938 3.93454 157.938 6.80957V60.6035C157.939 62.7218 158.611 64.916 159.956 67.1855C161.525 69.4553 163.544 71.4224 166.01 73.0869C168.7 74.6 171.614 75.3564 174.753 75.3564V96.6924C170.269 97.1463 166.346 98.8115 162.983 101.687C159.621 104.41 157.938 107.815 157.938 111.9V168.19C157.938 170.914 156.93 172.73 154.912 173.638C153.119 174.546 151.549 175 150.204 175H98.7529V140.713H117.248V101.913C117.248 99.038 118.258 96.2384 120.275 93.5146C122.517 90.6397 125.432 88.219 129.019 86.252C125.432 84.1335 122.517 81.7873 120.275 79.2148C118.258 76.4912 117.248 73.6162 117.248 70.5898V34.2871H98.7529V0H150.204Z',
    flip: false,
  },
}

// ─── Tile data — all photo columns ────────────────────────────────────────────

const COL_OUTER_L = [
  { src: 'https://images.unsplash.com/photo-1671726203454-5d7a5370a9f4?auto=format&fit=crop&w=800&q=85', alt: 'Student with dreadlocks at laptop' },
  { src: 'https://images.unsplash.com/photo-1573164713712-03790a178651?auto=format&fit=crop&w=800&q=85', alt: 'Student at laptop' },
  { brandPattern: 'chevronLeft' },
]
const COL_INNER_L = [
  { src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=85', alt: 'Person studying on laptop' },
  { brandPattern: 'slash' },
  { empty: true },
]
const COL_INNER_R = [
  { brandPattern: 'chevronRight' },
  { src: 'https://images.unsplash.com/photo-1580894896813-652ff5aa8146?auto=format&fit=crop&w=800&q=85', alt: 'Woman coding at desk' },
  { src: 'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=800&q=85', alt: 'Student with laptop' },
]
const COL_OUTER_R = [
  { src: 'https://images.unsplash.com/photo-1713946598544-c3d106930f72?auto=format&fit=crop&w=800&q=85', alt: 'Student at desk' },
  { src: 'https://images.unsplash.com/photo-1758270705317-3ef6142d306f?auto=format&fit=crop&w=800&q=85', alt: 'Students around a laptop' },
  { brandPattern: 'curly' },
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

function BrandPatternTile({ variant }) {
  const shape = SHAPES[variant]
  if (!shape) return null
  return (
    <svg
      viewBox={shape.viewBox}
      width="100%" height="100%"
      overflow="visible"
      style={{ display: 'block', transform: shape.flip ? 'scaleX(-1)' : 'none' }}
      aria-hidden="true"
    >
      <motion.path
        d={shape.d}
        fill={RED}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
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
    return (
      <div style={{ ...sz, position: 'relative' }}>
        <BrandPatternTile variant={item.brandPattern} flip={item.flip} />
      </div>
    )
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

export default function HeroV3({ onSwitchConcept }) {
  const heroRef   = useRef(null)
  const mosaicRef = useRef(null)
  const videoRef  = useRef(null)
  const [activeStatIndex, setActiveStatIndex] = useState(0)

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
  const wordmarkOp = useTransform(hero, [0, 0.12], [1, 0])

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
    color: '#1a1a1a', background: 'none', border: 'none',
    cursor: 'pointer', padding: 0, lineHeight: 1,
  }

  return (
    <>
      {/* ── Fixed logo — top left ───────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', left: 50, top: 60, zIndex: 100,
        filter: 'drop-shadow(0px 3px 22.5px rgba(0,0,0,0.3))',
      }}>
        <motion.img src="/V3-logo.svg" alt="Code Your Future"
          style={{ display: 'block', height: 60, width: 'auto', opacity: wordmarkOp }} />
        <img src="/V3-mark.svg" alt="" aria-hidden="true"
          style={{ position: 'absolute', left: 34, top: 0, height: 37, width: 'auto' }} />
      </div>

      {/* ── Fixed nav box — top right ─────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', right: 50, top: 61, zIndex: 100,
        background: 'white',
        boxShadow: '0px 3px 22.5px 0px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '20px 30px',
      }}>
        <button style={navBtn} onClick={() => onSwitchConcept?.('v1')}>Concept 1</button>
        <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 900, fontSize: 18, color: RED, lineHeight: 1 }}>/</span>
        <button style={navBtn} onClick={() => onSwitchConcept?.('v2')}>Concept 2</button>
        <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 900, fontSize: 18, color: RED, lineHeight: 1 }}>/</span>
        <button style={navBtn} onClick={() => onSwitchConcept?.('v3')}>Concept 3</button>
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
              <style>{`
                @keyframes kenBurns3 {
                  0%   { transform: scale(1.08) translate(0%, 0%); }
                  100% { transform: scale(1.16) translate(-2%, -1.5%); }
                }
                .ken-burns-3 { animation: kenBurns3 18s ease-in-out infinite alternate; transform-origin: center center; }
              `}</style>
              <video
                ref={videoRef}
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover ken-burns-3"
                poster={POSTER}
              >
                <source src="/hero-video.mp4" type="video/mp4" />
              </video>
              <motion.div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: scrimOp }} />
            </motion.div>
          </motion.div>

          {/* Heading + patterns — all fade together before clip */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: heroOp, y: heroY, zIndex: 10 }}
          >
            <div style={{ position: 'absolute', left: 50, bottom: 50, maxWidth: '57.4vw' }}>
              <TextRevealSegments
                as="p"
                style={{
                  fontFamily: 'Raleway, sans-serif', fontWeight: 600,
                  fontSize: 'clamp(36px, 6.94vw, 120px)',
                  color: 'white', lineHeight: 1.2, margin: 0,
                  textShadow: '0px 4px 30px rgba(0,0,0,0.3)',
                }}
                onMount={true}
                delay={0.3}
                segments={[
                  { text: '<', color: RED },
                  { text: 'Stop overpaying for seniors who leave', color: 'white' },
                  { text: '/>', color: RED },
                ]}
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
          className="bg-white"
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

          {/* Centre text — white box, positioned below the landing video tile */}
          <div
            className="absolute inset-x-0 flex flex-col items-center pointer-events-none"
            style={{ top: '52%', transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <div style={{
              width: 648, maxWidth: '37.5vw',
              background: 'white',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32,
              padding: '40px', textAlign: 'center',
            }}>
              <TextRevealSegments
                as="p"
                style={{
                  fontFamily: 'Raleway, sans-serif', fontWeight: 600,
                  fontSize: 'clamp(18px, 3.47vw, 60px)',
                  color: '#1a1a1a', lineHeight: 1.2, margin: 0,
                }}
                segments={[
                  { text: '<', color: RED },
                  { text: 'Changing lives through free, world-class tech training for people from low-income backgrounds', color: '#1a1a1a' },
                  { text: '/>', color: RED },
                ]}
              />
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', pointerEvents: 'auto' }}>
                <a
                  href="/partner"
                  className="font-raleway font-semibold text-xs whitespace-nowrap"
                  style={{ background: RED, color: '#fff', padding: '14px 24px', borderRadius: 0, display: 'inline-block', textDecoration: 'none' }}
                >
                  Partner with us
                </a>
                <a
                  href="/apply"
                  className="font-raleway font-semibold text-xs whitespace-nowrap"
                  style={{ background: 'white', border: `2px solid ${RED}`, color: RED, padding: '12px 22px', borderRadius: 0, display: 'inline-block', textDecoration: 'none' }}
                >
                  Apply to train
                </a>
              </div>
              {/* Central photo tile */}
              <div style={{ width: `${TILE_VW}vw`, height: `${TILE_VW}vw`, overflow: 'hidden', pointerEvents: 'auto', flexShrink: 0, marginTop: 100 }}>
                <img
                  src="https://images.unsplash.com/photo-1580894895938-bd31a62ed8ba?auto=format&fit=crop&w=800&q=85"
                  alt="CYF student"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  draggable={false}
                />
              </div>
            </div>
          </div>

        </section>

        {/* ================================================================
            Section 3 — 4-column grid: spacer | sticky tile | scrolling stats | spacer
            ================================================================ */}
        <section className="bg-white">
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
                    <p
                      className="font-raleway font-medium mb-s"
                      style={{ fontSize: 'clamp(56px, 6vw, 96px)', lineHeight: 1, color: RED }}
                    >
                      <CountUp to={stat.numericValue} decimals={stat.decimals} suffix={stat.suffix} />
                    </p>
                    <h3 className="font-raleway font-medium text-cyf-black text-h5 tracking-tight leading-snug mb-xs">
                      {stat.label}
                    </h3>
                    <p className="font-raleway text-cyf-ink text-base leading-relaxed">
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
