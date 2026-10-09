import { ArrowDown } from 'lucide-react'
import { Reveal } from './Reveal'
import { birthday } from '../config/birthday'
import { Bow, FlowerSprig } from './Decorations'

export function BirthdayHero() {
  const c = birthday.hero
  return <section id="birthday" className="birthday-section section-shell" aria-labelledby="birthday-heading">
    <Reveal className="hero-photo-area">
      <Bow className="hero-bow" />
      <figure className="portrait-polaroid">
        <span className="washi-tape" aria-hidden="true" />
        <img src={c.portrait.src} alt={c.portrait.alt} width="480" height="600" />
        <figcaption className="handwriting">{c.caption}</figcaption>
      </figure>
      <FlowerSprig className="hero-flower" />
      <span className="hero-annotation handwriting">{c.annotation}</span>
    </Reveal>
    <Reveal className="hero-copy" delay={0.12}>
      <p className="eyebrow">{c.eyebrow}</p>
      <h2 id="birthday-heading" tabIndex={-1}>{c.title}<br /><em>{c.titleAccent}</em></h2>
      <p className="hero-message">{c.message}</p>
      <p className="handwriting hero-note">{c.note}</p>
      <a className="text-link" href="#little-things">{c.next}<ArrowDown size={16} /></a>
    </Reveal>
  </section>
}
