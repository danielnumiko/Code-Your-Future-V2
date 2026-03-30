import { useState, useRef } from 'react'
import { FadeIn, TextReveal } from './FadeIn'

const RED = '#F94500'

const posts = [
  {
    category: 'Pipeline Strategy',
    title: 'The real cost of your senior-only hiring strategy',
    image: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'CYF full stack class',
    href: '#',
  },
  {
    category: 'Sourcing Framework',
    title: 'Where the best untapped tech talent actually is',
    image: 'https://images.unsplash.com/photo-1710770563074-6d9cc0d3e338?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'CYF outreach session',
    href: '#',
  },
  {
    category: 'Programme Quality',
    title: 'Why CYF grads outperform bootcamp graduates',
    image: 'https://images.unsplash.com/photo-1543270122-f7a11ad44f3a?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'CYF trainees on the course',
    href: '#',
  },
  {
    category: 'Graduate Stories',
    title: "From refugee to software engineer: Amara's story",
    image: 'https://images.unsplash.com/photo-1580894895938-bd31a62ed8ba?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'CYF graduate Junita',
    href: '#',
  },
]

export default function BlogPreviewV5() {
  const [offset, setOffset] = useState(0)
  const visible = 3
  const max = posts.length - visible

  const dragStartX  = useRef(null)
  const dragDelta   = useRef(0)
  const isDragging  = useRef(false)
  const trackRef    = useRef(null)

  const cardW = `calc((100vw - 2 * clamp(20px, calc(8px + 3.75vw), 80px)) / ${visible})`

  function cardPx() {
    return trackRef.current?.children[0]?.getBoundingClientRect().width ?? 0
  }

  function onPointerDown(e) {
    dragStartX.current = e.clientX
    dragDelta.current  = 0
    isDragging.current = false
    trackRef.current.setPointerCapture(e.pointerId)
    trackRef.current.style.transition = 'none'
  }

  function onPointerMove(e) {
    if (dragStartX.current === null) return
    const delta = e.clientX - dragStartX.current
    dragDelta.current = delta
    if (Math.abs(delta) > 4) isDragging.current = true
    const px = cardPx()
    if (px) {
      trackRef.current.style.transform =
        `translateX(calc(-${offset} * ${cardW} + ${delta}px))`
    }
  }

  function onPointerUp(e) {
    if (dragStartX.current === null) return
    const delta = dragDelta.current
    trackRef.current.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'

    let newOffset = offset
    if (delta < -50)      newOffset = Math.min(max, offset + 1)
    else if (delta > 50)  newOffset = Math.max(0, offset - 1)

    setOffset(newOffset)
    trackRef.current.style.transform = `translateX(calc(-${newOffset} * ${cardW}))`
    dragStartX.current = null
  }

  function goTo(n) {
    const clamped = Math.max(0, Math.min(max, n))
    trackRef.current.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    trackRef.current.style.transform  = `translateX(calc(-${clamped} * ${cardW}))`
    setOffset(clamped)
  }

  return (
    <section className="overflow-hidden relative">
      <div className="max-w-viewport mx-auto px-margins pt-slice pb-s">

        <FadeIn className="mb-l">
          <TextReveal className="font-bebas mb-l" style={{ fontSize: 'clamp(3.5rem, 7vw, 10rem)', lineHeight: 1.0, color: 'inherit' }} delay={0.05}>
            From our blog.
          </TextReveal>
          <div className="flex items-center justify-between">
            <p className="font-raleway text-base max-w-md leading-relaxed" style={{ color: 'inherit', opacity: 0.7 }}>
              News, insights, and stories from Code Your Future — and the people changing their lives through it.
            </p>
            <div className="flex items-center gap-s flex-shrink-0 ml-l">
              <button
                onClick={() => goTo(offset - 1)}
                disabled={offset === 0}
                aria-label="Previous"
                className="w-10 h-10 border border-cyf-black/20 flex items-center justify-center hover:border-cyf-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => goTo(offset + 1)}
                disabled={offset >= max}
                aria-label="Next"
                className="w-10 h-10 border border-cyf-black/20 flex items-center justify-center hover:border-cyf-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </FadeIn>

      </div>

      <div
        className="pb-slice"
        style={{ paddingLeft: 'clamp(20px, calc(8px + 3.75vw), 80px)', cursor: 'grab', userSelect: 'none' }}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{ transform: `translateX(calc(-${offset} * ${cardW}))`, transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)', willChange: 'transform' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {posts.map(post => (
            <a
              key={post.title}
              href={post.href}
              onClick={e => { if (isDragging.current) e.preventDefault() }}
              className="flex-shrink-0 pr-m group"
              style={{ width: cardW, textDecoration: 'none', color: 'inherit', transition: 'color 0.3s ease' }}
              draggable={false}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--rollover-color)'}
              onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
            >
              <div className="overflow-hidden mb-m" style={{ height: 'clamp(160px, 14vw, 240px)' }}>
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
              </div>
              <p className="font-raleway font-medium uppercase tracking-widest text-xs mb-s" style={{ color: 'inherit', opacity: 0.7 }}>
                <span style={{ color: RED }}>/ </span>{post.category}
              </p>
              <h3
                className="font-bebas"
                style={{ fontSize: 'clamp(2.5rem, 3.5vw, 5rem)', lineHeight: 1, color: 'inherit' }}
              >
                {post.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
