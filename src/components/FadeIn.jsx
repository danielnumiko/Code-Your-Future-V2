import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin)

export function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      }}
    >
      {children}
    </motion.div>
  )
}

// Small filled square used as eyebrow decorator before section labels.
export function EyebrowMark({ delay = 0, fill = '#EE4344' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      style={{ flexShrink: 0, lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}
      initial={{ opacity: 0, x: -4 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut', delay }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="8" height="8" fill={fill} />
      </svg>
    </motion.span>
  )
}

// ─── GlitchHeading ────────────────────────────────────────────────────────────
// Glitch-typing animation using GSAP ScrambleTextPlugin.
// segments = [{ text: string, color: string }, ...]
// Fires once when element scrolls into view.

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const WORD_DUR    = 0.08  // seconds per word — total scales with heading length
const MIN_WORD_DUR = 0.03
const MAX_WORD_DUR = 0.1

export function GlitchHeading({ segments, style, className, as: Tag = 'p', delay: startDelay = 0 }) {
  const ref = useRef(null)
  const spanRefs = useRef([])
  const started = useRef(false)

  // Split each segment on spaces → word-level tokens
  const tokens = segments.flatMap(seg =>
    seg.text.split(/(\s+)/).filter(Boolean).map(part => ({ text: part, color: seg.color }))
  )

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        observer.disconnect()

        // Lock height before scramble chars change line-wrapping
        container.style.height = container.offsetHeight + 'px'
        container.style.overflow = 'hidden'

        const wordDur = Math.min(MAX_WORD_DUR, Math.max(MIN_WORD_DUR, WORD_DUR))
        const revealDelay = wordDur * 0.25

        let cumulativeDelay = startDelay

        spanRefs.current.forEach(el => {
          if (!el) return
          const text = el.dataset.text ?? ''

          if (!text.trim()) {
            // Space tokens: invisible characters, just reveal immediately
            el.style.opacity = '1'
            return
          }

          const delay = cumulativeDelay
          cumulativeDelay += wordDur

          gsap.to(el, {
            duration: wordDur,
            delay,
            ease: 'none',
            scrambleText: {
              text,
              chars: SCRAMBLE_CHARS,
              speed: 0.6,
              revealDelay,
            },
            // Make each word visible only when its turn starts
            onStart: () => { el.style.opacity = '1' },
          })
        })

        // Unlock height once all words have finished
        gsap.delayedCall(cumulativeDelay, () => {
          container.style.height = ''
          container.style.overflow = ''
        })
      },
      { rootMargin: '-60px 0px' }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref} style={style} className={className}>
      {tokens.map((token, i) => (
        <span
          key={i}
          ref={el => { spanRefs.current[i] = el }}
          style={{ color: token.color, opacity: 0 }}
          data-text={token.text}
        >
          {token.text}
        </span>
      ))}
    </Tag>
  )
}

// Numiko-style word-by-word staggered reveal for H1 / H2.
// Each word fades + slides up independently with a short stagger.
export function TextReveal({ children, as: Tag = 'h2', className = '', delay = 0, onMount = false }) {
  const words = String(children).split(' ')
  const vp = { once: true, margin: '-40px' }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 20, opacity: 0 }}
          {...(onMount
            ? { animate: { y: 0, opacity: 1 } }
            : { whileInView: { y: 0, opacity: 1 }, viewport: vp }
          )}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.05 }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}

// Same word-by-word reveal but accepts coloured segments (like GlitchHeading).
// segments = [{ text: string, color: string }, ...]
// Use color: 'currentColor' to inherit the parent's CSS colour.
export function TextRevealSegments({ segments, as: Tag = 'h2', className = '', style, delay = 0, onMount = false }) {
  const tokens = segments.flatMap(seg =>
    seg.text.split(/(\s+)/).filter(Boolean).map(part => ({ text: part, color: seg.color }))
  )
  const vp = { once: true, margin: '-40px' }
  let wordIdx = 0

  return (
    <Tag className={className} style={style}>
      {tokens.map((token, i) => {
        const isSpace = !token.text.trim()
        if (isSpace) {
          return <span key={i} aria-hidden="true">{token.text}</span>
        }
        const idx = wordIdx++
        return (
          <motion.span
            key={i}
            className="inline-block"
            style={{ color: token.color }}
            initial={{ y: 20, opacity: 0 }}
            {...(onMount
              ? { animate: { y: 0, opacity: 1 } }
              : { whileInView: { y: 0, opacity: 1 }, viewport: vp }
            )}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: delay + idx * 0.05 }}
          >
            {token.text}
          </motion.span>
        )
      })}
    </Tag>
  )
}
