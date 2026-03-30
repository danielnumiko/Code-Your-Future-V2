import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EyebrowMark } from './FadeIn'

const testimonials = [
  {
    quote: "I never thought tech was for someone like me. CYF didn't just teach me to code — they showed me I could build a career I'm proud of.",
    name: 'Amara Diallo',
    role: 'Software Developer, Capgemini',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'Student studying on laptop',
  },
  {
    quote: "Before CYF, I was working in a warehouse. Now I'm shipping code to millions of users every week. The programme changed the trajectory of my life.",
    name: 'Marcus Thompson',
    role: 'Frontend Engineer, BBC',
    image: 'https://images.unsplash.com/photo-1580894896813-652ff5aa8146?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'Woman coding at desk',
  },
  {
    quote: "They didn't just teach me JavaScript. They taught me how to think like an engineer, collaborate like a professional, and believe I belonged in the room.",
    name: 'Fatima Al-Hassan',
    role: 'Full Stack Developer, Financial Times',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'Student using laptop',
  },
]

export default function TestimonialCarouselV3() {
  const [activeIndex, setActiveIndex] = useState(0)
  const t = testimonials[activeIndex]

  const prev = () => setActiveIndex(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setActiveIndex(i => (i + 1) % testimonials.length)

  return (
    <section style={{ background: "#7b5cf6" }}>
      <div className="max-w-viewport mx-auto px-margins py-slice grid lg:grid-cols-2 gap-2xl items-center">

        {/* Left: quote + controls */}
        <div className="flex flex-col justify-center">

          <div className="flex items-center gap-xs mb-xl">
            <EyebrowMark fill="white" />
            <p className="font-raleway font-medium text-white uppercase tracking-widest text-xs">
              From our graduates
            </p>
          </div>

          {/* Quote — exits as a block, text reveals word-by-word on entry */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
            >
              <blockquote>
                <motion.p
                  className="font-raleway font-medium text-white text-h4 tracking-tight leading-tight mb-l"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                >
                  {`"${t.quote}"`}
                </motion.p>
                <motion.footer
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <p className="font-raleway font-medium text-white text-base">{t.name}</p>
                  <p className="font-raleway text-white/50 text-s mt-2xs">{t.role}</p>
                </motion.footer>
              </blockquote>
            </motion.div>
          </AnimatePresence>

          {/* Controls — prev/next + progress indicators */}
          <div className="flex items-center gap-s mt-xl">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="flex items-center gap-2 ml-s">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="flex items-center py-3 px-1"
                >
                  <motion.div
                    className="h-px rounded-full"
                    animate={{
                      width: i === activeIndex ? 40 : 16,
                      backgroundColor: i === activeIndex ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.25)',
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                </button>
              ))}
            </div>

            <p className="font-raleway text-white/30 text-xs ml-s">
              {activeIndex + 1} / {testimonials.length}
            </p>
          </div>
        </div>

        {/* Right: fixed image container — images crossfade, container never resizes */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={t.image}
              alt={t.imageAlt}
              className="absolute inset-0 w-full h-full object-cover object-top"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
