/**
 * ShardLink — single shard that slides in/out from the cursor entry direction.
 */
import { useRef } from 'react'

const PURPLE = 'var(--rollover-color, #7b5cf6)'

const offscreen = {
  top:    'translateY(-110%)',
  right:  'translateX(110%)',
  bottom: 'translateY(110%)',
  left:   'translateX(-110%)',
}

function getDir(e, el) {
  const r = el.getBoundingClientRect()
  const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
  const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left'
  return dy > 0 ? 'bottom' : 'top'
}

export default function ShardLink({ href, filled = false, children, className = '', style = {} }) {
  const btnRef  = useRef(null)
  const shardRef = useRef(null)
  const labelRef = useRef(null)

  const restingBorder = style.borderColor ?? ''
  const restingColor  = style.color ?? ''

  function enter(e) {
    const dir = getDir(e, btnRef.current)
    const shard = shardRef.current
    // Snap to entry edge with no transition, then animate to cover
    shard.style.transition = 'none'
    shard.style.transform  = offscreen[dir]
    shard.getBoundingClientRect() // force reflow
    shard.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    shard.style.transform  = 'translate(0, 0)'
    btnRef.current.style.borderColor = PURPLE
    labelRef.current.style.color = 'var(--page-inv, #0c0c0c)'
  }

  function leave(e) {
    const dir = getDir(e, btnRef.current)
    const shard = shardRef.current
    shard.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    shard.style.transform  = offscreen[dir]
    btnRef.current.style.borderColor = restingBorder
    labelRef.current.style.color = restingColor
  }

  return (
    <a
      ref={btnRef}
      href={href}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className={`font-raleway font-semibold text-xs whitespace-nowrap border-2 border-[#1a1a1a] hover:border-[#7b5cf6] transition-colors duration-300 ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        textDecoration: 'none',
        cursor: 'pointer',
        padding: '14px 24px',
        background: filled ? '#1a1a1a' : 'transparent',
        color: filled ? '#fff' : '#1a1a1a',
        ...style,
      }}
    >
      <span
        ref={shardRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: PURPLE,
          transform: 'translateY(-110%)',
          pointerEvents: 'none',
        }}
      />
      <span ref={labelRef} style={{ position: 'relative', zIndex: 10, transition: 'color 0.2s' }}>
        {children}
      </span>
    </a>
  )
}
