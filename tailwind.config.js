/** @type {import('tailwindcss').Config} */

// Fluid scale: 320px (min) → 1920px (max), range 1600px
// slope = (max - min) / 1600, intercept = min - slope × 320

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {

      // ─── Colours ───────────────────────────────────────────────────────────
      colors: {
        cyf: {
          dark:     '#0f172a',
          black:    '#231F20',
          red:      '#EE4344',
          offwhite: '#F2EFF0',
          white:    '#ffffff',
          ink:      '#333333',
          body:     '#cbd5e1',
          border:   '#334155',
        },
      },

      // ─── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        raleway: ['"Raleway"', 'sans-serif'],
        lato:    ['"Lato"', 'sans-serif'],
        bebas:   ['"Bebas Neue"', 'sans-serif'],
      },

      // Fluid type scale — increased for bolder visual hierarchy
      fontSize: {
        // xs   14px → 16px
        'xs':      ['clamp(0.875rem, calc(0.85rem + 0.125vw), 1rem)',          { lineHeight: '1.5' }],
        // s    16px → 20px
        's':       ['clamp(1rem, calc(0.95rem + 0.25vw), 1.25rem)',            { lineHeight: '1.6' }],
        // base 18px → 24px
        'base':    ['clamp(1.125rem, calc(1.05rem + 0.375vw), 1.5rem)',        { lineHeight: '1.7' }],
        // h6   18px → 30px
        'h6':      ['clamp(1.125rem, calc(0.975rem + 0.75vw), 1.875rem)',      { lineHeight: '1.3' }],
        // h5   22px → 40px
        'h5':      ['clamp(1.375rem, calc(1.15rem + 1.125vw), 2.5rem)',        { lineHeight: '1.2' }],
        // h4   26px → 52px
        'h4':      ['clamp(1.625rem, calc(1.3rem + 1.625vw), 3.25rem)',        { lineHeight: '1.15' }],
        // h3   32px → 68px
        'h3':      ['clamp(2rem, calc(1.55rem + 2.25vw), 4.25rem)',            { lineHeight: '1.1' }],
        // h2   40px → 88px
        'h2':      ['clamp(3.5rem, calc(2rem + 6vw), 9rem)',                   { lineHeight: '1.05' }],
        // display 52px → 120px (hero)
        'display': ['clamp(3.25rem, calc(2.4rem + 4.25vw), 7.5rem)',           { lineHeight: '1.0' }],
      },

      // ─── Fluid Spacing ─────────────────────────────────────────────────────
      spacing: {
        // Tight scale (unchanged)
        '3xs':           'clamp(4px, calc(3.6px + 0.125vw), 6px)',
        '2xs':           'clamp(8px, calc(7.4px + 0.1875vw), 11px)',
        'xs':            'clamp(12px, calc(11px + 0.3125vw), 17px)',
        's':             'clamp(16px, calc(14.8px + 0.375vw), 22px)',
        'm':             'clamp(24px, calc(22.2px + 0.5625vw), 33px)',
        // Increased mid–large scale
        'l':             'clamp(40px, calc(35.2px + 1.5vw), 64px)',
        'xl':            'clamp(56px, calc(48px + 2.5vw), 96px)',
        '2xl':           'clamp(80px, calc(67.2px + 4vw), 144px)',
        '3xl':           'clamp(96px, calc(80px + 5vw), 176px)',
        // Layout tokens
        'margins':       'clamp(20px, calc(8px + 3.75vw), 80px)',
        'gutters':       'clamp(20px, calc(8px + 3.75vw), 80px)',
        // Section vertical padding — 80px min → 160px max (Clarify-scale)
        'slice':         'clamp(80px, calc(64px + 5vw), 160px)',
        'slice-heading': 'clamp(40px, calc(35.2px + 1.5vw), 64px)',
        // Component
        'btn-h':         'clamp(52px, calc(45.6px + 2vw), 84px)',
      },

      // ─── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        btn:  '0px',
        card: '0px',
      },

      // ─── Shadows ───────────────────────────────────────────────────────────
      boxShadow: {
        card: '0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.08)',
      },

      // ─── Layout ────────────────────────────────────────────────────────────
      maxWidth: {
        viewport: '1920px',
      },

    },
  },
  plugins: [],
}
