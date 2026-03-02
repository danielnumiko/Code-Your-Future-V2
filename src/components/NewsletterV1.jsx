import { motion } from 'framer-motion'
import { FadeIn, GlitchHeading } from './FadeIn'
import { GREEN } from './BrandAssetsV4'
const RED = GREEN

export default function NewsletterV1() {
  return (
    <section className="bg-black relative overflow-hidden">
      <div className="max-w-viewport mx-auto px-margins py-slice text-center">

        {/* Animated green line */}
        <div className="flex justify-center mb-l">
          <motion.div
            style={{
              width: 4,
              height: 'clamp(48px, 6vw, 96px)',
              background: GREEN,
              transformOrigin: 'top',
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            aria-hidden="true"
          />
        </div>

        <FadeIn>
          <GlitchHeading
            as="h2"
            className="font-raleway font-medium text-h2 tracking-tight mb-l max-w-3xl mx-auto"
            segments={[
              { text: '>', color: GREEN },
              { text: ' ', color: 'white' },
              { text: '[', color: GREEN },
              { text: 'Ready to build a team that stays?', color: 'white' },
              { text: ']', color: GREEN },
            ]}
          />
          <p className="font-raleway text-white/60 text-base mb-m max-w-xl mx-auto leading-relaxed">
            Partner with CYF to access trained, work-ready tech talent — or start your own journey into tech today.
          </p>

          <div className="flex flex-col sm:flex-row gap-s justify-center">
            <a
              href="/partner"
              className="font-raleway font-semibold whitespace-nowrap transition-colors"
              style={{ background: GREEN, color: 'black', padding: '14px 24px', borderRadius: 0, display: 'inline-block', fontSize: 18 }}
            >
              Partner with us
            </a>
            <a
              href="/train"
              className="font-raleway font-semibold whitespace-nowrap transition-colors"
              style={{ background: 'transparent', border: '2px solid white', color: 'white', padding: '12px 22px', borderRadius: 0, display: 'inline-block', fontSize: 18 }}
            >
              Apply to train
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
