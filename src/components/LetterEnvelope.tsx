import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Heart, MailOpen } from 'lucide-react'
import { birthday } from '../config/birthday'
import { SectionHeading } from './SectionHeading'
import { LetterVine } from './LetterVine'

export function LetterEnvelope() {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const c = birthday.letter
  return <section id="letter" className="letter-section" aria-label={`${c.title} ${c.titleAccent}`}>
    <div className="section-shell">
      <SectionHeading number="02" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} description={c.description} />
      <div className={`envelope-wrap ${open ? 'is-open' : ''}`}>
        <button className="envelope" aria-label={open ? c.close : c.open} aria-expanded={open} aria-controls="birthday-letter" onClick={() => setOpen(!open)}>
          <span className="envelope-back" />
          <span className="envelope-insert handwriting">{c.envelopeLabel}</span>
          <span className="envelope-front" />
          <span className="envelope-flap" />
          <span className="wax-seal"><Heart size={25} strokeWidth={1.2} /></span>
          <span className="envelope-to handwriting">{birthday.forLabel.toLowerCase()} {birthday.nickname} ♡</span>
        </button>
      </div>
      <button className="text-link letter-toggle" aria-expanded={open} aria-controls="birthday-letter" onClick={() => setOpen(!open)}><MailOpen size={17} />{open ? c.close : c.open}</button>
      <div id="birthday-letter">
        <AnimatePresence initial={false}>
          {open && <motion.div className="letter-reveal" initial={{ height: reduced ? 'auto' : 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: reduced ? 'auto' : 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}><motion.article className="letter-paper" initial={{ y: reduced ? 0 : 18 }} animate={{ y: 0 }} transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }} aria-label={c.title + ' ' + c.titleAccent}>
            <LetterVine className="letter-vine vine-top" />
            <LetterVine className="letter-vine vine-bottom" />
            <h3 className="handwriting">{c.salutation}</h3>
            {c.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            <div className="letter-signoff"><p>{c.closing}</p><p className="handwriting">{c.signature}</p></div>
          </motion.article></motion.div>}
        </AnimatePresence>
      </div>
    </div>
  </section>
}
