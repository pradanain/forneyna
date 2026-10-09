import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { birthday } from '../config/birthday'

const colors = ['#dfa3b3', '#c5b4d7', '#e8c28d', '#b9c5ae', '#edbdc5']

function FloatingBalloons() {
  const reduced = useReducedMotion()
  const [finished, setFinished] = useState(false)
  useEffect(() => {
    if (reduced) return
    const timer = window.setTimeout(() => setFinished(true), 12000)
    return () => window.clearTimeout(timer)
  }, [reduced])
  if (reduced || finished) return null
  return createPortal(<div className="balloon-flight" aria-hidden="true">
    {Array.from({ length: 18 }, (_, i) => <div key={i} className="floating-balloon" style={{
      left: `${3 + (i * 37 % 94)}%`,
      '--delay': `${i * 0.12}s`, '--duration': `${7 + i % 3}s`,
      '--drift': `${i % 2 ? -30 : 30}px`, '--tilt': `${i % 2 ? -9 : 9}deg`,
      width: `${48 + i % 4 * 9}px`, color: colors[i % colors.length],
    } as CSSProperties}>
      <svg viewBox="0 0 90 190" fill="none">
        <path d="M45 99C22 120 67 140 44 163S34 180 42 189" stroke="#aa9385" strokeWidth="1.2" />
        {i % 3 === 0 ? <path className="heart-balloon" d="M45 92C34 78 4 59 6 32C8 6 34 5 45 24C56 5 82 6 84 32C86 59 56 78 45 92Z" fill="currentColor" stroke="#99716c" strokeOpacity=".25" /> : <ellipse cx="45" cy="48" rx="36" ry="44" fill="currentColor" stroke="#99716c" strokeOpacity=".25" />}
        <path d="M45 91L39 100Q45 97 51 100Z" fill="currentColor" />
        <path d="M23 39Q23 22 37 17" stroke="white" strokeOpacity=".55" strokeWidth="6" strokeLinecap="round" />
        <path d="M45 62C26 50 35 40 45 47C55 40 64 50 45 62Z" fill="white" fillOpacity=".55" />
      </svg>
    </div>)}
  </div>, document.body)
}

export function FinalSurprise() {
  const c = birthday.surprise
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { if (open) heading.current?.focus({ preventScroll: true }) }, [open])
  return <>
    <FloatingBalloons />
    <motion.section className="final-surprise" aria-labelledby="final-surprise-title" initial={{ opacity: 0, y: reduced ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.7 }}>
      <Heart className="surprise-heart" size={30} aria-hidden="true" />
      <p className="eyebrow">{c.eyebrow}</p>
      <h3 id="final-surprise-title" className="handwriting">{c.title}</h3>
      <p>{c.message}</p>
      <button className="primary-button" aria-expanded={open} aria-controls="secret-message" onClick={() => setOpen(!open)}><Heart size={16} aria-hidden="true" />{open ? c.close : c.open}</button>
      {open && <motion.div id="secret-message" className="secret-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.4 }}>
        <h4 ref={heading} tabIndex={-1} className="handwriting">{c.secretTitle}</h4>
        <p>{c.secretMessage}</p><p className="handwriting secret-signature">{c.signature}</p>
      </motion.div>}
    </motion.section>
  </>
}
