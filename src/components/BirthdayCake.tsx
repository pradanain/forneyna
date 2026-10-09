import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { RotateCcw, Wind } from 'lucide-react'
import { birthday } from '../config/birthday'
import { celebrate } from '../lib/celebrate'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { FinalSurprise } from './FinalSurprise'
import { BirthdayCat } from './BirthdayCat'

export function BirthdayCake({ onReplay }: { onReplay: () => void }) {
  const c = birthday.wish
  const reduced = useReducedMotion()
  const count = Math.min(7, Math.max(1, Math.trunc(c.candleCount) || 3))
  const [lit, setLit] = useState(() => Array<boolean>(count).fill(true))
  const remaining = lit.filter(Boolean).length
  function extinguish(index?: number) {
    const next = lit.map((value, i) => index === undefined || i === index ? false : value)
    if (remaining && !next.some(Boolean)) void celebrate()
    setLit(next)
  }
  return <section id="wish" className="wish-section section-shell" aria-label={`${c.title} ${c.titleAccent}`}>
    <SectionHeading number="03" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} description={c.description} />
    <Reveal className="cake-scene">
      <span className="cake-star star-left" aria-hidden="true">✧</span><span className="cake-star star-right" aria-hidden="true">✧</span>
      <div className="candles">
        {lit.map((value, i) => <button key={i} className={`candle ${value ? 'lit' : 'out'}`} aria-label={`${value ? c.candleLabel : c.extinguishedLabel} ${i + 1}`} aria-disabled={!value} onClick={() => { if (value) extinguish(i) }}><span className="flame" /><span className="wick" /><span className="candle-body" /></button>)}
      </div>
      <svg viewBox="0 0 340 220" className="cake" aria-hidden="true">
        <ellipse cx="170" cy="195" rx="147" ry="15" fill="#e4d6ca" />
        <ellipse cx="170" cy="187" rx="147" ry="15" fill="#f2e6db" stroke="#cbb6a5" />
        <path d="M50 70V169C50 198 290 198 290 169V70Z" fill="#e9b8c5" />
        <path d="M50 124C111 144 231 144 290 124V144C216 163 107 163 50 144Z" fill="#f7d9df" />
        <path d="M50 70V91C50 119 72 122 72 98V91C72 85 83 85 83 98V113C83 137 105 136 105 113V96C105 86 117 88 117 99V105C117 120 134 120 134 105V100C134 90 146 90 146 101V120C146 145 170 145 170 120V105C170 92 182 93 182 105V108C182 126 204 126 204 108V100C204 90 217 90 217 100V113C217 138 240 138 240 113V95C240 88 252 86 252 96V101C252 119 271 119 271 100V91C271 85 283 85 283 97L290 88V70Z" fill="#fff5e8" />
        <ellipse cx="170" cy="70" rx="120" ry="27" fill="#fff9ee" stroke="#ecdcc9" />
        {[68, 96, 126, 156, 186, 216, 246, 274].map((x, i) => <g key={x}><ellipse cx={x} cy={177 + Math.sin(i / 7 * Math.PI) * 11} rx="10" ry="7" fill="#fff4e7" /><path d={`M${x - 4} ${177 + Math.sin(i / 7 * Math.PI) * 11}q4 -5 8 0`} stroke="#edd9c5" fill="none" /></g>)}
        <path d="M103 56L108 61M133 79L140 75M200 55L205 60M229 78L235 75M77 74L83 76M259 67L265 63" stroke="#c48191" strokeWidth="3" strokeLinecap="round" />
        <path d="M165 54L171 57M189 81L195 80" stroke="#c6ab6f" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </Reveal>
    <BirthdayCat />
    <div aria-live="polite" className="wish-message">
      {remaining ? <><p className="handwriting">{c.hint}</p><span className="sr-only">{c.remainingLabel}: {remaining}</span></> : <motion.div initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}><h3 className="handwriting">{c.successTitle}</h3><p>{c.successMessage}</p></motion.div>}
    </div>
    {remaining > 0 && <button className="primary-button" onClick={() => extinguish()}><Wind size={18} />{c.blow}</button>}
    {remaining === 0 && <FinalSurprise />}
    <button className="text-link replay-button" onClick={onReplay}><RotateCcw size={15} />{c.replay}</button>
  </section>
}
