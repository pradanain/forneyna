import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown, ArrowUpRight, Heart } from 'lucide-react'
import { birthday } from '../config/birthday'
import { celebrate } from '../lib/celebrate'
import { FlowerSprig } from './Decorations'

export function GiftBox({ opened, onOpen, onUnwrap }: { opened: boolean; onOpen: () => void; onUnwrap: () => void }) {
  const [opening, setOpening] = useState(false)
  const reduced = useReducedMotion()
  const c = birthday.intro
  function unwrap() {
    // Keep audio.play() in the original click/keyboard activation, before animation.
    onUnwrap()
    setOpening(true)
  }
  return <section id="surprise" className="intro-section" aria-labelledby="intro-heading">
    <div className="intro-paper-edge" aria-hidden="true" />
    <FlowerSprig className="intro-flower left" /><FlowerSprig className="intro-flower right" />
    <motion.div className="intro-content" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
      <p className="eyebrow"><span />{c.eyebrow}<span /></p>
      <h1 id="intro-heading">{c.title}<br /><em>{c.titleAccent}</em></h1>
      <p className="intro-message">{c.message}</p>
      <div className="gift-stage">
        <span className="gift-annotation handwriting" aria-hidden="true">{c.annotation}<span>⤵</span></span>
        <button className="gift-button" disabled={opening || opened} onClick={unwrap} aria-label={c.open}>
          <svg viewBox="0 0 320 270" className="gift-illustration" aria-hidden="true">
            <defs>
              <linearGradient id="box" x2="0.7" y2="1"><stop stopColor="#efc4cf" /><stop offset="1" stopColor="#dca2b1" /></linearGradient>
              <linearGradient id="ribbon"><stop stopColor="#9b625e" /><stop offset="0.5" stopColor="#b27673" /><stop offset="1" stopColor="#935954" /></linearGradient>
              <pattern id="box-pattern" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="#fff8f2" opacity="0.5" /></pattern>
            </defs>
            <ellipse cx="161" cy="247" rx="107" ry="12" fill="#9b625e" opacity="0.09" />
            <rect x="65" y="115" width="190" height="122" rx="3" fill="url(#box)" />
            <rect x="65" y="115" width="190" height="122" rx="3" fill="url(#box-pattern)" />
            <path d="M148 118H174V237H148Z" fill="url(#ribbon)" />
            <motion.g animate={opening || opened ? { y: -78, rotate: -12, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }} transition={{ duration: reduced ? 0 : 1.05, ease: [0.45, 0, 0.2, 1], opacity: { delay: reduced ? 0 : 0.3, duration: reduced ? 0 : 0.65 } }} onAnimationComplete={() => { if (opening && !opened) { void celebrate(); onOpen() } }}>
              <rect x="56" y="99" width="208" height="33" rx="4" fill="#eac0cb" stroke="#d49eae" />
              <path d="M147 99H175V132H147Z" fill="url(#ribbon)" />
              <path d="M158 99C135 43 84 41 93 68C100 87 132 92 158 99Z" fill="#bb8281" stroke="#935954" strokeWidth="2" />
              <path d="M162 99C181 42 234 41 229 66C225 85 187 96 162 99Z" fill="#bb8281" stroke="#935954" strokeWidth="2" />
              <path d="M153 92C128 109 121 122 112 146L134 137L142 147L165 99M167 92C188 108 197 117 202 141L184 134L177 144L158 100" fill="#a86c69" />
              <ellipse cx="160" cy="94" rx="13" ry="11" fill="url(#ribbon)" />
            </motion.g>
            <path d="M182 126L203 156" stroke="#ba956d" fill="none" />
            <g transform="rotate(12 211 170)"><rect x="185" y="151" width="58" height="39" rx="3" fill="#fff8ed" /><circle cx="191" cy="157" r="2" fill="#cfa98e" /><text x="213" y="176" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="18" fill="#9b625e">{c.giftTag}</text></g>
          </svg>
        </button>
        <span className="gift-sparkle one" aria-hidden="true">✧</span><span className="gift-sparkle two" aria-hidden="true">✧</span>
      </div>
      {opened ? <a className="primary-button" href="#birthday">{c.continue}<ArrowDown size={16} /></a> : <button className="primary-button" onClick={unwrap} disabled={opening}>{opening ? c.opening : c.open}<ArrowUpRight size={17} /></button>}
      <p className="intro-footnote"><Heart size={12} />{c.footnote}</p>
      <span className="sr-only" role="status">{opened ? c.opened : ''}</span>
    </motion.div>
  </section>
}
