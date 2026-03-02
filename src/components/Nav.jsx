import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'


const navLinks = [
  { label: 'Concept 1', concept: 'v1' },
  { label: 'Concept 2', concept: 'v2' },
  { label: 'Concept 3', concept: 'v3' },
  { label: 'About',         concept: 'v4' },
]

export default function Nav({ onSwitchConcept, activeConcept }) {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const atTop = !scrolled && !open

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      {/* Outer wrapper: aligns with page content width, floats with top gap */}
      <div className="max-w-viewport mx-auto px-margins pt-4">

        {/* Glass / solid bar */}
        <div
          className="pointer-events-auto grid grid-cols-[1fr_auto_1fr] items-center px-m bg-white border border-black/10 py-2"
          style={{ paddingTop: '10px', paddingBottom: '10px' }}
        >

          {/* Logo — left */}
          <a href="/" aria-label="Code Your Future home" className="inline-flex items-center gap-2 shrink-0">
            <svg width="32" height="29" viewBox="0 0 424.264 384.527" aria-hidden="true">
              <path fill="#EE4344" d="M424.264 192.264L232 384.527V285.532L325.27 192.264L232 98.9941V0L424.264 192.264Z" />
              <path fill="#EE4344" d="M0 192.264L192 384.264V285.269L98.9941 192.264L192 99.2578V0.263672L0 192.264Z" />
            </svg>
            <span
              className="font-raleway font-bold tracking-tight text-cyf-black"
              style={{ fontSize: '1.25rem' }}
            >
              Code Your Future
            </span>
          </a>

          {/* Desktop nav — centre */}
          <nav className="hidden md:flex items-center gap-l" aria-label="Primary">
            {navLinks.map(link => {
              const baseClass = `font-raleway font-medium text-xs transition-colors duration-300`
              const colorClass = 'text-cyf-black/70 hover:text-cyf-black'
              return link.concept ? (
                <button
                  key={link.concept}
                  onClick={() => onSwitchConcept?.(link.concept)}
                  className={`${baseClass} ${colorClass} bg-transparent border-none cursor-pointer`}
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className={`${baseClass} ${colorClass}`}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* CTA + hamburger — right */}
          <div className="flex items-center justify-end gap-s">
            <a
              href="/donate"
              className="hidden md:inline-flex font-raleway font-medium text-xs text-white bg-cyf-red px-m py-2xs hover:bg-red-600 transition-colors whitespace-nowrap"
            >
              Donate
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <div className="w-5 flex flex-col gap-1">
                <span className={`block h-0.5 bg-cyf-black transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 bg-cyf-black transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-cyf-black transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>

        </div>

        {/* Mobile menu — drops below the glass bar */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto bg-white border-x border-b border-black/[0.08] overflow-hidden"
            >
              <nav className="px-l py-m flex flex-col gap-m" aria-label="Mobile">
                {navLinks.map(link => {
                  const colorClass = 'text-cyf-ink hover:text-cyf-red'
                  return link.concept ? (
                    <button
                      key={link.concept}
                      onClick={() => { onSwitchConcept?.(link.concept); setOpen(false) }}
                      className={`font-raleway font-medium transition-colors text-xs bg-transparent border-none cursor-pointer text-left ${colorClass}`}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`font-raleway font-medium transition-colors text-xs ${colorClass}`}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </a>
                  )
                })}
                <a href="/donate" className="font-raleway font-medium text-xs text-white bg-cyf-red px-l py-s hover:bg-red-600 transition-colors self-start">
                  Donate
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  )
}
