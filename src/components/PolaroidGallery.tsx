import { useState } from 'react'
import { ZoomIn } from 'lucide-react'
import { birthday } from '../config/birthday'
import { SectionHeading } from './SectionHeading'
import { PhotoLightbox } from './PhotoLightbox'
import { Reveal } from './Reveal'

export function PolaroidGallery() {
  const [active, setActive] = useState<number | null>(null)
  const c = birthday.gallery
  return <section id="little-things" className="gallery-section section-shell" aria-label={`${c.title} ${c.titleAccent}`}>
    <SectionHeading number="01" eyebrow={c.eyebrow} title={c.title} accent={c.titleAccent} description={c.description} />
    <p className="handwriting gallery-hint">{c.hint}</p>
    <div className="polaroid-grid">
      {c.photos.map((photo, index) => <Reveal key={photo.src} delay={(index % 3) * 0.07}><button className={`polaroid polaroid-${index}`} onClick={() => setActive(index)} aria-label={`${c.openLabel}: ${photo.caption}`}>
        <span className="washi-tape" aria-hidden="true" />
        <span className="photo-image"><img src={photo.src} alt={photo.alt} loading="lazy" width="1080" height="1920" /><span className="photo-zoom" aria-hidden="true"><ZoomIn size={20} /></span></span>
        <span className="polaroid-caption handwriting">{photo.caption}</span>
        <span className="photo-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </button></Reveal>)}
    </div>
    {c.placeholderNote && <p className="placeholder-note">{c.placeholderNote}</p>}
    {active !== null && <PhotoLightbox index={active} onChange={setActive} onClose={() => setActive(null)} />}
  </section>
}
