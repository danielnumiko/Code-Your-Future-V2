import { motion } from 'framer-motion'
import { FadeIn, TextRevealSegments } from './FadeIn'
import { RED } from './BrandAssetsV4'

export default function NewsletterV4() {
  return (
    <section className="bg-white relative overflow-hidden">
      <div className="max-w-viewport mx-auto px-margins py-slice text-center">

        {/* Animated accent line */}
        <div className="flex justify-center mb-l">
          <motion.div
            style={{
              width: 4,
              height: 'clamp(48px, 6vw, 96px)',
              background: RED,
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
          <TextRevealSegments
            className="font-raleway font-medium text-cyf-black text-h2 tracking-tight mb-l max-w-3xl mx-auto"
            segments={[
              { text: '<', color: RED },
              { text: 'Ready to build a team that stays?', color: 'currentColor' },
              { text: '/>', color: RED },
            ]}
          />
          <p className="font-raleway text-cyf-ink text-base mb-m max-w-xl mx-auto leading-relaxed">
            Partner with CYF to access trained, work-ready tech talent — or start your own journey into tech today.
          </p>

          <div className="flex flex-col sm:flex-row gap-s justify-center">
            <a
              href="/partner"
              className="font-raleway font-semibold text-xs whitespace-nowrap transition-colors"
              style={{ background: RED, color: '#fff', padding: '14px 24px', borderRadius: 0, display: 'inline-block' }}
            >
              Partner with us
            </a>
            <a
              href="/train"
              className="font-raleway font-semibold text-xs whitespace-nowrap transition-colors"
              style={{ background: 'transparent', border: `2px solid ${RED}`, color: RED, padding: '12px 22px', borderRadius: 0, display: 'inline-block' }}
            >
              Apply to train
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
