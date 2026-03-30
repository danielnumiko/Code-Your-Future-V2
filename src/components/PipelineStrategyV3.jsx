import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeIn, EyebrowMark, TextRevealSegments } from './FadeIn'
import ShardLink from './ShardLink'
const RED = '#f26522'


const steps = [
  {
    title: 'Work-ready from day one',
    body: 'Trained on real tools — GitHub, Agile, real codebases — not toy projects. Better prepared than bootcamp alternatives, at a fraction of the cost.',
    image: 'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'Student with laptop',
  },
  {
    title: 'Deeply diverse talent',
    body: 'CYF graduates come from backgrounds underrepresented in tech — bringing fresh perspectives, resilience, and a drive to prove themselves.',
    image: 'https://images.unsplash.com/photo-1713946598544-c3d106930f72?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'Student at desk',
  },
  {
    title: 'Faster growth. Better retention.',
    body: 'Our graduates consistently advance to intermediate within six months. Companies report stronger loyalty and faster time-to-value than typical junior hires.',
    image: 'https://images.unsplash.com/photo-1758270705317-3ef6142d306f?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'Students around a laptop',
  },
]

const ctaLinks = [
  { label: 'Partner with us',    href: '/partner',          filled: true },
  { label: 'Book a hiring chat', href: '/partner#hiring',   filled: false },
]

export default function PipelineStrategyV3() {
  const lineRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 65%', 'end 70%'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="bg-cyf-offwhite relative overflow-hidden">
      <div className="max-w-viewport mx-auto px-margins pt-slice pb-slice">

        <FadeIn className="text-center mb-2xl">
          <div className="flex items-center justify-center gap-xs mb-l">
            <EyebrowMark fill={RED} />
            <p className="font-raleway font-medium text-cyf-black uppercase tracking-widest text-xs">
              For partners
            </p>
          </div>
          <TextRevealSegments
            className="font-raleway font-medium text-cyf-black text-h3 tracking-tight leading-tight mb-l max-w-xl mx-auto"
            segments={[
              { text: '<', color: RED },
              { text: "The tech talent pipeline you've been missing", color: 'currentColor' },
              { text: '/>', color: RED },
            ]}
          />
          <p className="font-raleway text-cyf-ink text-base leading-relaxed max-w-xl mx-auto">
            Junior hiring isn't a risk — it's a strategy. CYF graduates are production-ready,
            deeply loyal, and advance to intermediate within six months.
          </p>
        </FadeIn>

        <div ref={lineRef} className="relative">

          {/* Animated line — red */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: 0,
              width: 4,
              marginLeft: -2,
              height: lineHeight,
              background: RED,
            }}
            aria-hidden="true"
          />

          {steps.map((step, i) => {
            const imageLeft = i % 2 === 0
            return (
              <motion.div
                key={step.title}
                className="grid grid-cols-[1fr_56px_1fr] gap-x-2xl items-center py-2xl"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
              >
                <div className="w-full">
                  {imageLeft ? (
                    <img src={step.image} alt={step.imageAlt} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div>
                      <p className="font-raleway font-medium text-h3 leading-none mb-s" style={{ color: RED }}>
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3 className="font-raleway font-medium text-cyf-black text-h5 leading-snug mb-s">{step.title}</h3>
                      <p className="font-raleway text-cyf-ink text-base leading-relaxed">{step.body}</p>
                    </div>
                  )}
                </div>

                {/* Centre dot — red */}
                <div className="flex justify-center">
                  <div className="w-4 h-4 shrink-0" style={{ background: RED }} aria-hidden="true" />
                </div>

                <div className="w-full">
                  {imageLeft ? (
                    <div>
                      <p className="font-raleway font-medium text-h3 leading-none mb-s" style={{ color: RED }}>
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3 className="font-raleway font-medium text-cyf-black text-h5 leading-snug mb-s">{step.title}</h3>
                      <p className="font-raleway text-cyf-ink text-base leading-relaxed">{step.body}</p>
                    </div>
                  ) : (
                    <img src={step.image} alt={step.imageAlt} className="w-full aspect-[4/3] object-cover" />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTAs */}
        <FadeIn className="flex flex-col sm:flex-row items-center justify-center gap-s pt-2xl">
          {ctaLinks.map(link => (
            <ShardLink key={link.href} href={link.href} filled={link.filled}>
              {link.label}
            </ShardLink>
          ))}
        </FadeIn>

      </div>
    </section>
  )
}
