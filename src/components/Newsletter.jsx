import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeIn, TextRevealSegments } from './FadeIn'
import ShardLink from './ShardLink'
const RED = '#F94500'


export default function Newsletter() {
  const lineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start end', 'start 0.4'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-viewport mx-auto px-margins py-slice text-center">

        {/* Animated accent line */}
        <div ref={lineRef} className="flex justify-center mb-l">
          <motion.div
            style={{
              width: 4,
              height: 'clamp(48px, 6vw, 96px)',
              background: RED,
              transformOrigin: 'top',
              scaleY,
            }}
            aria-hidden="true"
          />
        </div>

        <FadeIn>
          <TextRevealSegments
            className="font-bebas mb-l max-w-3xl mx-auto text-center"
            style={{ fontSize: 'clamp(3.5rem, 7vw, 10rem)', lineHeight: 1.0, color: 'inherit' }}
            segments={[
              { text: '<',  color: RED, absolute: 'left' },
              { text: 'Ready to', color: 'currentColor' },
              { break: true },
              { text: 'build a team that stays?', color: 'currentColor' },
              { text: '/>', color: RED, absolute: 'right' },
            ]}
          />
          <p className="font-raleway text-base mb-m max-w-xl mx-auto leading-relaxed" style={{ color: 'inherit', opacity: 0.7 }}>
            Partner with CYF to access trained, work-ready tech talent — or start your own journey into tech today.
          </p>

          <div className="flex flex-col sm:flex-row gap-s justify-center">
            <ShardLink href="/partner" filled>Partner with us</ShardLink>
            <ShardLink href="/train">Apply to train</ShardLink>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
