import { Reveal } from './Reveal'

export function SectionHeading({ number, eyebrow, title, accent, description }: { number: string; eyebrow: string; title: string; accent: string; description: string }) {
  return <Reveal className="section-heading">
    <span className="section-number" aria-hidden="true">{number}</span>
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title} <em>{accent}</em></h2>
    <p className="section-description">{description}</p>
  </Reveal>
}
