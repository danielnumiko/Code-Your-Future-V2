import { useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { FadeIn, EyebrowMark } from './FadeIn'

const partners = [
  { name: 'BBC',             logo: 'https://codeyourfuture.io/wp-content/uploads/2020/08/Logo-BBC.png' },
  { name: 'Capgemini',       logo: 'https://codeyourfuture.io/wp-content/uploads/2020/08/Logo-Capgemini-e1706736578566.png' },
  { name: 'Financial Times', logo: 'https://codeyourfuture.io/wp-content/uploads/2020/08/Logo-FT.png' },
  { name: 'Sky',             logo: 'https://codeyourfuture.io/wp-content/uploads/2025/10/Sky-spectrum-tile-scaled.webp' },
  { name: 'Deloitte',        logo: 'https://codeyourfuture.io/wp-content/uploads/2025/10/Deloitte-Logo.png' },
  { name: 'NatWest',         logo: 'https://codeyourfuture.io/wp-content/uploads/2025/10/NatWest-Logo-496x330-1.png' },
  { name: 'J.P. Morgan',     logo: 'https://codeyourfuture.io/wp-content/uploads/2025/10/JPM_logo_Thumbnail.png' },
  { name: "Sainsbury's",     logo: 'https://codeyourfuture.io/wp-content/uploads/2025/10/Sainsburys_Logo.svg' },
  { name: 'Fujitsu',         logo: 'https://codeyourfuture.io/wp-content/uploads/2025/10/Fujitsu.gif' },
  { name: 'AND Digital',     logo: 'https://codeyourfuture.io/wp-content/uploads/2020/08/Logo-ANDigital.png' },
  { name: 'HashiCorp',       logo: 'https://codeyourfuture.io/wp-content/uploads/2025/10/HashiCorp_PrimaryLogo_Black.png' },
  { name: 'Centrica',        logo: 'https://codeyourfuture.io/wp-content/uploads/2025/10/centrica-logo.svg' },
]

const CARD_W = 212   // 200px card + 12px gap
const TRACK_W = CARD_W * partners.length

function DragCarousel() {
  const x = useMotionValue(0)
  const isDragging = useRef(false)
  const pointerStartX = useRef(0)
  const motionStartX = useRef(0)

  // Auto-scroll — pauses while dragging
  useAnimationFrame(() => {
    if (isDragging.current) return
    let next = x.get() - 0.5
    if (next < -TRACK_W) next += TRACK_W
    x.set(next)
  })

  function onPointerDown(e) {
    isDragging.current = true
    pointerStartX.current = e.clientX
    motionStartX.current = x.get()
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!isDragging.current) return
    const dx = e.clientX - pointerStartX.current
    let next = motionStartX.current + dx
    // Keep within looping range
    if (next > 0) next -= TRACK_W
    if (next < -TRACK_W) next += TRACK_W
    x.set(next)
  }

  function onPointerUp() {
    isDragging.current = false
  }

  // Duplicate for seamless loop
  const track = [...partners, ...partners]

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <motion.div
        className="flex"
        style={{ x, gap: '12px', paddingLeft: '12px', width: 'max-content' }}
      >
        {track.map((partner, i) => (
          <div
            key={`${partner.name}-${i}`}
            className="flex-shrink-0 flex items-center justify-center border border-cyf-black/10 bg-white"
            style={{ width: '200px', height: '200px' }}
          >
            <img
              src={partner.logo}
              alt={partner.name}
              draggable={false}
              className="grayscale hover:grayscale-0 transition-all duration-300 pointer-events-none"
              style={{ width: '130px', height: '65px', objectFit: 'contain' }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function PartnerLogos() {
  return (
    <section>

      {/* Quote block */}
      <div className="max-w-viewport mx-auto px-margins pt-slice pb-2xl text-center">
        <FadeIn>
          <div className="flex items-center justify-center gap-xs mb-l">
            <EyebrowMark />
            <p className="font-raleway font-medium uppercase tracking-widest text-xs" style={{ color: 'inherit' }}>
              Our partners
            </p>
          </div>
          <blockquote className="max-w-3xl mx-auto">
            <p className="font-raleway font-medium text-h4 tracking-tight leading-tight mb-m" style={{ color: 'inherit' }}>
              "CYF graduates bring a work ethic and technical foundation that matches or exceeds
              what we'd expect from expensive senior hires. They're not a compromise — they're an upgrade."
            </p>
            <footer>
              <p className="font-raleway font-medium text-base" style={{ color: 'inherit' }}>Laura Carvajal</p>
              <p className="font-raleway text-s mt-2xs" style={{ color: 'inherit', opacity: 0.5 }}>Senior Principal Engineer</p>
            </footer>
          </blockquote>
        </FadeIn>
      </div>

      {/* Draggable auto-scroll logo carousel */}
      <div className="pb-slice">
        <DragCarousel />
      </div>

    </section>
  )
}
