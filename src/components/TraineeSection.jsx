import { motion } from 'framer-motion'
import { FadeIn, TextReveal, EyebrowMark } from './FadeIn'
import { BrandIcon } from './BrandAssets'
import ShardLink from './ShardLink'

const RED = '#F94500'

const journey = [
  {
    name: 'Intro to Digital',
    detail: 'Self-paced · 20–40 hours',
    body: 'Learn the foundations of digital tools, how the web works, and whether a tech career is right for you.',
    href: '/train/eligibility',
  },
  {
    name: 'Intro to Coding',
    detail: '12 weeks part-time',
    body: 'Build your first real programs. Learn HTML, CSS, and JavaScript fundamentals alongside working mentors.',
    href: '/train/courses',
  },
  {
    name: 'The Piscine',
    detail: '3 weeks intensive',
    body: 'An intensive assessment period. The most motivated and able trainees progress to the full course.',
    href: '/train/courses',
  },
  {
    name: 'Full-Stack Course',
    detail: '12 months part-time',
    body: 'Full-stack development with real tools and real teams. Graduate work-ready for professional roles.',
    href: '/train/courses',
  },
]

const ctaLinks = [
  { label: 'Eligibility and how to apply', href: '/train/eligibility' },
  { label: 'Courses and curriculum',       href: '/train/courses' },
]

export default function TraineeSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-viewport mx-auto px-margins py-slice">

        <div className="border-t border-white/10 mb-2xl" />

        <div className="text-center mb-2xl">
          <FadeIn>
            <div className="flex items-center justify-center gap-xs mb-l">
              <EyebrowMark fill={RED} />
              <p className="font-raleway font-medium uppercase tracking-widest text-xs" style={{ color: 'inherit' }}>
                For trainees
              </p>
            </div>
            <TextReveal
              className="font-bebas mb-l"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 10rem)', lineHeight: 1.0, color: 'inherit' }}
            >
              Start your tech career
            </TextReveal>
            <p className="font-raleway text-base leading-relaxed max-w-xl mx-auto mb-l" style={{ color: 'inherit', opacity: 0.7 }}>
              Whether you become a Software Developer, Data Analyst, Business Analyst, or IT Professional — you start here.
            </p>
            <nav className="flex items-center justify-center gap-s" aria-label="Trainee links">
              {ctaLinks.map(link => (
                <ShardLink key={link.href} href={link.href} filled={link.filled}
                  style={{ borderColor: 'currentColor', color: 'inherit' }}>
                  {link.label}
                </ShardLink>
              ))}
            </nav>
          </FadeIn>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-xl">
          {journey.map((step, i) => (
            <motion.div
              key={step.name}
              className="flex flex-col"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
            >
              <div className="mb-l">
                <BrandIcon index={i} inViewDelay={i * 0.1} fill={i % 2 === 0 ? RED : "#7b5cf6"} />
              </div>
              <h3 className="font-bebas mb-s" style={{ fontSize: 'clamp(2.5rem, 3.5vw, 5rem)', lineHeight: 1, color: 'inherit' }}>
                {step.name}
              </h3>
              <p className="font-raleway text-xs uppercase tracking-widest mb-s" style={{ color: 'inherit', opacity: 0.5 }}>
                {step.detail}
              </p>
              <p className="font-raleway text-s leading-relaxed mb-m" style={{ color: 'inherit', opacity: 0.7 }}>
                {step.body}
              </p>
              <a
                href={step.href}
                className="font-raleway font-medium text-xs underline underline-offset-4 transition-colors"
                style={{ color: 'inherit' }}
                onMouseEnter={e => e.target.style.color = 'var(--rollover-color)'}
                onMouseLeave={e => e.target.style.color = 'inherit'}
              >
                View more
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
