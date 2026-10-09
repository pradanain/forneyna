import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { birthday } from '../config/birthday'

const palette = ['#dfa3b3', '#c5b4d7', '#e8c28d', '#b9c5ae', '#edbdc5']

/** Each wave gets a unique id and a slightly randomised seed so overlapping waves look varied. */
interface BalloonWave { id: number; seed: number }

function BalloonWaveLayer({ seed }: { seed: number }) {
  const count = 18
  return <>{Array.from({ length: count }, (_, i) => {
    const offset = (seed * 13 + i * 37) % 94
    const driftDir = (i + seed) % 2 ? -1 : 1
    const sizeBase = 44 + ((i + seed) % 5) * 8
    return <div key={i} className="floating-balloon" style={{
      left: `${3 + offset}%`,
      '--delay': `${i * 0.11 + (seed % 3) * 0.04}s`,
      '--duration': `${6.5 + (i + seed) % 4}s`,
      '--drift': `${driftDir * (25 + (seed * 7 + i) % 20)}px`,
      '--tilt': `${driftDir * (7 + (seed + i) % 6)}deg`,
      width: `${sizeBase}px`,
      color: palette[(i + seed) % palette.length],
    } as CSSProperties}>
      <svg viewBox="0 0 90 190" fill="none">
        <path d="M45 99C22 120 67 140 44 163S34 180 42 189" stroke="#aa9385" strokeWidth="1.2" />
        {(i + seed) % 3 === 0
          ? <path className="heart-balloon" d="M45 92C34 78 4 59 6 32C8 6 34 5 45 24C56 5 82 6 84 32C86 59 56 78 45 92Z" fill="currentColor" stroke="#99716c" strokeOpacity=".25" />
          : <ellipse cx="45" cy="48" rx="36" ry="44" fill="currentColor" stroke="#99716c" strokeOpacity=".25" />}
        <path d="M45 91L39 100Q45 97 51 100Z" fill="currentColor" />
        <path d="M23 39Q23 22 37 17" stroke="white" strokeOpacity=".55" strokeWidth="6" strokeLinecap="round" />
        <path d="M45 62C26 50 35 40 45 47C55 40 64 50 45 62Z" fill="white" fillOpacity=".55" />
      </svg>
    </div>
  })}</>
}

function FloatingBalloons({ waves, onWaveFinished }: { waves: BalloonWave[]; onWaveFinished: (id: number) => void }) {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const timers = waves.map(w => window.setTimeout(() => onWaveFinished(w.id), 12000))
    return () => timers.forEach(t => window.clearTimeout(t))
  }, [waves, reduced, onWaveFinished])
  if (reduced || waves.length === 0) return null
  return createPortal(
    <div className="balloon-flight" aria-hidden="true">
      {waves.map(w => <div key={w.id} className="balloon-wave"><BalloonWaveLayer seed={w.seed} /></div>)}
    </div>,
    document.body,
  )
}

let nextWaveId = 0

export function FinalSurprise() {
  const c = birthday.surprise
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [waves, setWaves] = useState<BalloonWave[]>(() => [{ id: nextWaveId++, seed: 0 }])
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => { if (open) heading.current?.focus({ preventScroll: true }) }, [open])

  const removeWave = useCallback((id: number) => {
    setWaves(prev => prev.filter(w => w.id !== id))
  }, [])

  function addWave() {
    setWaves(prev => [...prev, { id: nextWaveId++, seed: nextWaveId * 3 + Math.trunc(Math.random() * 100) }])
  }

  return <>
    <FloatingBalloons waves={waves} onWaveFinished={removeWave} />
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
      <button className="balloon-again-button" onClick={addWave} aria-label={c.balloons}>
        <svg viewBox="0 0 90 130" width="20" height="28" fill="none" aria-hidden="true">
          <ellipse cx="45" cy="48" rx="36" ry="44" fill="#edbdc5" stroke="#99716c" strokeOpacity=".25" />
          <path d="M45 91L39 100Q45 97 51 100Z" fill="#edbdc5" />
          <path d="M45 99C22 120 67 130 44 125" stroke="#aa9385" strokeWidth="1.2" />
          <path d="M23 39Q23 22 37 17" stroke="white" strokeOpacity=".55" strokeWidth="6" strokeLinecap="round" />
        </svg>
        {c.balloons}
      </button>
    </motion.section>
  </>
}
