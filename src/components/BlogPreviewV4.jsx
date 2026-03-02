import { useState } from 'react'
import { FadeIn, TextReveal } from './FadeIn'
import { RED, BrandDev } from './BrandAssetsV4'

const posts = [
  {
    category: 'Pipeline Strategy',
    title: 'The real cost of your senior-only hiring strategy',
    image: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'CYF full stack class',
  },
  {
    category: 'Sourcing Framework',
    title: 'Where the best untapped tech talent actually is',
    image: 'https://images.unsplash.com/photo-1710770563074-6d9cc0d3e338?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'CYF outreach session',
  },
  {
    category: 'Programme Quality',
    title: 'Why CYF grads outperform bootcamp graduates',
    image: 'https://images.unsplash.com/photo-1543270122-f7a11ad44f3a?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'CYF trainees on the course',
  },
  {
    category: 'Graduate Stories',
    title: "From refugee to software engineer: Amara's story",
    image: 'https://images.unsplash.com/photo-1580894895938-bd31a62ed8ba?auto=format&fit=crop&w=800&q=85',
    imageAlt: 'CYF graduate Junita',
  },
]

export default function BlogPreviewV4() {
  const [offset, setOffset] = useState(0)
  const visible = 3
  const max = posts.length - visible

  const cardW = `calc((100vw - 2 * clamp(20px, calc(8px + 3.75vw), 80px)) / ${visible})`

  return (
    <section className="bg-cyf-offwhite overflow-hidden relative">
<div className="max-w-viewport mx-auto px-margins pt-slice pb-s">

        <FadeIn className="mb-l">
          <TextReveal className="font-raleway font-medium text-cyf-black text-h2 tracking-tight mb-l" delay={0.05}>
            From our blog.
          </TextReveal>
          <div className="flex items-center justify-between">
            <p className="font-raleway text-cyf-ink text-base max-w-md leading-relaxed">
              News, insights, and stories from Code Your Future — and the people changing their lives through it.
            </p>
            <div className="flex items-center gap-s flex-shrink-0 ml-l">
              <button
                onClick={() => setOffset(o => Math.max(0, o - 1))}
                disabled={offset === 0}
                aria-label="Previous"
                className="w-10 h-10 border border-cyf-black/20 flex items-center justify-center hover:border-cyf-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => setOffset(o => Math.min(max, o + 1))}
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
        style={{ paddingLeft: 'clamp(20px, calc(8px + 3.75vw), 80px)' }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(calc(-${offset} * ${cardW}))` }}
        >
          {posts.map(post => (
            <div
              key={post.title}
              className="flex-shrink-0 pr-m cursor-pointer group"
              style={{ width: cardW }}
            >
              <div className="overflow-hidden mb-m" style={{ height: 'clamp(160px, 14vw, 240px)' }}>
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="font-raleway font-medium text-cyf-ink uppercase tracking-widest text-xs mb-s">
                <span style={{ color: RED }}>/ </span>{post.category}
              </p>
              <h3
                className="font-raleway font-medium text-cyf-black text-h5 leading-snug transition-colors"
                onMouseEnter={e => e.currentTarget.style.color = RED}
                onMouseLeave={e => e.currentTarget.style.color = ''}
              >
                {post.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
