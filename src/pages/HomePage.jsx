import { useRef, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Hero from '../components/Hero'
import PipelineStrategy from '../components/PipelineStrategy'
import PartnerLogos from '../components/PartnerLogos'
import TestimonialCarousel from '../components/TestimonialCarousel'
import TraineeSection from '../components/TraineeSection'
import BlogPreview from '../components/BlogPreview'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'
import BackgroundPatternGrid from '../components/BackgroundPatternGrid'

const PURPLE   = '#130022'
const DARK_BLUE = '#130022'
const BEIGE    = '#F5F0E8'
const WHITE    = '#ffffff'
const FG_LIGHT = '#ffffff'
const FG_DARK  = '#1a1a1a'
const PAT_DARK  = '#7b5cf6'  // purple on dark backgrounds
const PAT_LIGHT = '#F94500'  // red on light backgrounds
const ROLL_DARK  = '#a78bfa'  // soft purple rollover on dark bg
const ROLL_LIGHT = '#4c1d95'  // dark purple rollover on light bg

// Hex colour lerp
function lerpColor(a, b, t) {
  const p = hex => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)]
  const [r1,g1,b1] = p(a), [r2,g2,b2] = p(b)
  const cl = t => Math.min(1, Math.max(0, t))
  return `rgb(${Math.round(r1+(r2-r1)*cl(t))},${Math.round(g1+(g2-g1)*cl(t))},${Math.round(b1+(b2-b1)*cl(t))})`
}

export default function HomePage() {
  const wrapperRef = useRef(null)
  const t1 = useRef(null) // pipeline:  PURPLE → BEIGE
  const t2 = useRef(null) // partners:  BEIGE  → PURPLE
  const t3 = useRef(null) // trainees:  PURPLE → BEIGE
  const t4 = useRef(null) // carousel:  BEIGE  → PURPLE
  const t5 = useRef(null) // blog:      PURPLE → BEIGE
  const t6 = useRef(null) // newsletter:BEIGE  → WHITE

  const offset = ['start end', 'start 0.75']
  const { scrollYProgress: s1 } = useScroll({ target: t1, offset })
  const { scrollYProgress: s2 } = useScroll({ target: t2, offset })
  const { scrollYProgress: s3 } = useScroll({ target: t3, offset })
  const { scrollYProgress: s4 } = useScroll({ target: t4, offset })
  const { scrollYProgress: s5 } = useScroll({ target: t5, offset })
  const { scrollYProgress: s6 } = useScroll({ target: t6, offset })

  const pageText = useTransform(
    [s1, s2, s3, s4, s5, s6],
    ([p1, p2, p3, p4, p5, p6]) => {
      let color = lerpColor(FG_LIGHT, FG_DARK,  p1)
      if (p2 > 0) color = lerpColor(FG_DARK,  FG_LIGHT, p2)
      if (p5 > 0) color = lerpColor(FG_LIGHT, FG_DARK,  p5)
      return color
    }
  )

  const pageTextInverse = useTransform(
    [s1, s2, s3, s4, s5, s6],
    ([p1, p2, p3, p4, p5, p6]) => {
      let color = lerpColor(FG_DARK,  FG_LIGHT, p1)
      if (p2 > 0) color = lerpColor(FG_LIGHT, FG_DARK,  p2)
      if (p5 > 0) color = lerpColor(FG_DARK,  FG_LIGHT, p5)
      return color
    }
  )

  const gridOpacity = useTransform(
    [s1, s6],
    ([p1, p6]) => {
      if (p6 > 0) return 1                        // newsletter → footer: visible
      if (p1 > 0) return Math.max(0, 1 - p1 * 6) // fade out quickly as pipeline enters
      return 1                                     // hero: visible
    }
  )

  const rolloverColor = useTransform(
    [s1, s2, s3, s4, s5, s6],
    ([p1, p2, p3, p4, p5, p6]) => {
      let color = lerpColor(ROLL_DARK,  ROLL_LIGHT, p1)
      if (p2 > 0) color = lerpColor(ROLL_LIGHT, ROLL_DARK,  p2)
      if (p5 > 0) color = lerpColor(ROLL_DARK,  ROLL_LIGHT, p5)
      return color
    }
  )

  const patternColor = useTransform(
    [s1, s2, s3, s4, s5, s6],
    ([p1, p2, p3, p4, p5, p6]) => {
      let color = lerpColor(PAT_DARK,  PAT_LIGHT, p1)  // purple→beige: blue→red
      if (p2 > 0) color = lerpColor(PAT_LIGHT, PAT_DARK,  p2)  // beige→dark: red→blue
      if (p5 > 0) color = lerpColor(PAT_DARK,  PAT_LIGHT, p5)  // dark→beige: blue→red
      return color
    }
  )

  useLayoutEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    el.style.setProperty('--page-fg', pageText.get())
    el.style.setProperty('--page-inv', pageTextInverse.get())
    el.style.setProperty('--pattern-color', patternColor.get())
    el.style.setProperty('--rollover-color', rolloverColor.get())
    el.style.setProperty('--grid-opacity', gridOpacity.get())
  }, [])

  useMotionValueEvent(pageText, 'change', v => {
    wrapperRef.current?.style.setProperty('--page-fg', v)
  })
  useMotionValueEvent(rolloverColor, 'change', v => {
    wrapperRef.current?.style.setProperty('--rollover-color', v)
  })
  useMotionValueEvent(gridOpacity, 'change', v => {
    wrapperRef.current?.style.setProperty('--grid-opacity', v)
  })
  useMotionValueEvent(pageTextInverse, 'change', v => {
    wrapperRef.current?.style.setProperty('--page-inv', v)
  })
  useMotionValueEvent(patternColor, 'change', v => {
    wrapperRef.current?.style.setProperty('--pattern-color', v)
  })

  const pageBg = useTransform(
    [s1, s2, s3, s4, s5, s6],
    ([p1, p2, p3, p4, p5, p6]) => {
      let color = lerpColor(PURPLE,    BEIGE,     p1)  // pipeline
      if (p2 > 0) color = lerpColor(BEIGE,    DARK_BLUE, p2)  // partners
      if (p5 > 0) color = lerpColor(DARK_BLUE, BEIGE,    p5)  // blog
      if (p6 > 0) color = lerpColor(BEIGE,    WHITE,     p6)  // newsletter
      return color
    }
  )

  return (
    <>
      <motion.div ref={wrapperRef} className="relative" style={{ zIndex: 2, backgroundColor: pageBg, color: pageText }}>
        <BackgroundPatternGrid />
        <main>
          <Hero />

          <div style={{ position: 'relative' }}>
            <div ref={t1} style={{ position: 'absolute', top: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true" />
            <PipelineStrategy />
          </div>

          <div style={{ position: 'relative' }}>
            <div ref={t2} style={{ position: 'absolute', top: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true" />
            <PartnerLogos />
          </div>

          <div style={{ position: 'relative' }}>
            <div ref={t3} style={{ position: 'absolute', top: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true" />
            <TraineeSection />
          </div>

          <div style={{ position: 'relative' }}>
            <div ref={t4} style={{ position: 'absolute', top: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true" />
            <TestimonialCarousel />
          </div>

          <div style={{ position: 'relative' }}>
            <div ref={t5} style={{ position: 'absolute', top: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true" />
            <BlogPreview />
          </div>

          <div style={{ position: 'relative' }}>
            <div ref={t6} style={{ position: 'absolute', top: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true" />
            <Newsletter />
          </div>
        </main>
      </motion.div>

      <div aria-hidden="true" style={{ height: '100vh' }} />
      <Footer />
    </>
  )
}
