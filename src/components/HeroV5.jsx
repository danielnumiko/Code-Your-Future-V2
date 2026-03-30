import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { TextRevealSegments } from './FadeIn'
import ShardLink from './ShardLink'
import { DiamondMark } from './BrandAssetsV4'

// ─── Palette ──────────────────────────────────────────────────────────────────

const RED      = '#F94500'
const PURPLE   = '#130022'
const LAVENDER = '#BCACCE'
const YELLOW   = '#FFFDB4'

const TILE_VW = 8

// ─── SVG brand-pattern paths ──────────────────────────────────────────────────

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

// ─── Tile columns — left/right symmetric ──────────────────────────────────────
// Each outer column mirrors the other (flip=true on right).
// Each inner column mirrors the other (flip=true on left).
// No empty tiles.

const LEFT_TILE_SRC   = 'https://images.unsplash.com/photo-1573164713712-03790a178651?auto=format&fit=crop&w=800&q=85'
const RIGHT_TILE_SRC  = 'https://images.unsplash.com/photo-1758270705317-3ef6142d306f?auto=format&fit=crop&w=800&q=85'
const CENTRE_TILE_SRC = 'https://images.unsplash.com/photo-1671726203454-5d7a5370a9f4?auto=format&fit=crop&w=800&q=85'

const COL_OUTER_L = [
  { video: '/9198246-hd_1920_1080_25fps.mp4',   w: 7, h: 7, gapAfter: 28 },
  { video: '/12893579-uhd_2160_3840_24fps.mp4',  w: 5.5, h: 5.5, gapAfter: 16 },
  { video: '/8632601-uhd_3840_2160_25fps.mp4',   w: 6, h: 6 },
]
const COL_INNER_L = [
  { video: '/2516160-hd_1920_1080_24fps.mp4',    w: 5, h: 5, gapAfter: 24 },
  { video: '/9198206-hd_1920_1080_25fps.mp4',    w: 7, h: 7 },
]
const COL_INNER_R = [
  { video: '/13456545_3840_2160_30fps.mp4',       w: 6, h: 6, gapAfter: 20 },
  { video: '/6804109-uhd_4096_2160_25fps.mp4',    w: 5.5, h: 5.5 },
]
const COL_OUTER_R = [
  { video: '/7989833-hd_1920_1080_25fps.mp4',    w: 5, h: 5, gapAfter: 18 },
  { video: '/12981875_2160_4096_60fps.mp4',       w: 5.5, h: 5.5, gapAfter: 22 },
  { video: '/13456491_3840_2160_30fps.mp4',       w: 7, h: 7 },
]


// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v, lo = 0, hi = 1) { return Math.min(hi, Math.max(lo, v)) }
function easeSnappy(t) { return 1 - Math.pow(1 - clamp(t), 4) }

// ─── BrandPatternTile ─────────────────────────────────────────────────────────

function BrandPatternTile({ variant, flip = false, fill = RED }) {
  const paths   = variant === 'zigzag' ? ZIGZAG_PATHS : UNION_PATHS
  const viewBox = variant === 'zigzag' ? '0 0 174 182.7' : '0 0 174 174'
  return (
    <svg viewBox={viewBox} width="100%" height="100%" overflow="visible"
      style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }} aria-hidden="true">
      {paths.map((d, i) => {
        const row = Math.floor(i / 4), col = i % 4
        return (
          <motion.path key={i} d={d} fill={fill}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: (row + col) * 0.07 }}
          />
        )
      })}
    </svg>
  )
}

// ─── Tile ─────────────────────────────────────────────────────────────────────

function Tile({ item }) {
  const w = item.w ?? TILE_VW
  const h = item.h ?? TILE_VW
  const sz = { width: `${w}vw`, height: `${h}vw`, flexShrink: 0, marginBottom: item.gapAfter ? `${item.gapAfter}vw` : 0 }
  if (item.brandPattern) return (
    <div style={{ ...sz, position: 'relative' }}>
      <BrandPatternTile variant={item.brandPattern} flip={item.flip} fill={item.fill} />
    </div>
  )
  return (
    <motion.div style={{ ...sz, overflow: 'hidden', position: 'relative' }}
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}>
      {item.video ? (
        <video src={item.video} autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <img src={item.src} alt={item.alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} draggable={false} />
      )}
    </motion.div>
  )
}

// ─── Nav button style ─────────────────────────────────────────────────────────

const navBtn = {
  fontFamily: 'Raleway, sans-serif', fontWeight: 600, fontSize: 16,
  color: LAVENDER, background: 'none', border: 'none',
  cursor: 'pointer', padding: 0, lineHeight: 1,
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HeroV5({ onSwitchConcept }) {
  const videoRef      = useRef(null)
  const [scaled, setScaled] = useState(false)
  const mosaicRef     = useRef(null)
  const { scrollYProgress: mosaic } = useScroll({
    target: mosaicRef,
    offset: ['start end', 'end start'],
  })
  const outerY = useTransform(mosaic, [0, 1], [600, -200])

function stickyProgress() {
    const VH = window.innerHeight
    const vw = window.innerWidth
    return (1.9 * VH - (TILE_VW / 100) * vw) / (2.5 * VH)
  }

  const tileScale = useTransform(mosaic, v => {
    const s = stickyProgress()
    const t = easeSnappy(clamp((v - s) / (1 - s)))
    const vw = window.innerWidth
    const margin = Math.min(80, Math.max(20, 8 + 0.0375 * vw))
    const gap    = Math.min(72, Math.max(40, 33.6 + 0.02 * vw))
    const colW   = (vw - 2 * margin - 2 * gap) / 3
    const startScale = (TILE_VW / 100 * vw) / colW
    const endScale   = (2 * colW + gap) / colW
    return startScale + t * (endScale - startScale)
  })

  const tileX = useTransform(mosaic, v => {
    const s = stickyProgress()
    const t = easeSnappy(clamp((v - s) / (1 - s)))
    const vw = window.innerWidth
    const margin = Math.min(80, Math.max(20, 8 + 0.0375 * vw))
    const gap    = Math.min(72, Math.max(40, 33.6 + 0.02 * vw))
    const colW   = (vw - 2 * margin - 2 * gap) / 3
    const startOffset  = vw / 2 - (margin + colW + gap) - (TILE_VW / 100 * vw) / 2
    const centreOffset = -(colW + gap) / 2
    return (1 - t) * startOffset + t * centreOffset
  })

  const tileY = useTransform(mosaic, v => {
    const s = stickyProgress()
    const t = easeSnappy(clamp((v - s) / (1 - s)))
    const vh = window.innerHeight
    const vw = window.innerWidth
    const margin = Math.min(80, Math.max(20, 8 + 0.0375 * vw))
    const gap    = Math.min(72, Math.max(40, 33.6 + 0.02 * vw))
    const colW   = (vw - 2 * margin - 2 * gap) / 3
    return -(1 - t) * (vh - colW) / 2
  })

  const tileAspect = useTransform(mosaic, v => {
    const s = stickyProgress()
    const t = easeSnappy(clamp((v - s) / (1 - s)))
    return 1 + t * (16 / 9 - 1)
  })

  useMotionValueEvent(mosaic, 'change', v => {
    const s = stickyProgress()
    setScaled(v >= s)
  })

  return (
    <div style={{ position: 'relative' }}>

      {/* ================================================================
          Section 1 — mosaic tile grid (150 vh)
          ================================================================ */}
      <section
        ref={mosaicRef}
        style={{ height: '150vh', position: 'relative', overflow: 'clip', overflowClipMargin: '600px', zIndex: 1 }}
      >

        {/* Logo — scrolls with page */}
        <a href="/" aria-label="Code Your Future home"
          style={{ position: 'absolute', left: 50, top: 60, zIndex: 100, textDecoration: 'none' }}>
          <img src="/Logo.svg" alt="Code Your Future" style={{ height: 80, width: 'auto' }} />
        </a>

        {/* Concept switcher — scrolls with page */}
        <div className="cursor-pointer" style={{
          position: 'absolute', right: 50, top: 72, zIndex: 100,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          {[
            { label: 'Concept 1', v: 'v1' },
            { label: 'Concept 2', v: 'v2' },
            { label: 'Concept 3', v: 'v3' },
            { label: 'Concept 4', v: 'v4', active: true },
          ].reduce((acc, link, i, arr) => {
            acc.push(
              <button
                key={link.v}
                style={{ ...navBtn, color: '#ffffff', fontWeight: link.active ? 700 : 600, borderBottom: link.active ? '2px solid #7b5cf6' : '2px solid transparent', paddingBottom: 10 }}
                onMouseEnter={e => e.currentTarget.style.borderBottomColor = '#7b5cf6'}
                onMouseLeave={e => e.currentTarget.style.borderBottomColor = link.active ? '#7b5cf6' : 'transparent'}
                onClick={() => onSwitchConcept?.(link.v)}
              >
                {link.label}
              </button>
            )
            if (i < arr.length - 1) acc.push(
              <span key={`sep-${i}`} style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 900, fontSize: 16, color: RED, paddingBottom: 10, display: 'inline-block' }}>/</span>
            )
            return acc
          }, [])}
        </div>

        {/* Outer left — parallax */}
        <motion.div className="absolute flex flex-col"
          style={{ left: '1.5vw', top: 'calc(23vh - 100px)', height: '140vh', y: outerY, willChange: 'transform' }}>
          {COL_OUTER_L.map((item, i) => <Tile key={i} item={item} />)}
        </motion.div>

        {/* Inner left — static */}
        <div className="absolute flex flex-col"
          style={{ left: '16.667%', top: 'calc(88vh - 100px)', height: '80vh' }}>
          {COL_INNER_L.map((item, i) => <Tile key={i} item={item} />)}
        </div>

        {/* Inner right — static */}
        <div className="absolute flex flex-col"
          style={{ right: '16.667%', top: 'calc(88vh - 100px)', height: '80vh' }}>
          {COL_INNER_R.map((item, i) => <Tile key={i} item={item} />)}
        </div>

        {/* Outer right — parallax */}
        <motion.div className="absolute flex flex-col"
          style={{ right: '1.5vw', top: 'calc(23vh - 100px)', height: '140vh', y: outerY, willChange: 'transform' }}>
          {COL_OUTER_R.map((item, i) => <Tile key={i} item={item} />)}
        </motion.div>

        {/* Centre text — no box, text floats over grid */}
        <div className="absolute inset-x-0 flex flex-col items-center pointer-events-none"
          style={{ top: 'calc(38vh + 50px)', transform: 'translateY(-50%)', zIndex: 10 }}>
          <div style={{
            maxWidth: '55vw', width: 900,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
            textAlign: 'center',
          }}>
            {/* Single centred tile above h1 */}
            <div style={{ width: '5.5vw', height: '5.5vw', overflow: 'hidden', flexShrink: 0, position: 'relative', top: '0px', marginBottom: '100px' }}>
              <video src="/7969380-uhd_2160_3840_30fps.mp4" autoPlay muted loop playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <TextRevealSegments
              as="h1"
              style={{
                fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400,
                fontSize: 'clamp(3.5rem, 7vw, 10rem)',
                color: '#ffffff', lineHeight: 1, margin: 0,
                textShadow: '0 2px 24px rgba(0,0,0,0.6)',
              }}
              segments={[
                { text: '<',  color: RED, absolute: 'left' },
                { text: 'Future-proof your engineering team.', color: '#ffffff' },
                { text: '/>', color: RED, absolute: 'right' },
              ]}
            />
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontWeight: 400,
              fontSize: 'clamp(14px, 1.4vw, 20px)',
              color: 'inherit', opacity: 0.7, lineHeight: 1.7, margin: 0,
              textShadow: '0 2px 16px rgba(0,0,0,0.7)',
              maxWidth: '36rem',
            }}>
              Cultivate a continuous pipeline of talent so your roadmap stays on track, no matter who moves on.
              5.5× lower attrition than industry average.
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', pointerEvents: 'auto' }}>
              <ShardLink href="/partner" style={{ background: 'white', color: PURPLE, borderColor: 'white' }}>Partner &amp; Hire</ShardLink>
              <ShardLink href="/train" style={{ color: 'white', borderColor: 'white' }}>Train With CYF</ShardLink>
            </div>
          </div>
        </div>


      </section>

      {/* ================================================================
          Section 2 — centred growing tile
          ================================================================ */}
      <section
        style={{ paddingBottom: '200px' }}
        onMouseEnter={() => {
          if (!videoRef.current) return
          videoRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*')
        }}
        onMouseLeave={() => {
          if (!videoRef.current) return
          videoRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*')
        }}
      >
        <div className="max-w-viewport mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 'clamp(40px, calc(33.6px + 2vw), 72px)',
            padding: '0 clamp(20px, calc(8px + 3.75vw), 80px)',
            alignItems: 'start',
          }}>

          <div />

          {/* Col 2 — growing tile */}
          <div style={{
            alignSelf: 'start', position: 'sticky', top: 0,
            height: '100vh', display: 'flex', alignItems: 'center',
            marginTop: `calc(-10vh - ${TILE_VW}vw)`, zIndex: 2,
          }}>
            <motion.div className="relative overflow-hidden w-full"
              style={{ aspectRatio: tileAspect, scale: tileScale, x: tileX, y: tileY, transformOrigin: 'top left' }}
            >
              <AnimatePresence mode="sync">
                {!scaled ? (
                  <motion.video
                    key="holding"
                    src="/hero-video.mp4"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    autoPlay muted loop playsInline
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <motion.iframe
                    key="youtube"
                    ref={videoRef}
                    src="https://www.youtube.com/embed/jz87O1kap7s?autoplay=0&mute=0&loop=1&playlist=jz87O1kap7s&controls=1&playsinline=1&enablejsapi=1&rel=0&modestbranding=1"
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    onLoad={() => {
                      setTimeout(() => {
                        videoRef.current?.contentWindow.postMessage(
                          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
                        )
                      }, 300)
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </section>

    </div>
  )
}
